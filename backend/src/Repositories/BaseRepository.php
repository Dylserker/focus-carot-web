<?php

namespace App\Repositories;

use LogicException;
use PDO;
use PDOStatement;

abstract class BaseRepository {

    private PDO $connection;
    private ?PDOStatement $current_statement = null;

    public function __construct(string $dsn = '')
    {
        if(empty($dsn)) {
            $dsn = "mysql:host=localhost:3306;dbname=monapp;charset=utf8";
        }

        $this->connection = new PDO($dsn, 'username', 'password', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    protected function query(string $query) {
        $this->current_statement = $this->connection->prepare($query);

        return $this;
    }

    protected function execute(array $parameters=[]) {
        if($this->current_statement === null) {
            throw new LogicException("You should use function query before execute");
        }

        return $this->current_statement->execute($parameters);
    }

    protected function fetch(array $parameters = []) {
        if($this->current_statement === null) {
            throw new LogicException("You should use function query before execute");
        }

        foreach($parameters as $key => $value) {
            $this->current_statement->bindParam($key, $value);
        }

        return $this->current_statement->fetchAll();
    }
}