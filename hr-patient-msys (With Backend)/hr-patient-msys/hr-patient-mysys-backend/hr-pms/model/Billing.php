<?php
class Billing {
    private $conn;
    private $table_name = "invoices";

    public function __construct($db) { $this->conn = $db; }

    public function getPatientBills($patient_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE patient_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$patient_id]);
        return $stmt;
    }
}
?>