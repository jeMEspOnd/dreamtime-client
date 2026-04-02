import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearAuth } from '../utils/Auth';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch profile
      try {
        const profileResponse = await api.get('/profile');
        setProfile(profileResponse.data.data);
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

      // Fetch projects
      try {
        setProjectsLoading(true);
        const projectsResponse = await api.get('/Master');
        setProjects(projectsResponse.data.data || projectsResponse.data || []);
      } catch (err) {
        setProjectsError(err.response?.data?.message || 'Failed to load projects.');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchData();
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

        {/* Projects Section */}
        <section className="dashboard-section projects-section">
          <div className="dashboard-card">
            <h3 className="projects-title">Your Projects</h3>
            
            {projectsLoading && <LoadingSpinner text="Loading your projects..." />}
            {projectsError && <p className="error-text">{projectsError}</p>}
            
            {!projectsLoading && !projectsError && projects.length === 0 && (
              <p style={{color: '#64748b', textAlign: 'center', padding: '40px'}}>
                No projects found. <a href="/AddProject">Add your first project</a>
              </p>
            )}
            
            {!projectsLoading && !projectsError && projects.length > 0 && (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id || project.projectCode} className="project-card">
                    <h4 className="project-name">{project.projectName}</h4>
                    
                    <div className="project-meta">
                      <div className="project-meta-item">
                        <span className="project-meta-label">Code</span>
                        <strong className="project-meta-value">{project.projectCode}</strong>
                      </div>
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
                        <strong className="project-meta-value">${project.budget?.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="project-meta-item">
                      <span className="project-meta-label">Status</span>
                      <span className={`status-badge status-${project.status?.toLowerCase().replace(' ', '-')}`}>
                        {project.status || 'Active'}
                      </span>
                    </div>

                    {project.modules && project.modules.length > 0 && (
                      <div className="project-meta-item">
                        <span className="project-meta-label">Modules</span>
                        <div className="modules-list">
                          {project.modules.slice(0, 4).map((module, idx) => (
                            <span key={idx} className="module-tag">{module}</span>
                          ))}
                          {project.modules.length > 4 && (
                            <span className="module-tag">+{project.modules.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

export default DashboardPage;