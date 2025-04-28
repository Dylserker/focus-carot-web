<?php 

namespace App\Core;

use Exception;
use ReflectionClass;
use App\Controllers\BaseController;

class Routeur {

    public function __construct(
        private array $routes = []
    ) {}

    public function addRoute(string|array $methods, string $path, string $controller, string $action) 
    {
        if (is_string($methods)) {
            $methods = [$methods];
        }

        $this->routes[] = new Route($path, $controller, $action, $methods);
    }

    public function request(Request $request): Response 
    {
        $response = new Response(404, "Route not found");
 
        /** @var Route $route */
        foreach($this->routes as $route) {
            if ($route->isValidFor($request)) {
                $reflected_controller = new ReflectionClass($route->getController());

                $exploded_uri = explode('/', trim($request->uri, '/'));
                $indexes = $this->indexOfParams($route->getPath());
                $params = array_filter($exploded_uri, function($v, $k) use ($indexes) {
                    return in_array($k, $indexes, true);
                }, ARRAY_FILTER_USE_BOTH);

                /** @var BaseController $controller */
                $controller = $reflected_controller->newInstance();
                $controller->setRequest($request);

                try {
                    $result = call_user_func_array(
                        [$controller, $route->getAction()], 
                        $params
                    );

                    if ($result instanceof Response) {
                        $response = $result;
                    } else {
                        $response = new Response(200, $result);
                    }
                } catch(Exception $e) {
                    $response = new Response(500, json_encode([
                        'success' => false,
                        'error' => $e->getMessage()
                    ]));
                    $response->setHeader('Content-Type', 'application/json');
                }

                break;
            }
        }
    
        return $response;
    }

    private function indexOfParams(string $path) : array 
    {
        $exploded_path = explode('/', trim($path, '/'));
        $indexes = [];

        foreach($exploded_path as $key => $value) {
            if(str_contains($value, '{') && str_contains($value, '}')) {
                $indexes[] = $key;
            }
        }
        return $indexes;
    }
}