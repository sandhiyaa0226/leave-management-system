import { useState, useEffect } from 'react';
import api from '../../api/axios';

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tutor',
    department_id: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/users');
      // Only show tutor, hod, principal (not admin, not students)
      const staffOnly = res.data.filter((u) =>
        ['tutor', 'hod', 'principal'].includes(u.role)
      );
      setStaff(staffOnly);
    } catch (err) {
      setError('Failed to load staff');
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/users/register', form);
      setSuccess(`${form.role.toUpperCase()} account created successfully`);
      setForm({ name: '', email: '', password: '', role: 'tutor', department_id: '' });
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create staff account');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h3>Manage Staff (Tutor / HOD / Principal)</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <select name="role" value={form.role} onChange={handleChange} style={{ padding: '8px', width: '266px' }}>
            <option value="tutor">Tutor</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
          </select>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            style={{ padding: '8px', width: '266px' }}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Add Staff</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h4>Existing Staff</h4>
      <ul>
        {staff.map((s) => (
          <li key={s.id}>
            {s.name} — {s.email} — <strong>{s.role.toUpperCase()}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageStaff;