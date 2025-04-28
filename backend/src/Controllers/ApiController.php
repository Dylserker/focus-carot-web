<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;

abstract class ApiController extends BaseController {
    
    protected function success(array $data = [], int $statusCode = 200): Response {
        return new Response(
            $statusCode,
            json_encode([
                'success' => true,
                'data' => $data
            ])
        );
    }
    
    protected function error(string $message, int $statusCode = 400): Response {
        return new Response(
            $statusCode,
            json_encode([
                'success' => false,
                'error' => $message
            ])
        );
    }
    
    protected function getJsonData(): array {
        return $this->request->getJsonData();
    }
}
