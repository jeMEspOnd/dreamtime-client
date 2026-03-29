import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <section className="hero-section">
      <div className="hero-card">
        <div className="hero-text">
          <p className="hero-badge">React + ASP.NET Core + Azure SQL</p>
          <h1>Build, secure, and deploy your full-stack app with confidence.</h1>
          <p className="hero-subtitle">
            DreamTime is a production-style application with authentication,
            protected routes, Azure deployment, and a clean scalable structure.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>Secure Authentication</h3>
          <p>
            JWT-based login with protected routes and secured backend APIs.
          </p>
        </div>

        <div className="feature-card">
          <h3>Clean Architecture</h3>
          <p>
            Layered backend structure with controllers, services, repositories,
            DTOs, and EF Core.
          </p>
        </div>

        <div className="feature-card">
          <h3>Cloud Ready</h3>
          <p>
            Deployed with Azure App Service, Azure Static Web Apps, and Azure SQL.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;