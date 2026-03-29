import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success('Registration successful. Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-panel">
        <h1>Create Account</h1>
        <p className="page-subtitle">Register to start using DreamTime.</p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <p className="field-error">{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <p className="field-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && (
              <p className="field-error">{fieldErrors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirmPassword && (
              <p className="field-error">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;