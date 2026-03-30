import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearAuth } from '../utils/Auth';

function AdminPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [adminResponse, feedbackResponse] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/feedback/admin'),
        ]);

        setData(adminResponse.data.data);
        setFeedbacks(feedbackResponse.data.data || []);
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
          <>
            <div className="profile-grid" style={{ marginBottom: '24px' }}>
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

            <h3 style={{ marginBottom: '16px' }}>User Feedback</h3>

            {feedbacks.length === 0 && <p>No feedback submitted yet.</p>}

            {feedbacks.length > 0 && (
              <div className="admin-feedback-list">
                {feedbacks.map((item) => (
                  <div key={item.id} className="admin-feedback-card">
                    <div className="admin-feedback-top">
                      <strong>{item.name}</strong>
                      <span>{'★'.repeat(item.rating)}</span>
                    </div>

                    <p>{item.remarks}</p>

                    {item.locationAddress && (
                      <small><strong>Location:</strong> {item.locationAddress}</small>
                    )}

                    <small>
                      <strong>Submitted:</strong>{' '}
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default AdminPage;