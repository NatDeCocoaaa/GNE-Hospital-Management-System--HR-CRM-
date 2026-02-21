<?php
require_once 'db_connection.php';

class Billing {
    private $conn;
    private $table = "billing";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByPatient($patient_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE patient_id = :patient_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $patient_id);
        $stmt->execute();
        return $stmt;
    }
}