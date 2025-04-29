<?php
namespace App\Core;

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $host = 'localhost';
        $dbname = 'focus_carot_web';
        $username = 'root';
        $password = '';

        try {
            $this->pdo = new \PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            error_log("Connexion à la base de données réussie");
        } catch (\PDOException $e) {
            error_log("Erreur de connexion à la base de données : " . $e->getMessage());
            die("Erreur de connexion à la base de données : " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->pdo;
    }

    public function query($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $success = $stmt->execute($params);
            
            if (!$success) {
                error_log("Erreur d'exécution SQL: " . json_encode($stmt->errorInfo()));
                return false;
            }
            
            return $stmt;
        } catch (\PDOException $e) {
            error_log("Exception PDO lors de l'exécution de la requête: " . $e->getMessage());
            error_log("Requête SQL: " . $sql);
            error_log("Paramètres: " . json_encode($params));
            return false;
        }
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if (!$stmt) return false;
        return $stmt->fetch();
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if (!$stmt) return [];
        return $stmt->fetchAll();
    }

    public function lastInsertId() {
        $id = $this->pdo->lastInsertId();
        error_log("Dernier ID inséré: " . $id);
        return $id;
    }
}