<?php
class Employee {
    private $conn;
    private $table_name = "employees";

    public function __construct($db) { $this->conn = $db; }

    public function readAll() {
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

    public function getDoctors() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE role = 'Doctor' AND status = 'Active'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (name, email, phone, role, department, status, salary, joined)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['role'] ?? '',
            $data['department'] ?? '',
            $data['status'] ?? 'Active',
            $data['salary'] ?? 0,
            $data['joined'] ?? date('Y-m-d')
        ]);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET name = ?, email = ?, phone = ?, role = ?, department = ?, status = ?, salary = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['role'] ?? '',
            $data['department'] ?? '',
            $data['status'] ?? 'Active',
            $data['salary'] ?? 0,
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