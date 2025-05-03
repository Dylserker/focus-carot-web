<?php
namespace App\Core;

class Request {
    public function __construct(
        private array $server,
        private array $get,
        private array $post
    ) {}

    public function getMethod(): string {
        return $this->server['REQUEST_METHOD'];
    }

    public function getUri(): string {
        return strtok($this->server['REQUEST_URI'], '?');
    }

    public function getParams(): array {
        return $this->get;
    }

    public function getBody(): array {
        return $this->post;
    }
}