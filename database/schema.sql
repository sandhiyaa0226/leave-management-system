CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'tutor', 'hod', 'principal') NOT NULL,
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department_id INT NOT NULL,
  tutor_id INT NOT NULL,
  hod_id INT NOT NULL,
  roll_number VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (tutor_id) REFERENCES users(id),
  FOREIGN KEY (hod_id) REFERENCES users(id)
);

CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  department_id INT NOT NULL,
  academic_year VARCHAR(20),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  number_of_days INT NOT NULL,
  reason TEXT NOT NULL,
  attachment VARCHAR(255),
  tutor_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  hod_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  principal_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  final_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE leave_approvals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leave_request_id INT NOT NULL,
  approver_id INT NOT NULL,
  role ENUM('tutor','hod','principal') NOT NULL,
  status ENUM('approved','rejected') NOT NULL,
  remarks TEXT,
  approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);