<?php
require_once 'db_connection.php';

class Schedule {
    private $conn;
    private $table = "schedules";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get schedule for one specific person
    public function getByEmployee($emp_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE employee_id = :emp_id ORDER BY day_of_week";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':emp_id', $emp_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get all schedules for the hospital dashboard
    public function getAll() {
        $query = "SELECT s.*, e.first_name, e.last_name 
                  FROM " . $this->table . " s 
                  JOIN employees e ON s.employee_id = e.id 
                  ORDER BY s.day_of_week ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}