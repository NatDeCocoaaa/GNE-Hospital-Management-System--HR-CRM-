<?php
class Medical_Record {
    private $conn;
    private $table = "medical_records";

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ: Get history for a specific patient
    public function getByPatient($patient_id) {
        // Note: Check if your DB column is 'created_at' or 'record_date'
        $query = "SELECT * FROM " . $this->table . " WHERE patient_id = :patient_id ORDER BY record_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $patient_id);
        $stmt->execute();
        return $stmt;
    }

    // CREATE: Save new record
    public function createRecord($data) {
        $query = "INSERT INTO " . $this->table . " 
                  SET patient_id = :patient_id, 
                      diagnosis = :diagnosis, 
                      treatment_plan = :treatment_plan,
                      record_date = NOW()";
        
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':patient_id' => $data['patient_id'],
            ':diagnosis' => $data['diagnosis'],
            ':treatment_plan' => $data['treatment_plan']
        ]);
    }
}