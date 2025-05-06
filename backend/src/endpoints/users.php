<?php
require_once __DIR__ . '/../Models/User.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$userModel = new \App\Models\User();

try {
    $users = $userModel->getAll();

    if ($users === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des utilisateurs']);
        exit;
    }

    echo json_encode($users);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}