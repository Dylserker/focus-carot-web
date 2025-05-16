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
            $titre = $this->userModel->getUserTitle($user['id']);
            $user['title'] = $titre['name'] ?? 'Débutant';
            return ['success' => true, 'user' => $user];
        }

        return ['error' => 'Identifiants incorrects'];
    }

    public function getUserTitle($id)
    {
        $titre = $this->userModel->getUserTitle($id);
        if ($titre) {
            return ['title' => $titre];
        }
        return ['error' => 'Titre non trouvé'];
    }

    public function updateExperience($id) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['experience'])) {
            return ['error' => 'Le montant d\'expérience est requis'];
        }

        $result = $this->userModel->updateExperience($id, $data['experience']);

        if ($result) {
            return ['success' => true, 'progression' => $result];
        }

        return ['error' => 'Erreur lors de la mise à jour de l\'expérience'];
    }

    public function getUserProgression($id) {
        try {
            $stmt = $this->db->getPDO()->prepare('SELECT level, experience_points FROM user_progression WHERE user_id = ?');
            $stmt->execute([$id]);
            $progression = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($progression) {
                $nextLevelXp = 10 * pow(2, $progression['level'] - 1);
                return [
                    'success' => true,
                    'progression' => [
                        'level' => $progression['level'],
                        'progress' => ($progression['experience_points'] / $nextLevelXp) * 100
                    ]
                ];
            }

            return [
                'success' => true,
                'progression' => [
                    'level' => 1,
                    'progress' => 0
                ]
            ];
        } catch (\PDOException $e) {
            return ['error' => 'Erreur lors de la récupération de la progression'];
        }
    }

    public function delete($id)
    {
        try {
            $result = $this->userModel->delete($id);

            if ($result) {
                return ['success' => true, 'message' => 'Utilisateur supprimé avec succès'];
            }

            return ['error' => 'Impossible de supprimer l\'utilisateur'];

        } catch (\Exception $e) {
            return ['error' => 'Erreur lors de la suppression de l\'utilisateur'];
        }
    }

    public function create(): array
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validation des données requises
            if (!isset($data['email']) || !isset($data['password']) ||
                !isset($data['nom']) || !isset($data['prenom']) ||
                !isset($data['pseudo']) || !isset($data['role'])) {
                return ['error' => 'Tous les champs sont requis'];
            }

            // Vérification si l'email existe déjà
            if ($this->userModel->emailExiste($data['email'])) {
                return ['error' => 'Cet email est déjà utilisé'];
            }

            // Hachage du mot de passe
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

            // Création de l'utilisateur
            $userId = $this->userModel->creerUtilisateur([
                'email' => $data['email'],
                'password' => $data['password'],
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'pseudo' => $data['pseudo'],
                'role' => $data['role']
            ]);

            if ($userId) {
                // Récupération de l'utilisateur créé
                $user = $this->userModel->getUtilisateurParId($userId);

                if ($user) {
                    return [
                        'success' => true,
                        'message' => 'Utilisateur créé avec succès',
                        'user' => $user
                    ];
                }
            }

            return ['error' => 'Erreur lors de la création de l\'utilisateur'];

        } catch (\Exception $e) {
            error_log('Erreur lors de la création de l\'utilisateur : ' . $e->getMessage());
            return ['error' => 'Une erreur est survenue lors de la création de l\'utilisateur'];
        }
    }
}