import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TutorDashboard from './pages/tutor/TutorDashboard';
import HODDashboard from './pages/hod/HODDashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Placeholder dashboards - we'll build these next */}
        <Route path="/admin" element={
  <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
} />
<Route path="/student" element={
  <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
} />
<Route path="/tutor" element={
  <ProtectedRoute allowedRole="tutor"><TutorDashboard /></ProtectedRoute>
} />
<Route path="/hod" element={
  <ProtectedRoute allowedRole="hod"><HODDashboard /></ProtectedRoute>
} />
<Route path="/principal" element={
  <ProtectedRoute allowedRole="principal"><PrincipalDashboard /></ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;