<?php
namespace App\Models;

use App\Core\Database;

class User {
    public ?int $id = null;
    public string $email;
    public string $password;
    public string $username;
    public string $role;
    public ?string $avatar_url = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->hydrate($data);
        }
    }

    private function hydrate(array $data) {
        foreach ($data as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (method_exists($this, $method)) {
                $this->$method($value);
            } else if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function setId($id) {
        $this->id = (int) $id;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setPassword($password) {
        if (strlen($password) < 60) {
            $this->password = password_hash($password, PASSWORD_DEFAULT);
        } else {
            $this->password = $password;
        }
    }

    public function setUsername($username) {
        $this->username = $username;
    }

    public function setRole($role) {
        $this->role = $role;
    }
    
    public function verifyPassword($password) {
        return password_verify($password, $this->password);
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'username' => $this->username,
            'role' => $this->role,
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

    public static function findAll() {
        $db = Database::getInstance();
        $users = $db->fetchAll("SELECT * FROM users");

        $userObjects = [];
        foreach ($users as $user) {
            $userObjects[] = new self($user);
        }

        return $userObjects;
    }

    public static function findById($id) {
        $db = Database::getInstance();
        $userData = $db->fetch("SELECT * FROM users WHERE id = ?", [$id]);

        if (!$userData) {
            return null;
        }

        return new self($userData);
    }

    public static function findByEmail($email) {
        $db = Database::getInstance();
        $userData = $db->fetch("SELECT * FROM users WHERE email = ?", [$email]);

        if (!$userData) {
            return null;
        }

        return new self($userData);
    }
    
    public static function emailExists($email) {
        $db = Database::getInstance();
        $result = $db->fetch("SELECT COUNT(*) as count FROM users WHERE email = ?", [$email]);
        return $result['count'] > 0;
    }

    public function save() {
        $db = Database::getInstance();
        error_log("Début de la méthode save() pour l'utilisateur avec email: " . $this->email);

        try {
            if ($this->id) {
                $sql = "UPDATE users 
                    SET email = ?, password = ?, username = ?, role = ?, avatar_url = ?
                    WHERE id = ?";

                error_log("SQL de mise à jour: " . $sql);
                error_log("Paramètres de mise à jour: email=" . $this->email . ", username=" . $this->username . ", role=" . ($this->role ?? 'user') . ", id=" . $this->id);

                $result = $db->query($sql, [
                    $this->email,
                    $this->password,
                    $this->username,
                    $this->role ?? 'user',
                    $this->avatar_url,
                    $this->id
                ]);

                error_log("Résultat de la mise à jour: " . ($result ? "succès" : "échec"));

                if (!$result) {
                    error_log("Erreur lors de la mise à jour de l'utilisateur ID: " . $this->id);
                    return false;
                }

                return $this->id;

            } else {
                // Insertion
                $sql = "INSERT INTO users (email, password, username, role, avatar_url) 
                    VALUES (?, ?, ?, ?, ?)";

                error_log("SQL d'insertion: " . $sql);
                error_log("Paramètres d'insertion: email=" . $this->email . ", username=" . $this->username . ", role=" . ($this->role ?? 'user'));

                $result = $db->query($sql, [
                    $this->email,
                    $this->password,
                    $this->username,
                    $this->role ?? 'user',
                    $this->avatar_url
                ]);

                error_log("Résultat de l'insertion: " . ($result ? "succès" : "échec"));

                if (!$result) {
                    error_log("Erreur lors de l'insertion d'un nouvel utilisateur avec email: " . $this->email);
                    return false;
                }

                // Utilise la méthode directe lastInsertId() de Database
                $this->id = (int) $db->lastInsertId();
                error_log("ID obtenu après insertion: " . $this->id);

                if (!$this->id) {
                    error_log("Erreur: Impossible d'obtenir l'ID du nouvel utilisateur inséré");
                    return false;
                }

                error_log("Nouvel utilisateur créé avec l'ID: " . $this->id);

                $this->initializeUserData();

                return $this->id;
            }
        } catch (\Exception $e) {
            error_log("Exception lors de la sauvegarde de l'utilisateur: " . $e->getMessage());
            error_log("Trace: " . $e->getTraceAsString());
            return false;
        }
    }


    private function initializeUserData() {
        if (!$this->id) {
            error_log("Erreur: Impossible d'initialiser les données utilisateur car l'ID n'est pas défini");
            return false;
        }
        
        $db = Database::getInstance();
        $success = true;
        
        try {
            // Initialisation de la progression de l'utilisateur
            $sql = "INSERT INTO user_progression (user_id, level, experience_points, total_experience_earned, current_streak, longest_streak) 
                    VALUES (?, 1, 0, 0, 0, 0)";
            $result = $db->query($sql, [$this->id]);
            if (!$result) {
                error_log("Erreur lors de l'initialisation de la progression pour l'utilisateur ID: " . $this->id);
                $success = false;
            }
        
            // Initialisation des paramètres par défaut
            $sql = "INSERT INTO settings (user_id, notifications_enabled, theme, language, daily_goal) 
                    VALUES (?, 1, 'default', 'fr', 3)";
            $result = $db->query($sql, [$this->id]);
            if (!$result) {
                error_log("Erreur lors de l'initialisation des paramètres pour l'utilisateur ID: " . $this->id);
                $success = false;
            }
            
            // Création du profil utilisateur vide
            $sql = "INSERT INTO user_profiles (user_id, gender) 
                    VALUES (?, 'non_specifie')";
            $result = $db->query($sql, [$this->id]);
            if (!$result) {
                error_log("Erreur lors de la création du profil pour l'utilisateur ID: " . $this->id);
                $success = false;
            }
            
            if ($success) {
                error_log("Données utilisateur initialisées avec succès pour l'utilisateur ID: " . $this->id);
            }
            
            return $success;
            
        } catch (\Exception $e) {
            error_log("Exception lors de l'initialisation des données utilisateur: " . $e->getMessage());
            return false;
        }
    }

    public function delete() {
        if (!$this->id) {
            return false;
        }

        $db = Database::getInstance();
        $db->query("DELETE FROM users WHERE id = ?", [$this->id]);

        return true;
    }
}