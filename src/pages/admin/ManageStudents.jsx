import { useState, useEffect } from 'react';
import api from '../../api/axios';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roll_number: '',
    department_id: '',
    tutor_id: '',
    hod_id: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchStaff();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const fetchDepartments = async () => {
    const res = await api.get('/departments');
    setDepartments(res.data);
  };

  const fetchStaff = async () => {
    const res = await api.get('/users');
    setAllStaff(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/students/register', form);
      setSuccess('Student added successfully');
      setForm({
        name: '', email: '', password: '', roll_number: '',
        department_id: '', tutor_id: '', hod_id: ''
      });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
    }
  };

  // Only show tutors/HODs belonging to the selected department
  const tutorsInDept = allStaff.filter(
    (u) => u.role === 'tutor' && String(u.department_id) === String(form.department_id)
  );
  const hodsInDept = allStaff.filter(
    (u) => u.role === 'hod' && String(u.department_id) === String(form.department_id)
  );

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h3>Manage Students</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px' }}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={{ padding: '8px', width: '250px' }} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: '8px', width: '250px' }} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: '8px', width: '250px' }} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input type="text" name="roll_number" placeholder="Roll Number" value={form.roll_number} onChange={handleChange} style={{ padding: '8px', width: '250px' }} />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <select name="department_id" value={form.department_id} onChange={handleChange} required style={{ padding: '8px', width: '266px' }}>
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <select name="tutor_id" value={form.tutor_id} onChange={handleChange} required style={{ padding: '8px', width: '266px' }}>
            <option value="">-- Select Tutor --</option>
            {tutorsInDept.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <select name="hod_id" value={form.hod_id} onChange={handleChange} required style={{ padding: '8px', width: '266px' }}>
            <option value="">-- Select HOD --</option>
            {hodsInDept.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Add Student</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h4>Existing Students</h4>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} ({s.roll_number || 'no roll no'}) — {s.department_name} — Tutor: {s.tutor_name}, HOD: {s.hod_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageStudents;