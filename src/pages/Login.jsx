import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/users/login', { email, password });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[420px] min-h-[480px] bg-stone-100 rounded-lg shadow-md border border-stone-200 p-10 flex flex-col justify-center">
        <p className="text-sm text-slate-500 mb-1">Welcome to</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-7">Leave Management System</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold
                       py-2.5 rounded-md transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;