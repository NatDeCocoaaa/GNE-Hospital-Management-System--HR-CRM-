<?php
class Bed {
    private $conn;
    private $table_name = "beds";

    public function __construct($db) { $this->conn = $db; }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY bed_number ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getAvailable() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE status = 'Available'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getByWard($ward) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE ward = ? ORDER BY bed_number ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$ward]);
        return $stmt;
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET status = ?, patient_id = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['status'] ?? 'Available',
            $data['patient_id'] ?? null,
            $id
        ]);
    }
}
?>