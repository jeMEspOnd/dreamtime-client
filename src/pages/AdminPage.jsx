import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearAuth } from '../utils/Auth';

function AdminPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error('Access denied. Admins only.');
          navigate('/dashboard');
          return;
        }

        if (err.response?.status === 401) {
          clearAuth();
          toast.error('Session expired.');
          navigate('/login');
          return;
        }

        toast.error('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <section className="dashboard-section">
      <h1>Admin Panel</h1>
      <p className="page-subtitle">Admin-only access area</p>

      <div className="dashboard-card">
        {loading && <LoadingSpinner text="Loading admin data..." />}

        {!loading && data && (
          <div className="profile-grid">
            <div className="profile-item">
              <span>Name</span>
              <strong>{data.fullName}</strong>
            </div>

            <div className="profile-item">
              <span>Email</span>
              <strong>{data.email}</strong>
            </div>

            <div className="profile-item">
              <span>Role</span>
              <strong>{data.role}</strong>
            </div>

            <div className="profile-item">
              <span>Message</span>
              <strong>{data.adminMessage}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;