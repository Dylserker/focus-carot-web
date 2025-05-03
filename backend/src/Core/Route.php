<?php

namespace App\Core;

class Route {

    public function __construct(
        private string $path,
        private string $controller,
        private string $action,
        private array $methods = [],
    ) {}

    public function getPath(): string {
        return $this->path;
    }

    public function getMethods(): array {
        return $this->methods;
    }

    public function getController(): string {
        return $this->controller;
    }

    public function getAction(): string {
        return $this->action;
    }

    public function isValidFor(Request $request) {

        $exploded_uri = explode('/', trim($request->uri));
        $exploded_path = explode('/', trim($this->path));

        if($request->uri === $this->path) {
            return true;
        }

        if(count($exploded_uri) !== count($exploded_path)) {
            return false;
        }

        if(!in_array($request->method, $this->getMethods(), true)) {
            return false;
        }

        foreach($exploded_path as $index => $value) {
            $isVariable = str_contains($value, '{') && str_contains($value, '}');
            if($isVariable) {
                continue;
            }

            if($value !== $exploded_uri[$index]) {
                return false;
            }
        }

        return true;
    }
}