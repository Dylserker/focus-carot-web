<?php
namespace App\Controllers;

use App\Models\User;

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
}