<?php
require_once 'db_connection.php';

class Admission {
    private $conn;
    private $table = "admissions";

    public function __construct($db) { 
        $this->conn = $db; 
    }

    // CREATE: Used by admit.php
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " SET patient_id = :patient_id, bed_id = :bed_id, status = 'Active'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $data['patient_id']);
        $stmt->bindParam(':bed_id', $data['bed_id']);
        return $stmt->execute();
    }

    // READ: Used by get_admissions.php
    public function getActive() {
        // We JOIN with patients and beds so the UI shows Names and Bed Numbers
        $query = "SELECT a.*, p.first_name, p.last_name, b.bed_number 
                  FROM " . $this->table . " a
                  JOIN patients p ON a.patient_id = p.id
                  JOIN beds b ON a.bed_id = b.id
                  WHERE a.status = 'Active'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}