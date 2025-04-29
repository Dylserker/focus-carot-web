<?php
// Ce fichier ne contient que la configuration
return [
    'host' => 'localhost',
    'dbname' => 'focus_carot_web',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'options' => [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
    ]
];