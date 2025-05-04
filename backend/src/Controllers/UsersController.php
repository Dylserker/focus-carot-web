<?php
namespace App\Controllers;

use App\Core\Database;
use App\Models\User;

class UsersController
{
    private $db;
    private $userModel;

    public function __construct()
    {
        $this->db = new Database();
        $this->userModel = new User();
    }

    public function liste()
    {
        $users = $this->userModel->getAll();
        if ($users) {
            return ['users' => $users];
        }
        return ['error' => 'Erreur lors de la récupération des utilisateurs'];
    }

    public function user($id)
    {
        $user = $this->userModel->getById($id);
        if ($user) {
            return ['user' => $user];
        }
        return ['error' => 'Utilisateur non trouvé'];
    }

    public function connexion($data)
    {
        if (!isset($data['email']) || !isset($data['password'])) {
            return ['error' => 'Email et mot de passe requis'];
        }

        $user = $this->userModel->verifierConnexion($data['email'], $data['password']);

        if ($user) {
            return ['success' => true, 'user' => $user];
        }

        return ['error' => 'Identifiants incorrects'];
    }
}