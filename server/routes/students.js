const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// GET all students (with joined user info)
router.get('/', (req, res) => {
  const query = `
    SELECT students.id, users.name, users.email, students.roll_number,
           departments.name AS department_name,
           tutor.name AS tutor_name,
           hod.name AS hod_name
    FROM students
    JOIN users ON students.user_id = users.id
    JOIN departments ON students.department_id = departments.id
    JOIN users AS tutor ON students.tutor_id = tutor.id
    JOIN users AS hod ON students.hod_id = hod.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST - Register a new student (creates user + student record together)
router.post('/register', async (req, res) => {
  const { name, email, password, department_id, tutor_id, hod_id, roll_number } = req.body;

  if (!name || !email || !password || !department_id || !tutor_id || !hod_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: create the user login
    db.query(
      'INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'student', department_id],
      (err, userResult) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already registered' });
          }
          return res.status(500).json({ error: err.message });
        }

        const userId = userResult.insertId;

        // Step 2: create the student record linking tutor/hod
        db.query(
          'INSERT INTO students (user_id, department_id, tutor_id, hod_id, roll_number) VALUES (?, ?, ?, ?, ?)',
          [userId, department_id, tutor_id, hod_id, roll_number || null],
          (err, studentResult) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: studentResult.insertId, name, email });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;