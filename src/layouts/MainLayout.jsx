import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearAuth, getUser, isAuthenticated } from '../utils/Auth';
import api from '../services/api';

function MainLayout() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getUser();

 const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    clearAuth();
    navigate('/login');
  }
};
  console.log(user);
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container nav-bar">
          <Link to="/" className="brand">
            DreamTime
          </Link>

          <nav className="nav-links">
            <Link to="/">Home</Link>

            {!loggedIn && <Link to="/register">Register</Link>}
            {!loggedIn && <Link to="/login">Login</Link>}

            {loggedIn && <Link to="/dashboard">Dashboard</Link>}

            {loggedIn && user && (
              <span className="nav-user">
                Hi, {user.fullName}
              </span>
            )}
{loggedIn && user?.role === 'Admin' && (
  <Link to="/admin">Admin</Link>
)}
            {loggedIn && (
              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
            {loggedIn && <Link to="/change-password">Change Password</Link>}
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;