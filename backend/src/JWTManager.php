<?php
namespace App\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTManager
{
    private string $secret;
    private string $algorithm = 'HS256';
    private int $expiration = 3600;

    public function __construct()
    {
        $config = require __DIR__ . '/../config.php';
        $this->secret = $config['jwt']['secret'];
    }

    public function createToken(array $payload): string
    {
        $issuedAt = time();
        $tokenData = [
            'iat' => $issuedAt,
            'exp' => $issuedAt + $this->expiration,
            'data' => $payload
        ];

        return JWT::encode($tokenData, $this->secret, $this->algorithm);
    }

    public function verifyToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            return (array)$decoded->data;
        } catch (\Exception $e) {
            return null;
        }
    }
}