<?php

use App\Controllers\HomeController;
use App\Controllers\UsersController;
use App\Core\Routeur;
use App\Kernel;

require 'vendor/autoload.php';

$routeur = new Routeur();
$routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
$routeur->addRoute(['GET'], '/', HomeController::class, 'index');
$routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');
$routeur->addRoute(['POST'], '/api/login', UsersController::class, 'connexion');

new Kernel($routeur);