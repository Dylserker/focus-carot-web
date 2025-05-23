<?php
namespace App;

use App\Core\Routeur;

class Kernel {
    public function __construct(
        private Routeur $routeur
    ) {
        $this->setupCORS();
        $this->handle();
    }

    private function setupCORS() {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json');
    }

    private function handle() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $request = new \App\Core\Request($_SERVER, $_GET, $_POST);
        $response = $this->routeur->request($request);

        if ($response->getBody() === null) {
            return;
        }

        http_response_code($response->getStatusCode());
        echo json_encode($response->getBody());
    }
}