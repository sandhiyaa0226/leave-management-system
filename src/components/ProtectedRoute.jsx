import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // Not logged in at all -> send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role for this page -> send back to their own dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Logged in AND correct role -> show the page
  return children;
}

export default ProtectedRoute;