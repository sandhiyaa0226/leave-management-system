import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ManageStaff from './ManageStaff';
import ManageStudents from './ManageStudents';
import Navbar from '../../components/Navbar';

function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [error, setError] = useState('');

  // Fetch departments when the page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setError('');

    if (!newDeptName.trim()) return;

    try {
      await api.post('/departments', { name: newDeptName });
      setNewDeptName('');
      fetchDepartments(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add department');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <Navbar title="Admin Dashboard" />
      <h2>Admin Dashboard</h2>

      <h3>Departments</h3>

      <form onSubmit={handleAddDepartment} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New department name"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Department</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {departments.map((dept) => (
          <li key={dept.id}>{dept.name}</li>
        ))}
      </ul>
      <hr style={{ margin: '40px 0' }} />
<ManageStaff />
        <hr style={{ margin: '40px 0' }} />
<ManageStudents />
    </div>  
  );
}

export default AdminDashboard;