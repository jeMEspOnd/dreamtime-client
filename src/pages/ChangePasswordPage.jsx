import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/change-password', formData);

      toast.success('Password changed. Please login again.');

      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to change password';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-panel">
        <h1>Change Password</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChangePasswordPage;