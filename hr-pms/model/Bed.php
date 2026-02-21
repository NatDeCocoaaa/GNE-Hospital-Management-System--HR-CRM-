<?php
require_once 'db_connection.php';

class Bed {
    private $conn;
    private $table = "beds";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getStatus() {
        // Fetches all beds; you can add WHERE is_occupied = 0 if you only want free beds
        $query = "SELECT * FROM " . $this->table . " ORDER BY bed_number ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}