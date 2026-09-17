const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Student applies for leave
router.post('/', (req, res) => {
  const { student_id, department_id, academic_year, from_date, to_date, number_of_days, reason, attachment } = req.body;

  if (!student_id || !department_id || !from_date || !to_date || !number_of_days || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO leave_requests
      (student_id, department_id, academic_year, from_date, to_date, number_of_days, reason, attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [student_id, department_id, academic_year || null, from_date, to_date, number_of_days, reason, attachment || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: 'Leave request submitted' });
    }
  );
});

// GET - Fetch leave history for a specific student
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;

  db.query(
    'SELECT * FROM leave_requests WHERE student_id = ? ORDER BY created_at DESC',
    [studentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});
// GET - Fetch all leave requests for students assigned to a specific tutor
router.get('/tutor/:tutorId', (req, res) => {
  const { tutorId } = req.params;

  const query = `
    SELECT leave_requests.*, users.name AS student_name
    FROM leave_requests
    JOIN students ON leave_requests.student_id = students.id
    JOIN users ON students.user_id = users.id
    WHERE students.tutor_id = ?
    ORDER BY leave_requests.created_at DESC
  `;

  db.query(query, [tutorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// PUT - Tutor approves or rejects a leave request
router.put('/:id/tutor-review', (req, res) => {
  const { id } = req.params;
  const { status, remarks, approver_id } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  // Step 1: update the leave_requests table
  db.query(
    'UPDATE leave_requests SET tutor_status = ? WHERE id = ?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 2: log this approval action with remarks
      db.query(
        'INSERT INTO leave_approvals (leave_request_id, approver_id, role, status, remarks) VALUES (?, ?, ?, ?, ?)',
        [id, approver_id, 'tutor', status, remarks || null],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          // If rejected, mark final_status as rejected immediately (rejection stops the chain)
          if (status === 'rejected') {
            db.query('UPDATE leave_requests SET final_status = ? WHERE id = ?', ['rejected', id], (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({ message: 'Leave request rejected by tutor' });
            });
          } else {
            res.json({ message: 'Leave request approved by tutor, sent to HOD' });
          }
        }
      );
    }
  );
});
// GET - Fetch leave requests awaiting HOD review (tutor already approved)
router.get('/hod/:hodId', (req, res) => {
  const { hodId } = req.params;

  const query = `
    SELECT leave_requests.*, users.name AS student_name
    FROM leave_requests
    JOIN students ON leave_requests.student_id = students.id
    JOIN users ON students.user_id = users.id
    WHERE students.hod_id = ? AND leave_requests.tutor_status = 'approved'
    ORDER BY leave_requests.created_at DESC
  `;

  db.query(query, [hodId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// PUT - HOD approves or rejects a leave request
router.put('/:id/hod-review', (req, res) => {
  const { id } = req.params;
  const { status, remarks, approver_id } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  db.query(
    'UPDATE leave_requests SET hod_status = ? WHERE id = ?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        'INSERT INTO leave_approvals (leave_request_id, approver_id, role, status, remarks) VALUES (?, ?, ?, ?, ?)',
        [id, approver_id, 'hod', status, remarks || null],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          if (status === 'rejected') {
            db.query('UPDATE leave_requests SET final_status = ? WHERE id = ?', ['rejected', id], (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({ message: 'Leave request rejected by HOD' });
            });
          } else {
            res.json({ message: 'Leave request approved by HOD, sent to Principal' });
          }
        }
      );
    }
  );
});
// GET - Fetch leave requests awaiting Principal review (HOD already approved)


router.get('/principal/:principalId', (req, res) => {
  const query = `
    SELECT leave_requests.*, users.name AS student_name, departments.name AS department_name
    FROM leave_requests
    JOIN students ON leave_requests.student_id = students.id
    JOIN users ON students.user_id = users.id
    JOIN departments ON students.department_id = departments.id
    WHERE leave_requests.hod_status = 'approved'
    ORDER BY leave_requests.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// PUT - Principal gives final approval or rejection
router.put('/:id/principal-review', (req, res) => {
  const { id } = req.params;
  const { status, remarks, approver_id } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  db.query(
    'UPDATE leave_requests SET principal_status = ?, final_status = ? WHERE id = ?',
    [status, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        'INSERT INTO leave_approvals (leave_request_id, approver_id, role, status, remarks) VALUES (?, ?, ?, ?, ?)',
        [id, approver_id, 'principal', status, remarks || null],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: `Leave request ${status} by Principal (final decision)` });
        }
      );
    }
  );
});
// GET - Admin: fetch ALL leave requests across the college, with student/department info
router.get('/all', (req, res) => {
  const query = `
    SELECT leave_requests.*, users.name AS student_name, departments.name AS department_name
    FROM leave_requests
    JOIN students ON leave_requests.student_id = students.id
    JOIN users ON students.user_id = users.id
    JOIN departments ON students.department_id = departments.id
    ORDER BY leave_requests.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


module.exports = router;
