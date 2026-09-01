const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all departments
router.get('/', (req, res) => {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new department
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Department name is required' });

  db.query('INSERT INTO departments (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name });
  });
});

module.exports = router;