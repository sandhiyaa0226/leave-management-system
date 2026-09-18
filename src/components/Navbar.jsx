import { useNavigate } from 'react-router-dom';

function Navbar({ title }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center py-4 border-b border-stone-200 mb-6">
      <div>
        <p className="text-xs text-slate-500 tracking-wide">Leave Management System</p>
        <h2 className="text-xl font-bold text-blue-900 m-0">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user?.name} · {user?.role}</span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 border border-stone-300 rounded-md
                     hover:bg-stone-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;