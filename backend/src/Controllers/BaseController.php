<?php 

namespace App\Controllers;

use App\Core\Request;
use App\Core\TemplateEngine;

abstract class BaseController {
    
    protected Request $request;

    public function __construct(
        private TemplateEngine $templateEngine = new TemplateEngine(__DIR__ . '/../../templates'),
    ) {}
    
    protected function render(string $filepath, array $context) : string {
        return $this->templateEngine->render($filepath, $context);
    }

    public function setRequest(Request $request) {
        $this->request = $request;
    }

    protected function getRequest() : Request {
        return $this->request;
    }
}