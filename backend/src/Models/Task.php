<?php
namespace App\Models;

use App\Core\Database;

class Task {
    public ?int $id = null;
    public int $user_id;
    public string $title;
    public ?string $description = null;
    public string $status = 'à_faire';
    public ?string $due_date = null;
    public string $priority = 'moyenne';
    public int $experience_reward = 10;
    public string $created_at;
    public ?string $completed_at = null;

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
    
    // Getters et setters
    public function setId($id) {
        $this->id = (int) $id;
    }
    
    public function setUser_id($userId) {
        $this->user_id = (int) $userId;
    }
    
    public function setTitle($title) {
        $this->title = $title;
    }
    
    public function setDescription($description) {
        $this->description = $description;
    }
    
    public function setStatus($status) {
        $this->status = $status;
    }
    
    public function setDue_date($dueDate) {
        $this->due_date = $dueDate;
    }
    
    public function setPriority($priority) {
        $this->priority = $priority;
    }
    
    public function setExperience_reward($experienceReward) {
        $this->experience_reward = (int) $experienceReward;
    }
    
    public function markAsCompleted() {
        $this->status = 'terminée';
        $this->completed_at = date('Y-m-d H:i:s');
        
        // Augmenter l'expérience de l'utilisateur
        $this->addExperienceToUser();
    }
    
    private function addExperienceToUser() {
        if (!$this->id || !$this->user_id) return;
        
        $db = Database::getInstance();
        
        // Mettre à jour l'expérience de l'utilisateur
        $sql = "UPDATE user_progression 
                SET experience_points = experience_points + ?, 
                    total_experience_earned = total_experience_earned + ?,
                    last_activity_date = CURDATE()
                WHERE user_id = ?";
                
        $db->query($sql, [$this->experience_reward, $this->experience_reward, $this->user_id]);
        
        // Vérifier si l'utilisateur doit monter de niveau (10 * niveau actuel points pour level up)
        $levelUpSql = "UPDATE user_progression 
                      SET level = level + 1, 
                          experience_points = experience_points - (level * 100)
                      WHERE user_id = ? AND experience_points >= (level * 100)";
                      
        $db->query($levelUpSql, [$this->user_id]);
    }
    
    // Convertir l'objet en tableau pour l'API
    public function toArray() {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'priority' => $this->priority,
            'experience_reward' => $this->experience_reward,
            'created_at' => $this->created_at,
            'completed_at' => $this->completed_at
        ];
    }

    // Méthodes d'accès à la base de données
    public static function findAll() {
        $db = Database::getInstance();
        $tasks = $db->fetchAll("SELECT * FROM tasks ORDER BY created_at DESC");
        
        $taskObjects = [];
        foreach ($tasks as $task) {
            $taskObjects[] = new self($task);
        }
        
        return $taskObjects;
    }
    
    public static function findByUserId($userId) {
        $db = Database::getInstance();
        $tasks = $db->fetchAll("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC", [$userId]);
        
        $taskObjects = [];
        foreach ($tasks as $task) {
            $taskObjects[] = new self($task);
        }
        
        return $taskObjects;
    }
    
    public static function findById($id) {
        $db = Database::getInstance();
        $taskData = $db->fetch("SELECT * FROM tasks WHERE id = ?", [$id]);
        
        if (!$taskData) {
            return null;
        }
        
        return new self($taskData);
    }
    
    public function save() {
        $db = Database::getInstance();
        
        if ($this->id) {
            // Mise à jour
            $sql = "UPDATE tasks 
                    SET user_id = ?, title = ?, description = ?, status = ?, 
                        due_date = ?, priority = ?, experience_reward = ?, completed_at = ?
                    WHERE id = ?";
                    
            $db->query($sql, [
                $this->user_id,
                $this->title,
                $this->description,
                $this->status,
                $this->due_date,
                $this->priority,
                $this->experience_reward,
                $this->completed_at,
                $this->id
            ]);
            
            return $this->id;
            
        } else {
            // Insertion
            $sql = "INSERT INTO tasks (user_id, title, description, status, due_date, priority, experience_reward) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
                    
            $db->query($sql, [
                $this->user_id,
                $this->title,
                $this->description,
                $this->status,
                $this->due_date,
                $this->priority,
                $this->experience_reward
            ]);
            
            $this->id = (int) $db->getConnection()->lastInsertId();
            
            return $this->id;
        }
    }
    
    public function delete() {
        if (!$this->id) {
            return false;
        }
        
        $db = Database::getInstance();
        $db->query("DELETE FROM tasks WHERE id = ?", [$this->id]);
        
        return true;
    }
}
