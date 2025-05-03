<?php
namespace App\Controllers;

class HomeController {
    public function index() {
        return [
            'message' => 'Bienvenue sur l\'API',
            'status' => 'OK'
        ];
    }
}