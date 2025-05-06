<?php
$secretKey = trim(file_get_contents(__DIR__ . '/secret.key'));

return [
    'db' => [
        'host' => 'localhost',
        'name' => 'focus_carot_web',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4'
    ],
    'jwt' => [
        'secret' => $secretKey,
        'expiration' => 3600,
        'algorithm' => 'HS256'
    ]
];