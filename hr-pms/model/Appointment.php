<?php
require_once 'db_connection.php';

class Appointment {
    private $conn;
    private $table = "appointments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllAppointments() {
        // JOIN with patients so the calendar shows names instead of just IDs
        $query = "SELECT a.*, p.first_name, p.last_name 
                  FROM " . $this->table . " a
                  JOIN patients p ON a.patient_id = p.id 
                  ORDER BY a.appointment_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}