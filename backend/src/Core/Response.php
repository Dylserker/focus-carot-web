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
    
    public function json(array $data): self {
        $this->headers['Content-Type'] = 'application/json';
        $this->body = json_encode($data);
        return $this;
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