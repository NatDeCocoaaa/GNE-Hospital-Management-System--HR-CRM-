<?php
class Appointment {
    private $conn;
    private $table_name = "appointments";

    public function __construct($db) { $this->conn = $db; }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY appointment_date DESC";
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
        $query = "SELECT * FROM " . $this->table_name . " WHERE patient_id = ? ORDER BY appointment_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$patient_id]);
        return $stmt;
    }

    public function getByDoctor($doctor_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE doctor_id = ? ORDER BY appointment_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$doctor_id]);
        return $stmt;
    }

    public function create($patient_id, $doctor_id, $appointment_date, $notes) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (patient_id, doctor_id, appointment_date, status, notes) 
                  VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$patient_id, $doctor_id, $appointment_date, 'Scheduled', $notes]);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET appointment_date = ?, doctor_id = ?, status = ?, notes = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['appointment_date'] ?? null,
            $data['doctor_id'] ?? null,
            $data['status'] ?? 'Scheduled',
            $data['notes'] ?? '',
            $id
        ]);
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>