<?php
require_once 'db_connection.php';

class Employee {
    private $conn;
    private $table = "employees";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT e.*, d.dept_name 
                  FROM " . $this->table . " e 
                  LEFT JOIN departments d ON e.dept_id = d.dept_id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}