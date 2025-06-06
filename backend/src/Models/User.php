<?php
namespace App\Models;

use App\Core\Database;
use Firebase\JWT\JWT;

class User {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getAll() {
        try {
            $stmt = $this->db->getPDO()->query('SELECT * FROM users');
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function getById($id) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT * FROM users WHERE id = ?');
            $stmt->execute([$id]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function verifierConnexion(string $email, string $password): array|false {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT * FROM users WHERE email = ?');
            $stmt->execute([$email]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $titre = $this->getUserTitle($user['id']);

                $stmt = $this->db->getPDO()->prepare('SELECT level, experience_points FROM user_progression WHERE user_id = ?');
                $stmt->execute([$user['id']]);
                $progression = $stmt->fetch(\PDO::FETCH_ASSOC);

                $key = $_ENV['JWT_SECRET'];
                $payload = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'iat' => time(),
                    'exp' => time() + (60 * 60 * 24)
                ];
                $token = JWT::encode($payload, $key, 'HS256');
                unset($user['password']);

                $user['title'] = $titre['name'] ?? 'Débutant';

                if ($progression) {
                    $nextLevelXp = 10 * pow(2, $progression['level'] - 1);
                    $user['level'] = $progression['level'];
                    $user['progress'] = ($progression['experience_points'] / $nextLevelXp) * 100;
                } else {
                    $user['level'] = 1;
                    $user['progress'] = 0;
                }

                return ['user' => $user, 'token' => $token];
            }
            return false;
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function emailExiste($email) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
            $stmt->execute([$email]);
            return $stmt->fetchColumn() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function creerUtilisateur($data) {
        try {
            $pdo = $this->db->getPDO();
            $pdo->beginTransaction();

            $sql = "INSERT INTO users (email, password, last_name, first_name, username, created_at) 
                   VALUES (:email, :password, :last_name, :first_name, :username, NOW())";

            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute([
                'email' => $data['email'],
                'password' => $data['password'],
                'last_name' => $data['nom'],
                'first_name' => $data['prenom'],
                'username' => $data['pseudo']
            ]);

            if ($result) {
                $userId = $pdo->lastInsertId();
                $pdo->commit();
                return $userId;
            }

            $pdo->rollBack();
            return false;
        } catch (\PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function getUtilisateurParId($id) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT id, email, last_name, first_name, username FROM users WHERE id = ?');
            $stmt->execute([$id]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function getUserTitle($userId) {
        try {
            $query = "SELECT t.name FROM titles t
                  INNER JOIN user_titles ut ON t.id = ut.title_id
                  WHERE ut.user_id = ? AND ut.is_active = 1";
            $stmt = $this->db->getPDO()->prepare($query);
            $stmt->execute([$userId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            error_log('Titre trouvé : ' . print_r($result, true));
            return $result;
        } catch (\PDOException $e) {
            error_log('Erreur SQL : ' . $e->getMessage());
            return false;
        }
    }

    public function updateExperience($userId, $experienceGained) {
        try {
            $pdo = $this->db->getPDO();
            $pdo->beginTransaction();
            $successModel = new Success();
            $successModel->checkLevelAchievements($userId);

            $stmt = $pdo->prepare('SELECT level, experience_points, total_experience_earned FROM user_progression WHERE user_id = ?');
            $stmt->execute([$userId]);
            $currentStats = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$currentStats) {
                $stmt = $pdo->prepare('INSERT INTO user_progression (user_id, level, experience_points, total_experience_earned) VALUES (?, 1, 0, 0)');
                $stmt->execute([$userId]);
                $currentStats = ['level' => 1, 'experience_points' => 0, 'total_experience_earned' => 0];
            }

            $newTotalExperience = $currentStats['total_experience_earned'] + $experienceGained;
            $currentLevel = $currentStats['level'];
            $currentXP = $currentStats['experience_points'] + $experienceGained;

            $xpForNextLevel = 10 * pow(2, $currentLevel - 1);
            while ($currentXP >= $xpForNextLevel) {
                $currentXP -= $xpForNextLevel;
                $currentLevel++;
                $xpForNextLevel = 10 * pow(2, $currentLevel - 1);
            }

            $stmt = $pdo->prepare('UPDATE user_progression SET level = ?, experience_points = ?, total_experience_earned = ? WHERE user_id = ?');
            $stmt->execute([$currentLevel, $currentXP, $newTotalExperience, $userId]);

            $pdo->commit();

            return [
                'level' => $currentLevel,
                'experience' => $currentXP,
                'nextLevelXp' => $xpForNextLevel,
                'progress' => ($currentXP / $xpForNextLevel) * 100
            ];
        } catch (\PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            return false;
        }
    }

    public function delete($id): bool
    {
        try {
            $sql = "DELETE FROM users WHERE id = :id";
            $this->db->prepare($sql);
            $this->db->bind(':id', $id);
            return $this->db->execute();
        } catch (\PDOException $e) {
            error_log('Erreur lors de la suppression de l\'utilisateur : ' . $e->getMessage());
            return false;
        }
    }

    public function emailExisteUpdate($email, $userId) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT COUNT(*) FROM users WHERE email = ? AND id != ?');
            $stmt->execute([$email, $userId]);
            return $stmt->fetchColumn() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function updateUtilisateur($data) {
        try {
            $pdo = $this->db->getPDO();
            $pdo->beginTransaction();

            $setFields = [
                'email = :email',
                'last_name = :last_name',
                'first_name = :first_name',
                'username = :username',
                'role = :role'
            ];

            $params = [
                'id' => $data['id'],
                'email' => $data['email'],
                'last_name' => $data['nom'],
                'first_name' => $data['prenom'],
                'username' => $data['pseudo'],
                'role' => $data['role']
            ];

            if (isset($data['password'])) {
                $setFields[] = 'password = :password';
                $params['password'] = $data['password'];
            }

            $sql = "UPDATE users SET " . implode(', ', $setFields) . " WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute($params);

            if ($result) {
                $pdo->commit();
                return true;
            }

            $pdo->rollBack();
            return false;
        } catch (\PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function getUserProfile($userId) {
        try {
            $sql = "SELECT u.*, up.date_of_birth 
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id 
                WHERE u.id = :id";

            $this->db->prepare($sql);
            $this->db->bind(':id', $userId);
            return $this->db->single();
        } catch (\PDOException $e) {
            error_log('Erreur lors de la récupération du profil : ' . $e->getMessage());
            return null;
        }
    }

    public function updateUserProfile($userId, $data) {
        try {
            $pdo = $this->db->getPDO();
            $pdo->beginTransaction();

            $userUpdateSql = "UPDATE users SET 
            email = :email,
            username = :username,
            first_name = :first_name,
            last_name = :last_name
            WHERE id = :id";

            $stmt = $pdo->prepare($userUpdateSql);
            $stmt->execute([
                'email' => $data['email'],
                'username' => $data['pseudo'],
                'first_name' => $data['prenom'],
                'last_name' => $data['nom'],
                'id' => $userId
            ]);

            $profileSql = "INSERT INTO user_profiles (user_id, date_of_birth) 
            VALUES (:user_id, :date_of_birth)
            ON DUPLICATE KEY UPDATE date_of_birth = :date_of_birth";

            $stmt = $pdo->prepare($profileSql);
            $stmt->execute([
                'user_id' => $userId,
                'date_of_birth' => $data['date_of_birth'] ?? null
            ]);

            if (!empty($data['password'])) {
                $passwordSql = "UPDATE users SET password = :password WHERE id = :id";
                $stmt = $pdo->prepare($passwordSql);
                $stmt->execute([
                    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
                    'id' => $userId
                ]);
            }

            $pdo->commit();
            return true;
        } catch (\PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Erreur lors de la mise à jour du profil : ' . $e->getMessage());
            return false;
        }
    }

    public function updateProfilePicture($userId, $imageData) {
        try {
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]);

                if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif'])) {
                    throw new \Exception('Type d\'image invalide');
                }

                $imageData = base64_decode($imageData);
                if ($imageData === false) {
                    throw new \Exception('Échec du décodage base64');
                }
            } else {
                throw new \Exception('Format d\'image non reconnu');
            }

            $uploadDir = __DIR__ . '/../../public/uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = uniqid() . '.' . $type;
            $filePath = $uploadDir . $fileName;

            file_put_contents($filePath, $imageData);

            $sql = "UPDATE users SET avatar_url = :avatar_url WHERE id = :id";
            $this->db->prepare($sql);
            $this->db->bind(':avatar_url', '/uploads/' . $fileName);
            $this->db->bind(':id', $userId);

            return $this->db->execute();
        } catch (\Exception $e) {
            error_log('Erreur lors de l\'upload de l\'image : ' . $e->getMessage());
            return false;
        }
    }

    public function getProfilePicture($userId)
    {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT avatar_url FROM users WHERE id = ?');
            $stmt->execute([$userId]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            return $result ? $result['avatar_url'] : null;
        } catch (\PDOException $e) {
            error_log('Erreur lors de la récupération de l\'avatar : ' . $e->getMessage());
            return null;
        }
    }
}