<?php
namespace App\Core;

class Routeur {
    private array $routes = [];

    public function addRoute(array $methods, string $path, string $controller, string $action): void {
        $this->routes[] = [
            'methods' => $methods,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }

    public function request(Request $request): Response {
        foreach ($this->routes as $route) {
            if ($this->matchRoute($route, $request)) {
                return $this->executeRoute($route, $request);
            }
        }
        return (new Response())->setBody(['error' => 'Route not found'])->setStatusCode(404);
    }

    private function matchRoute(array $route, Request $request): bool {
        if (!in_array($request->getMethod(), $route['methods'])) {
            return false;
        }

        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $route['path']);
        return preg_match("#^{$pattern}$#", $request->getUri());
    }

    private function executeRoute(array $route, Request $request): Response {
        $controller = new $route['controller']();
        $params = $this->extractParams($route['path'], $request->getUri());
        $result = $controller->{$route['action']}(...$params);

        return (new Response())->setBody($result);
    }

    private function extractParams(string $path, string $uri): array {
        preg_match_all('/\{([^}]+)\}/', $path, $paramNames);
        preg_match('#^' . preg_replace('/\{[^}]+\}/', '([^/]+)', $path) . '$#', $uri, $paramValues);
        array_shift($paramValues);
        return $paramValues;
    }
}