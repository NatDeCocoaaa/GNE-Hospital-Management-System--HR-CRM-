<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db_connection.php';
include_once '../model/Admission.php';

class AdmissionController {
    public function admit($db, $data) {
        $admission = new Admission($db);
        if ($admission->admitPatient($data['patient_id'], $data['bed_id'])) {
            http_response_code(201);
            echo json_encode(["message" => "Patient admitted and bed marked as occupied"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Admission process failed"]);
        }
    }
}
?>