<?php

use App\Core\Routeur;
use App\Controllers\HomeController;
use App\Controllers\UsersController;

return function (Routeur $routeur) {
    $routeur->addRoute(['GET'], '/', HomeController::class, 'index');

    $routeur->addRoute(['GET'], '/users', UsersController::class, 'liste');
    $routeur->addRoute(['GET'], '/users/{id}', UsersController::class, 'user');
};