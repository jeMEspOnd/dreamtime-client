import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearAuth } from '../utils/Auth';

function DashboardPage() {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState('');

  const handleLogout = () => {
    clearAuth();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleSubMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? '' : menuName));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          clearAuth();
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }

        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
      const clickedToggleButton = toggleBtnRef.current?.contains(event.target);

      if (!clickedInsideSidebar && !clickedToggleButton) {
        setSidebarOpen(false);
        setOpenMenu('');
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="dashboard-layout">
      {/* Top bar */}
      <div className="dashboard-topbar">
        <button
          ref={toggleBtnRef}
          className="sidebar-toggle fixed-toggle"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <div>
          <h2 className="topbar-title">Dashboard</h2>
          <p className="topbar-subtitle">Welcome to your protected area</p>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => {
          setSidebarOpen(false);
          setOpenMenu('');
        }}
      ></div>

      {/* Sidebar */}
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
            <Link to="/dashboard" className="menu-link" onClick={() => setSidebarOpen(false)}>
              <span className="menu-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
          </li>

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
                  <Link to="/dashboard/profile-view" onClick={() => setSidebarOpen(false)}>
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile-edit" onClick={() => setSidebarOpen(false)}>
                    Edit Profile
                  </Link>
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
                  <Link to="/dashboard/account-settings" onClick={() => setSidebarOpen(false)}>
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/security-settings" onClick={() => setSidebarOpen(false)}>
                    Security
                  </Link>
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

      {/* Main */}
      <main className="dashboard-main full-width-main">
        <section className="dashboard-section">
          <div className="dashboard-card">
            <h3>Profile Details</h3>

            {loading && <LoadingSpinner text="Loading your profile..." />}
            {!loading && error && <p className="error-text">{error}</p>}

            {!loading && !error && profile && (
              <div className="profile-grid">
                <div className="profile-item" hidden>
                  <span>User ID</span>
                  <strong>{profile.userId}</strong>
                </div>

                <div className="profile-item">
                  <span>Full Name</span>
                  <strong>{profile.fullName}</strong>
                </div>

                <div className="profile-item">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;