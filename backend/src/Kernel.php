<?php
namespace App;

use App\Core\Request;
use App\Core\Routeur;

class Kernel {
    public function __construct(
        private Routeur $routeur
    ) {
        $this->setupCORS();
        $this->run();
    }

    private function setupCORS() {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json');
    }

    private function run() {
        $request = new Request($_SERVER, $_GET, $_POST);
        $response = $this->routeur->request($request);
        echo json_encode($response->getBody());
    }
}