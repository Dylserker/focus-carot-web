<?php

// Configuration CORS pour API React
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Si c'est une requête OPTIONS (preflight), terminer immédiatement
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

use App\Controllers\HomeController;
use App\Controllers\UsersController;
use App\Controllers\ExampleApiController;
use App\Core\Routeur;
use App\Core\TemplateEngine;
use App\Kernel;

require 'vendor/autoload.php';

// Définir le Content-Type après avoir vérifié si c'est une requête API
$uri = $_SERVER['REQUEST_URI'];
if (strpos($uri, '/api/') !== false) {
    header('Content-Type: application/json');
} else {
    header('Content-Type: text/html; charset=UTF-8');
}

$routeur = new Routeur();

// Routes existantes
$routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
$routeur->addRoute(['GET'], '/', HomeController::class, 'index');
$routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');

// Routes API pour React
$routeur->addRoute(['GET'], '/api/items', ExampleApiController::class, 'getItems');
$routeur->addRoute(['GET'], '/api/items/{id}', ExampleApiController::class, 'getItem');
$routeur->addRoute(['POST'], '/api/items', ExampleApiController::class, 'createItem');
$routeur->addRoute(['PUT'], '/api/items/{id}', ExampleApiController::class, 'updateItem');
$routeur->addRoute(['DELETE'], '/api/items/{id}', ExampleApiController::class, 'deleteItem');

new Kernel($routeur);