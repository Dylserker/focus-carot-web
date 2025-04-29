<?php
require_once __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

$base_path = 'backend';
$api_uri_parts = [];
$found_base = false;

foreach ($uri_parts as $part) {
    if ($found_base || $part === $base_path) {
        $found_base = true;
        $api_uri_parts[] = $part;
    }
}

if (count($api_uri_parts) > 0 && $api_uri_parts[0] === $base_path) {
    array_shift($api_uri_parts);
}

if (count($api_uri_parts) >= 1) {
    $resource = $api_uri_parts[0];

    $id = isset($api_uri_parts[1]) ? $api_uri_parts[1] : null;

    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true) ?: [];

    switch ($resource) {
        case 'users':
            $controller = new \App\Controllers\UserController();

            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if ($id) {
                        echo $controller->show($id);
                    } else {
                        echo $controller->index();
                    }
                    break;

                case 'POST':
                    echo $controller->create($data);
                    break;

                case 'PUT':
                    if ($id) {
                        echo $controller->update($id, $data);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID requis pour la mise à jour']);
                    }
                    break;

                case 'DELETE':
                    if ($id) {
                        echo $controller->delete($id);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'ID requis pour la suppression']);
                    }
                    break;

                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Méthode non autorisée']);
            }
            break;

        case 'auth':
            $controller = new \App\Controllers\AuthController();

            // Déterminer l'action en fonction de l'URI
            $action = isset($api_uri_parts[1]) ? $api_uri_parts[1] : null;

            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    if ($action === 'register') {
                        echo $controller->register($data);
                    } elseif ($action === 'login') {
                        echo $controller->login($data);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Action non trouvée']);
                    }
                    break;

                case 'GET':
                    if ($action === 'me') {
                        echo $controller->me();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Action non trouvée']);
                    }
                    break;

                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Méthode non autorisée']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ressource non trouvée']);
    }
} else {
    echo json_encode([
        'message' => 'Bienvenue sur l\'API Focus Carot Web',
        'endpoints' => [
            '/users' => 'Gestion des utilisateurs',
            '/auth' => 'Authentification (register, login, me)'
        ]
    ]);
}