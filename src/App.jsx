import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Placeholder dashboards - we'll build these next */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<h2>Student Dashboard (coming soon)</h2>} />
        <Route path="/tutor" element={<h2>Tutor Dashboard (coming soon)</h2>} />
        <Route path="/hod" element={<h2>HOD Dashboard (coming soon)</h2>} />
        <Route path="/principal" element={<h2>Principal Dashboard (coming soon)</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;