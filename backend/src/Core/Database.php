<?php
namespace App\Core;

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        // Charger la configuration depuis le fichier config
        $config = require_once __DIR__ . '/../../config/database.php';

        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->pdo = new \PDO($dsn, $config['username'], $config['password'], $config['options']);
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
            // Log de la requête et de ses paramètres
            $debugSql = $this->debugSql($sql, $params);
            error_log("Exécution de la requête SQL: " . $debugSql);

            $stmt = $this->pdo->prepare($sql);
            $success = $stmt->execute($params);

            if (!$success) {
                error_log("Erreur d'exécution SQL: " . json_encode($stmt->errorInfo()));
                return false;
            }

            error_log("Requête exécutée avec succès");

            // Pour les requêtes INSERT, UPDATE, DELETE, retourner true
            // Pour les requêtes SELECT, retourner l'objet PDOStatement
            if (stripos($sql, 'SELECT') === 0) {
                return $stmt;
            } else {
                return true;
            }
        } catch (\PDOException $e) {
            error_log("Exception PDO lors de l'exécution de la requête: " . $e->getMessage());
            error_log("Requête SQL: " . ($debugSql ?? $sql));
            error_log("Paramètres: " . json_encode($params));
            return false;
        }
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if (!$stmt || !($stmt instanceof \PDOStatement)) return false;
        return $stmt->fetch();
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if (!$stmt || !($stmt instanceof \PDOStatement)) return [];
        return $stmt->fetchAll();
    }

    public function lastInsertId() {
        $id = $this->pdo->lastInsertId();
        error_log("Dernier ID inséré: " . $id);
        return $id;
    }

    private function debugSql($sql, $params) {
        // Méthode utilitaire pour déboguer les requêtes SQL
        $debugSql = $sql;
        foreach ($params as $param) {
            $value = is_null($param) ? 'NULL' : (is_numeric($param) ? $param : "'" . addslashes($param) . "'");
            $debugSql = preg_replace('/\?/', $value, $debugSql, 1);
        }
        return $debugSql;
    }
}