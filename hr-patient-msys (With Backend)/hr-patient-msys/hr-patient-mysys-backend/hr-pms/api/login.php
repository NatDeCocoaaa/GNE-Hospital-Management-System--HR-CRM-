<?php
// Set response headers to JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only POST requests allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON input"
        ]);
        exit;
    }

    // Extract credentials
    $identifier = $data['email'] ?? $data['username'] ?? null;
    $password = $data['password'] ?? null;

    if (empty($identifier) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Email/username and password are required"
        ]);
        exit;
    }

    // Include database connection
    require_once '../config/db_connection.php';

    // Query users table, joining with employees to get email and name
    $query = "SELECT u.user_id, u.emp_id, u.username, u.password_hash, u.access_role, u.is_active,
                     e.email, CONCAT(e.first_name, ' ', e.last_name) as name, e.role
              FROM users u
              LEFT JOIN employees e ON u.emp_id = e.id
              WHERE u.username = ? OR e.email = ?
              LIMIT 1";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        $error = $conn->errorInfo();
        throw new Exception("Database prepare error: " . $error[2]);
    }
    
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid username/email or password"
        ]);
        exit;
    }

    // Check if user is active
    if (!$user['is_active']) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "User account is inactive"
        ]);
        exit;
    }

    // Verify password (supports bcrypt hashed passwords)
    $password_valid = password_verify($password, $user['password_hash']);
    
    // Password
    if (!$password_valid && $user['password_hash'] === $password) {
        $password_valid = true;
    }

    if (!$password_valid) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid username/email or password"
        ]);
        exit;
    }

    // Generate JWT Token
    $secret = 'your-secret-key-hospital-2024';
    $issued_at = time();
    $expire = $issued_at + (24 * 60 * 60); // 24 hours

    $payload = [
        'iat' => $issued_at,
        'exp' => $expire,
        'user_id' => (int)$user['user_id'],
        'emp_id' => (int)$user['emp_id'],
        'username' => $user['username'],
        'email' => $user['email'] ?? $user['username'],
        'name' => $user['name'] ?? $user['username'],
        'role' => $user['access_role'],
        'department' => 'General'
    ];

    // Simple JWT implementation (header.payload.signature)
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    $payload_json = json_encode($payload);

    $header_encoded = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
    $payload_encoded = rtrim(strtr(base64_encode($payload_json), '+/', '-_'), '=');

    $signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true);
    $signature_encoded = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

    $token = $header_encoded . '.' . $payload_encoded . '.' . $signature_encoded;

    // Return success response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "token" => $token,
        "user" => [
            "id" => (int)$user['user_id'],
            "emp_id" => (int)$user['emp_id'],
            "username" => $user['username'],
            "email" => $user['email'] ?? $user['username'],
            "name" => $user['name'] ?? $user['username'],
            "role" => $user['access_role'],
            "department" => 'General'
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>