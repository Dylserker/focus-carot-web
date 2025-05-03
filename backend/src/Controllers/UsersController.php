<?php
namespace App\Controllers;

use App\Core\Database;

class UsersController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function liste() {
        try {
            $stmt = $this->db->getPDO()->query('SELECT * FROM users');
            return ['users' => $stmt->fetchAll(\PDO::FETCH_ASSOC)];
        } catch (\PDOException $e) {
            return ['error' => 'Erreur lors de la récupération des utilisateurs'];
        }
    }

    public function user($id) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT * FROM users WHERE id = ?');
            $stmt->execute([$id]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                return ['error' => 'Utilisateur non trouvé'];
            }

            return ['user' => $user];
        } catch (\PDOException $e) {
            return ['error' => 'Erreur lors de la récupération de l\'utilisateur'];
        }
    }
}