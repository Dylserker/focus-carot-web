<?php
namespace App\Models;

use App\Core\Database;

class Success {
    private Database $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function create(array $data): ?int {
        $sql = "INSERT INTO success (name, description, icon_url, experience_reward, required_value, achievement_type) 
            VALUES (:name, :description, :icon_url, :experience_reward, :required_value, :achievement_type)";

        $this->db->prepare($sql);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':description', $data['description']);
        $this->db->bind(':icon_url', $data['icon_url']);
        $this->db->bind(':experience_reward', $data['experience_reward']);
        $this->db->bind(':required_value', $data['required_value']);
        $this->db->bind(':achievement_type', $data['achievement_type']);

        return $this->db->execute() ? $this->db->lastInsertId() : null;
    }

    public function getAllAchievements(): array {
        $sql = "SELECT * FROM achievements";
        $this->db->prepare($sql);
        $this->db->execute();
        return $this->db->stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUnlockedAchievements(int $userId): ?array {
        $sql = "SELECT * FROM user_achievements WHERE user_id = :user_id AND completed = 1";
        $this->db->prepare($sql);
        $this->db->bind(':user_id', $userId);
        $this->db->execute();
        return $this->db->stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function unlockAchievement(int $userId, int $achievementId): bool {
        try {
            $sql = "SELECT * FROM user_achievements 
                WHERE user_id = :user_id 
                AND achievement_id = :achievement_id";

            $this->db->prepare($sql);
            $this->db->bind(':user_id', $userId);
            $this->db->bind(':achievement_id', $achievementId);
            $existingAchievement = $this->db->single();

            if ($existingAchievement) {
                return false;
            }

            $sql = "SELECT * FROM achievements WHERE id = :achievement_id";
            $this->db->prepare($sql);
            $this->db->bind(':achievement_id', $achievementId);
            $achievement = $this->db->single();

            if (!$achievement) {
                return false;
            }

            $sql = "INSERT INTO user_achievements 
                (user_id, achievement_id, progress, completed, completed_at) 
                VALUES (:user_id, :achievement_id, :progress, :completed, CURRENT_TIMESTAMP)";

            $this->db->prepare($sql);
            $this->db->bind(':user_id', $userId);
            $this->db->bind(':achievement_id', $achievementId);
            $this->db->bind(':progress', $achievement['required_value']);
            $this->db->bind(':completed', 1);

            if ($this->db->execute()) {
                $userModel = new User();
                $userModel->updateExperience($userId, $achievement['experience_reward']);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            error_log('Erreur lors du déblocage du succès : ' . $e->getMessage());
            return false;
        }
    }

    public function getUserAchievements(int $userId): ?array {
        $sql = "SELECT achievement_id FROM user_achievements WHERE user_id = :user_id";
        $this->db->prepare($sql);
        $this->db->bind(':user_id', $userId);
        $result = $this->db->stmt->execute();

        if ($result) {
            return $this->db->stmt->fetchAll(\PDO::FETCH_COLUMN);
        }

        return null;
    }
}