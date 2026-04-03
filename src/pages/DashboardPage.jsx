import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPage.css';
import { clearAuth } from '../utils/Auth';


function DashboardPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Compute dashboard stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status?.toLowerCase().includes('active')).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    avgBudget: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length) : 0
  };

  const activePercentage = stats.totalProjects > 0 ? Math.round((stats.activeProjects / stats.totalProjects) * 100) : 0;

  const fetchData = async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const response = await api.get('/Master/Project');
      console.log('Project API Response:', response);

      setProjects(response.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuth();
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      setProjectsError(err.response?.data?.message || 'Failed to load projects.');
    } finally {
      setProjectsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, retryCount]);

  return (
    <div className="dashboard-page-shell">
      <section className="dashboard-section">
        <div className="dashboard-card">
          <div className="dashboard-page-head">
            <div>
              <h2 className="dashboard-page-title">Dashboard</h2>
              <p className="dashboard-page-subtitle">Welcome back! Here's what's happening with your projects.</p>
            </div>
          </div>
        </div>

        <section className="dashboard-section stats-section">
          <div className="dashboard-card">
            <div className="stats-grid">
              {projectsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`stat-sk-${i}`} className="stat-card skeleton-shimmer">
                    <div className="skeleton-line skeleton-line-lg"></div>
                    <div className="skeleton-line skeleton-line-sm"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="stat-card">
                    <div className="stat-number">{stats.totalProjects}</div>
                    <div className="stat-label">Total Projects</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{stats.activeProjects} <span className="stat-change">({activePercentage}%)</span></div>
                    <div className="stat-label">Active Projects</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">₹{stats.totalBudget.toLocaleString()}</div>
                    <div className="stat-label">Total Budget</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">₹{stats.avgBudget.toLocaleString()}</div>
                    <div className="stat-label">Avg Budget</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="dashboard-section projects-section">


          <div className="dashboard-card">
            <h3 className="projects-title">Your Projects</h3>

            {projectsLoading ? (
              <>
                <LoadingSpinner text="Loading your projects..." />
                <div className="projects-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`proj-sk-${i}`} className="project-card skeleton-shimmer">
                      <div className="skeleton-line skeleton-line-title"></div>
                      <div className="skeleton-line skeleton-line-md" style={{width: '70%'}}></div>
                      <div className="skeleton-grid">
                        <div className="skeleton-line skeleton-line-sm"></div>
                        <div className="skeleton-line skeleton-line-sm" style={{width: '80%'}}></div>
                      </div>
                      <div className="skeleton-line skeleton-line-md" style={{width: '50%'}}></div>
                      <div className="skeleton-tags">
                        <div className="skeleton-tag"></div>
                        <div className="skeleton-tag"></div>
                        <div className="skeleton-tag"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : projectsError ? (
              <div className="error-box">
                <p className="error-text">{projectsError}</p>
                <button onClick={() => { fetchData(); setRetryCount(c => c + 1); }} className="retry-btn">
                  Retry
                </button>
              </div>
            ) : projects.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                No projects found. <Link to="/AddProject">Add your first project</Link>
              </p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <Link key={project.projectID|| project.projectCode} to={`/project/${project.projectID|| project.projectCode}`} className="project-card" style={{textDecoration: 'none'}}>
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
                        <strong className="project-meta-value">
                          ₹{project.budget?.toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    <div className="project-meta-item">
                      <span className="project-meta-label">Status</span>
                      <span className={`status-badge status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {project.status || 'Active'}
                      </span>
                    </div>

                    {project.modules && (
                      <div className="project-meta-item">
                        <span className="project-meta-label">Modules</span>
                        <div className="modules-list">
                          {(Array.isArray(project.modules)
                            ? project.modules
                            : project.modules.split(','))
                            .slice(0, 4)
                            .map((module, idx) => (
                              <span key={idx} className="module-tag">
                                {module.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </Link>
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