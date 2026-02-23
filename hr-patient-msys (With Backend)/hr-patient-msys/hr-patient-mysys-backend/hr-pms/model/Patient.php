<?php
class Patient {
    private $conn;
    private $table_name = "patients";

    public function __construct($db) { $this->conn = $db; }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
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

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, email, phone, dob, gender, address, status) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['dob'] ?? null,
            $data['gender'] ?? '',
            $data['address'] ?? '',
            $data['status'] ?? 'Active'
        ]);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?, status = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['dob'] ?? null,
            $data['gender'] ?? '',
            $data['address'] ?? '',
            $data['status'] ?? 'Active',
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