import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../utils/Auth';

function AdminRoute({ children }) {
  const user = getUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;