import { useNavigate } from 'react-router-dom';

function Navbar({ title }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: '24px'
    }}>
      <div>
        <p className="text-muted" style={{ margin: 0, letterSpacing: '0.3px' }}>Leave Management System</p>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span className="text-muted">{user?.name} · {user?.role}</span>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;