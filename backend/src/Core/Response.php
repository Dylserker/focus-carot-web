<?php
namespace App\Core;

class Response {
    private array $body = [];  // Initialisation avec un tableau vide
    private int $statusCode = 200;  // Initialisation avec le code 200 par défaut

    public function setBody(array $body): self {
        $this->body = $body;
        return $this;
    }

    public function setStatusCode(int $code): self {
        $this->statusCode = $code;
        return $this;
    }

    public function getBody(): array {
        return $this->body;
    }

    public function getStatusCode(): int {
        return $this->statusCode;
    }
}