import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { clearAuth, getUser, isAuthenticated } from '../utils/Auth';
import api from '../services/api';

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const loggedIn = isAuthenticated();
  const user = getUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState('');

  const sidebarRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const profileMenuRef = useRef(null);

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

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleSubMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? '' : menuName));
  };

  useEffect(() => {
    setSidebarOpen(false);
    setOpenMenu('');
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
      const clickedSidebarButton = sidebarToggleRef.current?.contains(event.target);
      const clickedProfileMenu = profileMenuRef.current?.contains(event.target);

      if (!clickedInsideSidebar && !clickedSidebarButton) {
        setSidebarOpen(false);
        setOpenMenu('');
      }

      if (!clickedProfileMenu) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`main-layout-shell ${loggedIn ? 'auth-layout' : ''}`}>
      {loggedIn && (
        <>
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
            onClick={() => {
              setSidebarOpen(false);
              setOpenMenu('');
            }}
          ></div>

          <aside
            ref={sidebarRef}
            className={`sidebar slide-sidebar ${sidebarOpen ? 'open' : ''}`}
          >
            <div className="sidebar-top">
              <h2 className="sidebar-logo">DreamTime</h2>
              <button className="sidebar-close-btn" onClick={toggleSidebar}>
                ✕
              </button>
            </div>

            <ul className="sidebar-menu">
              <li>
                <Link to="/dashboard" className="menu-link">
                  <span className="menu-icon">🏠</span>
                  <span>Dashboard</span>
                </Link>
              </li>

              {user?.role === 'Admin' && (
                <li>
                  <Link to="/admin" className="menu-link">
                    <span className="menu-icon">🛠️</span>
                    <span>Admin Panel</span>
                  </Link>
                </li>
              )}

              {user?.role === 'Admin' && (
                <li>
                  <Link to="/register" className="menu-link">
                    <span className="menu-icon">➕</span>
                    <span>Register User</span>
                  </Link>
                </li>
              )}

              <li>
                <button
                  className="menu-link menu-btn"
                  onClick={() => toggleSubMenu('profile')}
                >
                  <span className="menu-icon">👤</span>
                  <span>Profile</span>
                  <span className="arrow">{openMenu === 'profile' ? '▲' : '▼'}</span>
                </button>

                {openMenu === 'profile' && (
                  <ul className="submenu">
                    <li>
                      <Link to="/dashboard/profile-view">View Profile</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/profile-edit">Edit Profile</Link>
                    </li>
                    <li>
                      <Link to="/change-password">Change Password</Link>
                    </li>
                  </ul>
                )}
              </li>

               <li>
                <button
                  className="menu-link menu-btn"
                  onClick={() => toggleSubMenu('Master')}
                >
                  <span className="menu-icon">♂️</span>
                  <span>Master</span>
                  <span className="arrow">{openMenu === 'Master' ? '▲' : '▼'}</span>
                </button>

                {openMenu === 'Master' && (
                  <ul className="submenu">
                    <li>
                      <Link to="/addModule">Module Add</Link>
                    </li>
                    <li>
                      <Link to="/addProject">Project Add</Link>
                    </li>
                    <li>
                      <Link to="/addSubModule">Sub Module Add</Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  className="menu-link menu-btn"
                  onClick={() => toggleSubMenu('settings')}
                >
                  <span className="menu-icon">⚙️</span>
                  <span>Settings</span>
                  <span className="arrow">{openMenu === 'settings' ? '▲' : '▼'}</span>
                </button>

                {openMenu === 'settings' && (
                  <ul className="submenu">
                    <li>
                      <Link to="/dashboard/account-settings">Account Settings</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/security-settings">Security</Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button className="menu-link menu-btn logout-btn" onClick={handleLogout}>
                  <span className="menu-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </aside>
        </>
      )}

      <header className="main-topbar">
        <div className="main-topbar-left">
          {loggedIn && (
            <button
              ref={sidebarToggleRef}
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
            >
              ☰
            </button>
          )}

          <Link to="/" className="main-brand">
            DreamTime
          </Link>
        </div>

        <div className="main-topbar-right">
          {!loggedIn && (
            <div className="guest-links">
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
            </div>
          )}

          {loggedIn && (
            <div className="profile-menu-wrap" ref={profileMenuRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              >
                <span className="profile-avatar-circle">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <strong>{user?.fullName || 'User'}</strong>
                    <small>{user?.email || ''}</small>
                  </div>

                  <Link to="/dashboard/profile-view" className="profile-dropdown-item">
                    View Profile
                  </Link>
                  <Link to="/" className="profile-dropdown-item">Home</Link>
                  <button
                    className="profile-dropdown-item logout-dropdown-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={`main-layout-content ${loggedIn && sidebarOpen ? 'sidebar-expanded' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;