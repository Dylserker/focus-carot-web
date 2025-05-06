<?php

use App\Controllers\HomeController;
use App\Controllers\UsersController;
use App\Controllers\AuthController;
use App\Core\Routeur;
use App\Kernel;

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$routeur = new Routeur();
$routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
$routeur->addRoute(['GET'], '/', HomeController::class, 'index');
$routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');
$routeur->addRoute(['POST'], '/api/register', AuthController::class, 'register');
$routeur->addRoute(['POST'], '/api/login', AuthController::class, 'login');
$routeur->addRoute(['GET'], '/favicon.ico', HomeController::class, 'favicon');
$routeur->addRoute(['GET'], '/users/{id}/title', UsersController::class, 'getUserTitle');

new Kernel($routeur);