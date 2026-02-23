<?php
class Department {
    private $conn;
    private $table_name = "departments";

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
                  (name, head, budget, employee_count) 
                  VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['head'] ?? '',
            $data['budget'] ?? 0,
            $data['employee_count'] ?? 0
        ]);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET name = ?, head = ?, budget = ?, employee_count = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'] ?? '',
            $data['head'] ?? '',
            $data['budget'] ?? 0,
            $data['employee_count'] ?? 0,
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