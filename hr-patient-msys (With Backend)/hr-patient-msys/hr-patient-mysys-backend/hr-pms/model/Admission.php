<?php
class Admission {
    private $conn;
    private $table_name = "admissions";

    public function __construct($db) { 
        $this->conn = $db; 
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY admission_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getByPatient($patient_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE patient_id = ? ORDER BY admission_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$patient_id]);
        return $stmt;
    }

    public function admitPatient($patient_id, $doctor_id, $bed_id, $diagnosis) {
        $this->conn->beginTransaction();
        try {
            // Create admission record
            $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " 
                                         (patient_id, doctor_id, bed_id, admission_date, diagnosis, status) 
                                         VALUES (?, ?, ?, NOW(), ?, 'Active')");
            $stmt->execute([$patient_id, $doctor_id, $bed_id, $diagnosis]);

            // Update bed status to occupied
            $stmtBed = $this->conn->prepare("UPDATE beds SET status = 'Occupied', patient_id = ? WHERE id = ?");
            $stmtBed->execute([$patient_id, $bed_id]);

            // Update patient status
            $stmtPat = $this->conn->prepare("UPDATE patients SET status = 'Admitted' WHERE id = ?");
            $stmtPat->execute([$patient_id]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function dischargePatient($admission_id) {
        $this->conn->beginTransaction();
        try {
            // Get admission details
            $stmt = $this->conn->prepare("SELECT patient_id, bed_id FROM " . $this->table_name . " WHERE id = ?");
            $stmt->execute([$admission_id]);
            $admission = $stmt->fetch(PDO::FETCH_ASSOC);

            // Update admission record
            $stmtAdm = $this->conn->prepare("UPDATE " . $this->table_name . " 
                                            SET discharge_date = NOW(), status = 'Discharged' 
                                            WHERE id = ?");
            $stmtAdm->execute([$admission_id]);

            // Update bed status
            $stmtBed = $this->conn->prepare("UPDATE beds SET status = 'Available', patient_id = NULL WHERE id = ?");
            $stmtBed->execute([$admission['bed_id']]);

            // Update patient status
            $stmtPat = $this->conn->prepare("UPDATE patients SET status = 'Active' WHERE id = ?");
            $stmtPat->execute([$admission['patient_id']]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }
}
?>