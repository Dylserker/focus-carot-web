<?php
namespace App\Middleware;

use App\Core\JWTManager;
use App\Core\Request;
use App\Core\Response;

class AuthMiddleware
{
    private JWTManager $jwtManager;

    public function __construct()
    {
        $this->jwtManager = new JWTManager();
    }

    public function handle(Request $request, callable $next): Response
    {
        $authHeader = $request->getHeader('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new Response(['error' => 'Token manquant'], 401);
        }

        $token = substr($authHeader, 7);
        $payload = $this->jwtManager->verifyToken($token);

        if (!$payload) {
            return new Response(['error' => 'Token invalide'], 401);
        }

        $request->setUser($payload);
        return $next($request);
    }
}