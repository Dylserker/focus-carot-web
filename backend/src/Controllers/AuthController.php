<?php
namespace App\Controllers;

use App\Models\User;
use App\Core\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;  // Ajoutez cette importation si elle n'existe pas

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
        error_log("Tentative de connexion avec email: " . ($data['email'] ?? 'non fourni'));

        if (!isset($data['email']) || !isset($data['password'])) {
            return Response::error('Email et mot de passe requis', 400);
        }

        $user = User::findByEmail($data['email']);

        if (!$user) {
            error_log("Connexion échouée: utilisateur non trouvé pour l'email " . $data['email']);
            return Response::error('Identifiants invalides', 401);
        }

        if (!$user->verifyPassword($data['password'])) {
            error_log("Connexion échouée: mot de passe incorrect pour l'email " . $data['email']);
            return Response::error('Identifiants invalides', 401);
        }

        error_log("Connexion réussie pour l'utilisateur: " . $data['email']);
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
            'username' => $user->username
        ];

        error_log("Génération de token pour l'utilisateur ID: " . $user->id);
        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function me() {
        error_log("Requête d'authentification /me reçue");

        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            error_log("Aucun en-tête d'autorisation trouvé");
            return Response::error('Non autorisé', 401);
        }

        $auth = explode(' ', $headers['Authorization']);

        if (count($auth) != 2 || $auth[0] != 'Bearer') {
            error_log("Format d'en-tête d'autorisation incorrect: " . $headers['Authorization']);
            return Response::error('Format d\'authentification invalide', 401);
        }

        try {
            $token = $auth[1];
            error_log("Tentative de décodage du token");

            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            error_log("Token décodé avec succès, recherche de l'utilisateur ID: " . $decoded->user_id);

            $user = User::findById($decoded->user_id);

            if (!$user) {
                error_log("Utilisateur non trouvé pour l'ID: " . $decoded->user_id);
                return Response::error('Utilisateur non trouvé', 404);
            }

            error_log("Authentification réussie pour l'utilisateur ID: " . $user->id);
            return Response::json($user->toArray());

        } catch (\Exception $e) {
            error_log("Erreur lors du décodage du token: " . $e->getMessage());
            return Response::error('Token invalide: ' . $e->getMessage(), 401);
        }
    }
}