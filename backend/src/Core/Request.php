<?php

namespace App\Core;

class Request {

    public string $uri;
    public string $method;
    public array $query;
    public array $request;
    public array $json;

    public function __construct($server, $get, $post) {
        $this->uri = $server['REQUEST_URI'];
        $this->method = $server['REQUEST_METHOD'];
        $this->query = $get;
        $this->request = $post;
        $this->json = [];

        $contentType = isset($server['CONTENT_TYPE']) ? $server['CONTENT_TYPE'] : '';
        if (strpos($contentType, 'application/json') !== false) {
            $jsonData = file_get_contents('php://input');
            $this->json = json_decode($jsonData, true) ?? [];
        }
    }
    
    public function getJsonData(): array {
        return $this->json;
    }
    
    public function getParam(string $key, $default = null) {
        if (isset($this->query[$key])) {
            return $this->query[$key];
        }
        
        if (isset($this->request[$key])) {
            return $this->request[$key];
        }
        
        if (isset($this->json[$key])) {
            return $this->json[$key];
        }
        
        return $default;
    }
}