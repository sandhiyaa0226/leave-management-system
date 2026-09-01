const userRoutes = require('./routes/users');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); // just to trigger the connection
const studentRoutes = require('./routes/students');
const departmentRoutes = require('./routes/departments');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Leave Management System API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});