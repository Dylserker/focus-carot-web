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
    
    // Convertir l'objet en tableau pour l'API
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

        if ($this->id) {
            $sql = "UPDATE users 
                    SET email = ?, password = ?, username = ?, role = ?, avatar_url = ?
                    WHERE id = ?";

            $db->query($sql, [
                $this->email,
                $this->password,
                $this->username,
                $this->role ?? 'user',
                $this->avatar_url,
                $this->id
            ]);

            return $this->id;

        } else {
            // Insertion
            $sql = "INSERT INTO users (email, password, username, role, avatar_url) 
                    VALUES (?, ?, ?, ?, ?)";

            $db->query($sql, [
                $this->email,
                $this->password,
                $this->username,
                $this->role ?? 'user',
                $this->avatar_url
            ]);

            $this->id = (int) $db->getConnection()->lastInsertId();
            
            // Créer les enregistrements associés (progression utilisateur)
            $this->initializeUserData();

            return $this->id;
        }
    }
    
    // Initialiser les données associées à un nouvel utilisateur
    private function initializeUserData() {
        if (!$this->id) return;
        
        $db = Database::getInstance();
        
        // Créer l'entrée dans user_progression
        $sql = "INSERT INTO user_progression (user_id, level, experience_points) VALUES (?, 1, 0)";
        $db->query($sql, [$this->id]);
        
        // Créer l'entrée dans settings avec les valeurs par défaut
        $sql = "INSERT INTO settings (user_id, notifications_enabled, theme, language, daily_goal) 
                VALUES (?, 1, 'default', 'fr', 3)";
        $db->query($sql, [$this->id]);
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