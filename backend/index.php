<?php

use App\Controllers\UsersController;
use App\Controllers\AuthController;
use App\Controllers\TasksController;
use App\Controllers\SuccessController;
use App\Core\Routeur;
use App\Kernel;

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$routeur = new Routeur();
$routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
$routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');
$routeur->addRoute(['POST'], '/api/register', AuthController::class, 'register');
$routeur->addRoute(['POST'], '/api/login', AuthController::class, 'login');
$routeur->addRoute(['GET'], '/users/{id}/title', UsersController::class, 'getUserTitle');
$routeur->addRoute(['POST'], '/api/tasks', TasksController::class, 'create');
$routeur->addRoute(['GET'], '/api/tasks/user/{id}', TasksController::class, 'getUserTasks');
$routeur->addRoute(['PUT'], '/api/tasks/{id}', TasksController::class, 'update');
$routeur->addRoute(['DELETE'], '/api/tasks/{id}', TasksController::class, 'delete');
$routeur->addRoute(['POST'], '/api/users/{id}/experience', UsersController::class, 'updateExperience');
$routeur->addRoute(['GET'], '/api/users/{id}/experience', UsersController::class, 'getUserProgression');
$routeur->addRoute(['GET'], '/api/achievements', SuccessController::class, 'getAllAchievements');

new Kernel($routeur);