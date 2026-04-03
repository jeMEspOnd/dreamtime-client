import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPage.css'; // Reuse dashboard styles

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/Master/Project/${id}`);
        setProject(response.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error('Session expired');
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner text="Loading project details..." />;

  if (error || !project) {
    return (
      <div className="dashboard-page-shell">
        <div className="error-box">
          <p>{error || 'Project not found'}</p>
          <Link to="/dashboard" className="retry-btn">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-shell">
      <div className="dashboard-card">
        <div className="dashboard-page-head">
          <div>
            <h2 className="dashboard-page-title">{project.projectName}</h2>
            <p className="dashboard-page-subtitle">
              Project Code: <strong>{project.projectCode}</strong> |{' '}
              Status: <span className={`status-badge status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {project.status}
              </span>
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
        </div>

        <div className="project-meta" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
          <div className="project-meta-item">
            <span className="project-meta-label">Client</span>
            <strong className="project-meta-value">{project.clientName}</strong>
          </div>
          <div className="project-meta-item">
            <span className="project-meta-label">Manager</span>
            <strong className="project-meta-value">{project.projectManager}</strong>
          </div>
          <div className="project-meta-item">
            <span className="project-meta-label">Budget</span>
            <strong className="project-meta-value">₹{project.budget?.toLocaleString()}</strong>
          </div>
          <div className="project-meta-item">
            <span className="project-meta-label">Start Date</span>
            <strong className="project-meta-value">{project.startDate}</strong>
          </div>
        </div>

        {project.description && (
          <div className="project-meta-item" style={{ marginTop: '24px' }}>
            <span className="project-meta-label">Description</span>
            <p style={{ color: 'var(--text)', lineHeight: '1.7', marginTop: '8px' }}>{project.description}</p>
          </div>
        )}

        {project.modules && (
          <div className="project-meta-item" style={{ marginTop: '24px' }}>
            <span className="project-meta-label">Modules</span>
            <div className="modules-list" style={{ marginTop: '12px' }}>
              {(Array.isArray(project.modules) ? project.modules : project.modules.split(','))
                .map((module, idx) => (
                  <span key={idx} className="module-tag">{module.trim()}</span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;

