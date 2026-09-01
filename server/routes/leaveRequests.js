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

module.exports = router;