import { useNavigate } from 'react-router-dom';

function AdminLayout({ activeTab, setActiveTab, children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { key: 'departments', label: 'Departments' },
    { key: 'staff', label: 'Staff' },
    { key: 'students', label: 'Students' },
    { key: 'requests', label: 'Leave Requests' },
  ];

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm">
            L
          </div>
          <span className="font-semibold text-slate-800">Leave Management</span>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium mb-1 transition-colors
                ${activeTab === item.key
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-slate-600 hover:bg-stone-100'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end items-center gap-4 px-10 py-4 border-b border-stone-200 bg-white">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium px-4 py-2 border border-stone-300 rounded-md
                       hover:bg-stone-100 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Page content */}
        <div className="px-10 py-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;