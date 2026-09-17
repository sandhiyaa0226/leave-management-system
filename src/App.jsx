import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TutorDashboard from './pages/tutor/TutorDashboard';
import HODDashboard from './pages/hod/HODDashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Placeholder dashboards - we'll build these next */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/hod" element={<HODDashboard />} />
        <Route path="/principal" element={<PrincipalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;