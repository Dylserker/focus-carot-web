<?php

use App\Controllers\HomeController;
use App\Controllers\UsersController;
use App\Core\Routeur;
use App\Core\TemplateEngine;
use App\Kernel;

require 'vendor/autoload.php';

$routeur = new Routeur();
$routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
$routeur->addRoute(['GET'], '/', HomeController::class, 'index');
$routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');

new Kernel($routeur);