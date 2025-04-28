<?php

namespace App\Core;

use Exception;

class TemplateEngine {

    public function __construct(
        public string $templates_dir = 'templates'
    ) {} 

    public function render($template, $context = []) : string {
        $file = "{$this->templates_dir}/$template.php";

        if (!file_exists($file)) {
            throw new Exception("Template $template does not exist");
        }

        $content = file_get_contents($file);

        $content = preg_replace_callback('/{% foreach (\w+) %}(.*?){% endforeach %}/s', function ($matches) use ($context) {
            $varName = trim($matches[1]);
            $loopContent = $matches[2];
            $output = '';

            if (isset($context[$varName]) && is_array($context[$varName])) {
                foreach ($context[$varName] as $item) {
                    $tempContent = $loopContent;
                    foreach ($item as $key => $value) {
                        $tempContent = str_replace("{{ $key }}", htmlspecialchars($value, ENT_QUOTES, 'UTF-8'), $tempContent);
                    }
                    $output .= $tempContent;
                }
            }
            return $output;
            
        }, $content);

        foreach ($context as $key => $value) {
            if(is_array($value)) {
                continue;
            }
            
            $content = str_replace("{{ $key }}", htmlspecialchars($value, ENT_QUOTES, 'UTF-8'), $content);
        }

        return $content;
    }
}