<?php
namespace App\Models;

use App\Core\Database;

class Task {
    private Database $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function create(array $data): ?int {
        $statusMapping = [
            'todo' => 'à_faire',
            'in_progress' => 'en_cours',
            'done' => 'terminée'
        ];

        $priorityMapping = [
            'low' => 'basse',
            'medium' => 'moyenne',
            'high' => 'haute'
        ];

        $sql = "INSERT INTO tasks (user_id, title, description, status, due_date, priority, experience_reward) 
            VALUES (:user_id, :title, :description, :status, :due_date, :priority, :experience_reward)";

        $this->db->prepare($sql);
        $this->db->bind(':user_id', $data['user_id']);
        $this->db->bind(':title', $data['title']);
        $this->db->bind(':description', $data['description']);
        $this->db->bind(':status', $statusMapping[$data['status']] ?? 'à_faire');
        $this->db->bind(':due_date', $data['due_date']);
        $this->db->bind(':priority', $priorityMapping[$data['priority']] ?? 'moyenne');
        $this->db->bind(':experience_reward', $data['experience_reward']);

        return $this->db->execute() ? $this->db->lastInsertId() : null;
    }

    public function getById(int $id): ?array {
        $sql = "SELECT * FROM tasks WHERE id = :id";
        $this->db->prepare($sql);
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    public function getTasksByUserId(int $userId): ?array {
        $sql = "SELECT * FROM tasks WHERE user_id = :user_id ORDER BY due_date ASC";
        $this->db->prepare($sql);
        $this->db->bind(':user_id', $userId);
        $result = $this->db->stmt->execute();

        if ($result) {
            return $this->db->stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE tasks SET 
            title = :title, 
            description = :description, 
            status = :status, 
            due_date = :due_date, 
            priority = :priority 
            WHERE id = :id";

        $this->db->prepare($sql);
        $this->db->bind(':id', $id);
        $this->db->bind(':title', $data['title']);
        $this->db->bind(':description', $data['description']);
        $this->db->bind(':status', $data['status']);
        $this->db->bind(':due_date', $data['due_date']);
        $this->db->bind(':priority', $data['priority']);

        return $this->db->execute();
    }
}