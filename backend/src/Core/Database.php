<?php
namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private $pdo;

    public function __construct()
    {
        $config = require __DIR__ . '/../config.php';
        try {
            $this->pdo = new PDO(
                "mysql:host={$config['db']['host']};dbname={$config['db']['name']}",
                $config['db']['user'],
                $config['db']['pass']
            );
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new \Exception("Erreur de connexion : " . $e->getMessage());
        }
    }

    public function getPDO(): PDO
    {
        return $this->pdo;
    }

    public function prepare($sql): void {
        $this->stmt = $this->pdo->prepare($sql);
    }

    public function bind($param, $value, $type = null): void {
        if (is_null($type)) {
            $type = match(true) {
                is_int($value) => PDO::PARAM_INT,
                is_bool($value) => PDO::PARAM_BOOL,
                is_null($value) => PDO::PARAM_NULL,
                default => PDO::PARAM_STR
            };
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    public function execute(): bool {
        return $this->stmt->execute();
    }

    public function single(): mixed {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }
}