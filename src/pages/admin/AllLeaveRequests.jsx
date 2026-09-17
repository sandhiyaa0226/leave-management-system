import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDate, formatAppliedDate } from '../../utils/formatDate';

function AllLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await api.get('/leave-requests/all');
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load leave requests');
    }
  };

  // Basic report counts
  const total = requests.length;
  const pending = requests.filter((r) => r.final_status === 'pending').length;
  const approved = requests.filter((r) => r.final_status === 'approved').length;
  const rejected = requests.filter((r) => r.final_status === 'rejected').length;

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((r) => r.final_status === filter);


  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h3>All Leave Requests</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Basic report cards */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{total}</div>
          <div>Total</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pending}</div>
          <div>Pending</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{approved}</div>
          <div>Approved</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{rejected}</div>
          <div>Rejected</div>
        </div>
      </div>

      {/* Filter buttons */}
      <div style={{ marginBottom: '15px' }}>
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              marginRight: '8px',
              fontWeight: filter === f ? 'bold' : 'normal',
              backgroundColor: filter === f ? '#ddd' : '#fff'
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 && <p>No requests found.</p>}
      {filteredRequests.map((r) => (
        <div key={r.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '8px' }}>
          <p>
            <strong>{r.student_name}</strong> ({r.roll_number || 'No Roll No'}) — {r.department_name} — {formatDate(r.from_date)} to {formatDate(r.to_date)} ({r.number_of_days} days)
          </p>
          <p style={{ fontSize: '13px', color: '#777' }}>Applied on: {formatAppliedDate(r.created_at)}</p>
          <p>Reason: {r.reason}</p>
          <p>
            Tutor: <strong>{r.tutor_status}</strong> |
            HOD: <strong>{r.hod_status}</strong> |
            Principal: <strong>{r.principal_status}</strong> |
            Final: <strong>{r.final_status}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

export default AllLeaveRequests;