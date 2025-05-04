<?php
namespace App\Controllers;

class HomeController {
    public function index() {
        return [
            'message' => 'Bienvenue sur l\'API',
            'status' => 'OK'
        ];
    }

    public function favicon() {
        header('Content-Type: image/x-icon');
        echo file_get_contents(__DIR__ . '/../../public/favicon.ico');
        exit;
    }
}