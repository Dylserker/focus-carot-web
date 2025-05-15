<?php
namespace App\Models;

use App\Core\Database;

class Task {
    private Database $db;
    private Success $successModel;

    public function __construct() {
        $this->db = new Database();
        $this->successModel = new Success();
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

        $success = $this->db->execute();
        $taskId = $success ? $this->db->lastInsertId() : null;

        if ($taskId) {
            $sql = "SELECT COUNT(*) as count FROM tasks WHERE user_id = :user_id";
            $this->db->prepare($sql);
            $this->db->bind(':user_id', $data['user_id']);
            $result = $this->db->single();

            if ($result && (int)$result['count'] === 1) {
                $successModel = new Success();
                $successModel->unlockAchievement($data['user_id'], 1);
            }
        }

        return $taskId;
    }

    public function getById(int $id): ?array {
        $sql = "SELECT * FROM tasks WHERE id = :id";
        $this->db->prepare($sql);
        $this->db->bind(':id', $id);
        $result = $this->db->single();
        
        if (!$result) {
            return null;
        }
        
        return $result;
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

    public function delete(int $id): bool {
        $sql = "DELETE FROM tasks WHERE id = :id";
        $this->db->prepare($sql);
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    public function checkAchievements(int $userId): void {
        try {
            $sql = "SELECT COUNT(*) as total FROM tasks WHERE user_id = :user_id";
            $this->db->prepare($sql);
            $this->db->bind(':user_id', $userId);
            $result = $this->db->single();

            if ($result && $result['total'] === 1) {
                $this->successModel->unlockAchievement($userId, 1);
            }

            $sql = "SELECT COUNT(*) as total, 
                SUM(CASE WHEN status = 'terminée' THEN 1 ELSE 0 END) as completed 
                FROM tasks 
                WHERE user_id = :user_id 
                AND DATE(created_at) = CURDATE()";
            $this->db->prepare($sql);
            $this->db->bind(':user_id', $userId);
            $result = $this->db->single();

            if ($result && $result['total'] > 0 && $result['total'] === $result['completed']) {
                $this->successModel->unlockAchievement($userId, 2);
            }

            $sql = "SELECT COUNT(*) as total 
                FROM tasks 
                WHERE user_id = :user_id 
                AND priority = 'haute' 
                AND status = 'terminée'";
            $this->db->prepare($sql);
            $this->db->bind(':user_id', $userId);
            $result = $this->db->single();

            if ($result && $result['total'] === 1) {
                $this->successModel->unlockAchievement($userId, 3);
            }

            if ($result && $result['total'] >= 10) {
                $this->successModel->unlockAchievement($userId, 4);
            }

        } catch (\Exception $e) {
            error_log('Erreur lors de la vérification des succès : ' . $e->getMessage());
        }
    }
}