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

    public function getAllAchievements(): ?array
    {
        $sql = "SELECT * FROM achievements ORDER BY id ASC";
        $this->db->prepare($sql);
        $result = $this->db->stmt->execute();

        if ($result) {
            return $this->db->stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }
}