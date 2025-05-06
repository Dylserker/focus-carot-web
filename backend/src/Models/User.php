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
}