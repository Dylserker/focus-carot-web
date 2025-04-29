<?php
namespace App\Controllers;

use App\Models\User;
use App\Core\Response;
use Firebase\JWT\JWT;

class AuthController {
    private $secretKey = "votre_cle_secrete_jwt";
    
    public function register($data) {
        error_log("Tentative d'inscription avec les données: " . json_encode($data));
        
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            error_log("Données d'inscription incomplètes");
            return Response::error('Email, mot de passe et nom d\'utilisateur requis', 400);
        }
    
        if (User::emailExists($data['email'])) {
            error_log("Tentative d'inscription avec un email déjà utilisé: " . $data['email']);
            return Response::error('Cet email est déjà utilisé', 400);
        }
    
        try {
            $user = new User();
            $user->setEmail($data['email']);
            $user->setPassword($data['password']);
            $user->setUsername($data['username']);
            $user->role = $data['role'] ?? 'user';
            $user->avatar_url = $data['avatar_url'] ?? null;
            
            error_log("Tentative de sauvegarde de l'utilisateur: " . $data['email']);
            $userId = $user->save();
            
            if (!$userId) {
                error_log("Échec de l'inscription pour l'utilisateur: " . $data['email']);
                return Response::error('Erreur lors de l\'inscription, veuillez vérifier les logs', 500);
            }
            
            error_log("Inscription réussie pour l'utilisateur: " . $data['email'] . " avec ID: " . $userId);
            
            $token = $this->generateToken($user);
            
            return Response::json([
                'user' => $user->toArray(),
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            error_log("Exception lors de l'inscription: " . $e->getMessage());
            return Response::error('Erreur lors de l\'inscription: ' . $e->getMessage(), 500);
        }
    }
    
    public function login($data) {
        if (!isset($data['email']) || !isset($data['password'])) {
            return Response::error('Email et mot de passe requis', 400);
        }

        $user = User::findByEmail($data['email']);

        if (!$user || !$user->verifyPassword($data['password'])) {
            return Response::error('Identifiants invalides', 401);
        }

        $token = $this->generateToken($user);

        return Response::json([
            'user' => $user->toArray(),
            'token' => $token
        ]);
    }

    private function generateToken($user) {
        $payload = [
            'iss' => 'focus_carot_web',
            'aud' => 'focus_carot_web',
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24),
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'nom' => $user->nom,
            'prenom' => $user->prenom
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function me() {
        
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            return Response::error('Non autorisé', 401);
        }
        
        $auth = explode(' ', $headers['Authorization']);
        
        if (count($auth) != 2 || $auth[0] != 'Bearer') {
            return Response::error('Format d\'authentification invalide', 401);
        }
        
        try {
            $token = $auth[1];
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            $user = User::findById($decoded->user_id);
            
            if (!$user) {
                return Response::error('Utilisateur non trouvé', 404);
            }
            
            return Response::json($user);
            
        } catch (\Exception $e) {
            return Response::error('Token invalide: ' . $e->getMessage(), 401);
        }
    }
}
