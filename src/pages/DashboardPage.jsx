import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearAuth } from '../utils/Auth';

function DashboardPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="dashboard-page-shell">
      <section className="dashboard-section">
        <div className="dashboard-card">
          <div className="dashboard-page-head">
            <div>
              <h2 className="dashboard-page-title">Dashboard</h2>
              <p className="dashboard-page-subtitle">Welcome to your protected area</p>
            </div>
          </div>

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

              <div className="profile-item">
                <span>Role</span>
                <strong>{profile.role || 'User'}</strong>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;