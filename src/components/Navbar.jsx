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
      padding: '10px 20px',
      borderBottom: '1px solid #ccc',
      marginBottom: '20px'
    }}>
      <h3>{title}</h3>
      <div>
        <span style={{ marginRight: '15px' }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} style={{ padding: '6px 14px' }}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;