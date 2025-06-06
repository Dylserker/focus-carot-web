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
$routeur->addRoute(['GET'], '/api/users/{id}/achievements', SuccessController::class, 'getUserAchievements');
$routeur->addRoute(['DELETE'], '/api/users/{id}', UsersController::class, 'delete');
$routeur->addRoute(['POST'], '/api/users', UsersController::class, 'create');
$routeur->addRoute(['PUT'], '/api/users/{id}', UsersController::class, 'update');
$routeur->addRoute(['GET'], '/api/users/{id}/profile', UsersController::class, 'getUserProfile');
$routeur->addRoute(['PUT'], '/api/users/{id}/profile', UsersController::class, 'updateUserProfile');
$routeur->addRoute(['POST'], '/api/users/{id}/profile-picture', UsersController::class, 'updateProfilePicture');
$routeur->addRoute(['GET'], '/api/users/{id}/avatar', UsersController::class, 'getProfilePicture');
$routeur->addRoute(['POST'], '/api/users/{id}/achievements/{achievementId}/unlock', SuccessController::class, 'unlockAchievement');
$routeur->addRoute(['POST'], '/api/users/{id}/achievements/{achievementId}/lock', SuccessController::class, 'lockAchievement');
$routeur->addRoute(['PUT'], '/api/users/{id}/progression', UsersController::class, 'updateProgression');

new Kernel($routeur);