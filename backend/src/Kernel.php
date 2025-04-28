<?php

namespace App;

use App\Core\Request;
use App\Core\Response;
use App\Core\Routeur;

class Kernel {

    public function __construct(
        private Routeur $routeur
    ) {
        $this->run();
    }

    private function run() {
        $request = new Request($_SERVER, $_GET, $_POST);
        $response = $this->routeur->request($request);

        http_response_code($response->getCode());

        foreach ($response->getHeaders() as $name => $value) {
            header("$name: $value");
        }

        echo $response->getBody();
    }
}