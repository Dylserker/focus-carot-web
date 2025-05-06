<?php
namespace App\Controllers;

use App\Models\User;
use Firebase\JWT\JWT;

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login() {
        ob_clean();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Email et mot de passe requis'
                ]);
                exit;
            }

            $result = $this->userModel->verifierConnexion($data['email'], $data['password']);

            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'user' => $result['user'],
                    'token' => $result['token']
                ]);
            } else {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Identifiants invalides'
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erreur serveur'
            ]);
        }
        exit;
    }

    public function register() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['email']) || !isset($data['password']) ||
                !isset($data['nom']) || !isset($data['prenom']) ||
                !isset($data['pseudo'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Tous les champs sont requis'
                ]);
                exit;
            }

            if ($this->userModel->emailExiste($data['email'])) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => 'Cet email est déjà utilisé'
                ]);
                exit;
            }

            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $userId = $this->userModel->creerUtilisateur([
                'email' => $data['email'],
                'password' => $hashedPassword,
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'pseudo' => $data['pseudo']
            ]);

            if ($userId) {
                $user = $this->userModel->getUtilisateurParId($userId);
                $payload = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'iat' => time(),
                    'exp' => time() + (60 * 60 * 24)
                ];
                $token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'user' => $user,
                    'token' => $token
                ]);
            } else {
                throw new \Exception('Erreur lors de la création de l\'utilisateur');
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ]);
        }
        exit;
    }
}