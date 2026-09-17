import { useState, useEffect } from 'react';
import api from '../../api/axios';

function TutorDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [requests, setRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/leave-requests/tutor/${user.id}`);
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load leave requests');
    }
  };

  const handleRemarksChange = (id, value) => {
    setRemarksMap({ ...remarksMap, [id]: value });
  };

  const handleReview = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/leave-requests/${id}/tutor-review`, {
        status,
        remarks: remarksMap[id] || '',
        approver_id: user.id
      });
      setSuccess(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update request');
    }
  };

  const pendingRequests = requests.filter((r) => r.tutor_status === 'pending');
  const reviewedRequests = requests.filter((r) => r.tutor_status !== 'pending');

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto' }}>
      <h2>Tutor Dashboard — {user.name}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Pending Requests ({pendingRequests.length})</h3>
      {pendingRequests.length === 0 && <p>No pending requests.</p>}
      {pendingRequests.map((r) => (
        <div key={r.id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '10px' }}>
          <p><strong>{r.student_name}</strong> — {r.from_date} to {r.to_date} ({r.number_of_days} days)</p>
          <p>Reason: {r.reason}</p>
          {r.attachment && <p>Attachment: {r.attachment}</p>}
          <input
            type="text"
            placeholder="Remarks (optional)"
            value={remarksMap[r.id] || ''}
            onChange={(e) => handleRemarksChange(r.id, e.target.value)}
            style={{ padding: '6px', width: '100%', marginBottom: '8px' }}
          />
          <button onClick={() => handleReview(r.id, 'approved')} style={{ marginRight: '10px', padding: '6px 14px' }}>
            Approve
          </button>
          <button onClick={() => handleReview(r.id, 'rejected')} style={{ padding: '6px 14px' }}>
            Reject
          </button>
        </div>
      ))}

      <h3>Reviewed Requests</h3>
      {reviewedRequests.length === 0 && <p>None yet.</p>}
      {reviewedRequests.map((r) => (
        <div key={r.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '8px', color: '#555' }}>
          <p>{r.student_name} — {r.from_date} to {r.to_date} — <strong>{r.tutor_status}</strong></p>
        </div>
      ))}
    </div>
  );
}

export default TutorDashboard;