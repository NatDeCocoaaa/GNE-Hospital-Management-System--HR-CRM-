<?php
class Department {
    private $conn;
    private $table = "departments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        // Fetches all departments for the dropdowns and lists
        $query = "SELECT * FROM " . $this->table . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}