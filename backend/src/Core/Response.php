<?php

namespace App\Core;

class Response {
    private array $headers = [];

    public function __construct(
        private int $code = 200, 
        private string $body = ""
    ) {
        $this->headers['Content-Type'] = 'text/html; charset=UTF-8';
    }

    public function getCode() : int {
        return $this->code;
    }

    public function getBody() : string {
        return $this->body;
    }
    
    public function setHeader(string $name, string $value): self {
        $this->headers[$name] = $value;
        return $this;
    }
    
    public function getHeaders(): array {
        return $this->headers;
    }
    
    public function setCode(int $code): self {
        $this->code = $code;
        return $this;
    }
    
    public function setBody(string $body): self {
        $this->body = $body;
        return $this;
    }

    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');

        if (is_object($data) && method_exists($data, 'toArray')) {
            $data = $data->toArray();
        } elseif (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_object($value) && method_exists($value, 'toArray')) {
                    $data[$key] = $value->toArray();
                }
            }
        }
        
        return json_encode([
            'status' => $statusCode < 400 ? 'success' : 'error',
            'data' => $data
        ]);
    }
    
    public static function error($message, $statusCode = 400) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        return json_encode([
            'status' => 'error',
            'message' => $message
        ]);
    }

    public function send(): void {
        http_response_code($this->code);
        
        foreach ($this->headers as $name => $value) {
            header("$name: $value");
        }
        
        echo $this->body;
        exit;
    }
}