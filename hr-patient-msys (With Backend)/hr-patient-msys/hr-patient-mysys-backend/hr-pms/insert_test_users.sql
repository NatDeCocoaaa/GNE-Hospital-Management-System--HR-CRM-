-- Test users for Hospital Management System
-- Passwords: all use "password123" hashed with bcrypt

-- Check existing employees first and use their IDs, or add new ones
-- Insert test employees
SET @emp_hr_id = (SELECT id FROM employees WHERE email = 'juan.delacruz@hospital.com' LIMIT 1);
SET @emp_doc_id = (SELECT id FROM employees WHERE email = 'maria.santos@hospital.com' LIMIT 1);
SET @emp_desk_id = (SELECT id FROM employees WHERE email = 'jose.reyes@hospital.com' LIMIT 1);

-- If employees don't exist, insert them
INSERT IGNORE INTO `employees` (`first_name`, `last_name`, `role`, `email`, `hire_date`, `status`) 
VALUES 
('Juan', 'Dela Cruz', 'HR', 'juan.delacruz@hospital.com', NOW(), 'Active'),
('Maria', 'Santos', 'Doctor', 'maria.santos@hospital.com', NOW(), 'Active'),
('Jose', 'Reyes', 'FrontDesk', 'jose.reyes@hospital.com', NOW(), 'Active');

-- Get the employee IDs 
SET @emp_hr_id = (SELECT id FROM employees WHERE email = 'juan.delacruz@hospital.com' LIMIT 1);
SET @emp_doc_id = (SELECT id FROM employees WHERE email = 'maria.santos@hospital.com' LIMIT 1);
SET @emp_desk_id = (SELECT id FROM employees WHERE email = 'jose.reyes@hospital.com' LIMIT 1);

-- Insert users (password: password123, hashed)
INSERT IGNORE INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES 
(@emp_hr_id, 'juan.delacruz@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'HR', 1);

INSERT IGNORE INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES 
(@emp_doc_id, 'maria.santos@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'Doctor', 1);

INSERT IGNORE INTO `users` (`emp_id`, `username`, `password_hash`, `access_role`, `is_active`) 
VALUES 
(@emp_desk_id, 'jose.reyes@hospital.com', '$2y$10$8K9p/.n9U6v8NlXf0v0xueN5jH5S.WjG2F.M8A3H8k/1X8Z3.C7Q.', 'FrontDesk', 1);
