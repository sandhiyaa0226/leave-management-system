import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { formatDate, formatAppliedDate } from '../../utils/formatDate';

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [studentInfo, setStudentInfo] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [form, setForm] = useState({
    from_date: '',
    to_date: '',
    reason: '',
    attachment: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyStudentRecord();
  }, []);

  // Find this logged-in user's student record (to get student_id, department_id)
  const fetchMyStudentRecord = async () => {
    try {
      const res = await api.get('/students');
      const mine = res.data.find((s) => s.email === user.email);
      if (mine) {
        setStudentInfo(mine);
        fetchLeaveHistory(mine.id);
      }
    } catch (err) {
      setError('Failed to load student info');
    }
  };

  const fetchLeaveHistory = async (studentId) => {
    try {
      const res = await api.get(`/leave-requests/student/${studentId}`);
      setLeaveHistory(res.data);
    } catch (err) {
      setError('Failed to load leave history');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateDays = () => {
    if (!form.from_date || !form.to_date) return 0;
    const from = new Date(form.from_date);
    const to = new Date(form.to_date);
    const diff = (to - from) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const number_of_days = calculateDays();
    if (number_of_days <= 0) {
      setError('End date must be after start date');
      return;
    }

    try {
      await api.post('/leave-requests', {
        student_id: studentInfo.id,
        department_id: studentInfo.department_id,
        from_date: form.from_date,
        to_date: form.to_date,
        number_of_days,
        reason: form.reason,
        attachment: form.attachment
      });
      setSuccess('Leave request submitted successfully');
      setForm({ from_date: '', to_date: '', reason: '', attachment: '' });
      fetchLeaveHistory(studentInfo.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    }
  };

  if (!studentInfo) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <Navbar title="Student Dashboard" />
      <h2>Welcome, {studentInfo.name}</h2>
      <p>Roll No: {studentInfo.roll_number || 'Not assigned'} | Department: {studentInfo.department_name} | Tutor: {studentInfo.tutor_name} | HOD: {studentInfo.hod_name}</p>

      <h3>Apply for Leave</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px' }}>
          <label>From: </label>
          <input type="date" name="from_date" value={form.from_date} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label>To: </label>
          <input type="date" name="to_date" value={form.to_date} onChange={handleChange} required />
        </div>
        <p>Number of days: {calculateDays()}</p>
        <div style={{ marginBottom: '8px' }}>
          <textarea
            name="reason"
            placeholder="Reason for leave"
            value={form.reason}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
            rows={3}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            name="attachment"
            placeholder="Attachment (optional, link or file name)"
            value={form.attachment}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Submit Leave Request</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>My Leave History</h3>
      {leaveHistory.length === 0 && <p>No leave requests yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leaveHistory.map((lr) => (
          <li key={lr.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>{formatDate(lr.from_date)} → {formatDate(lr.to_date)}</strong> ({lr.number_of_days} days)
            <p style={{ fontSize: '13px', color: '#777' }}>Applied on: {formatAppliedDate(lr.created_at)}</p>
            <p>{lr.reason}</p>
            <p>
              Tutor: <strong>{lr.tutor_status}</strong> |
              HOD: <strong>{lr.hod_status}</strong> |
              Principal: <strong>{lr.principal_status}</strong> |
              Final: <strong>{lr.final_status}</strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;