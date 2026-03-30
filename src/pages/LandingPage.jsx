import { Link } from 'react-router-dom';
import profile from '../assets/profile.jpeg';

function LandingPage() {
  return (
    <section className="landing-v2">
      <div className="landing-orb landing-orb-1"></div>
      <div className="landing-orb landing-orb-2"></div>
      <div className="landing-grid"></div>

      <div className="landing-hero">
        <div className="landing-copy">
          <div className="eyebrow">FULL STACK DEVELOPER • REACT • .NET • AZURE</div>

          <h1>
            I build <span>secure</span>, modern, and cloud-ready applications.
          </h1>

          <p className="lead">
            Hi, I’m <strong>Linkan</strong>. This portfolio project demonstrates
            real-world frontend and backend engineering with JWT authentication,
            refresh token flow, role-based access, admin dashboard features,
            Azure deployment, and production-style architecture.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="hero-btn hero-btn-primary">
              Explore Project
            </Link>

            <Link to="/dashboard" className="hero-btn hero-btn-secondary">
              Open Dashboard
            </Link>
          </div>

          <div className="hero-links">
            <a href="mailto:youremail@gmail.com">Email</a>
            <a href="https://github.com/jeMEspOnd" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>

          <div className="hero-mini-stats">
            <div className="mini-stat">
              <strong>10+</strong>
              <span>Projects Built</span>
            </div>
            <div className="mini-stat">
              <strong>JWT</strong>
              <span>Auth & Security</span>
            </div>
            <div className="mini-stat">
              <strong>Azure</strong>
              <span>Cloud Deployment</span>
            </div>
          </div>
        </div>

        <div className="landing-visual">
          <div className="profile-showcase">
            <div className="profile-topbar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="profile-main">
              <div className="profile-photo-wrap">
                <img src={profile} alt="Linkan profile" className="profile-photo" />
              </div>

              <div className="profile-intro">
                <h3>Jyotiranjan sahoo</h3>
                <p>Full Stack Developer</p>
              </div>

              <div className="profile-chip-row">
                <span>React</span>
                <span>ASP.NET Core</span>
                <span>Azure</span>
                <span>SQL</span>
              </div>

              <div className="profile-highlight">
                <div>
                  <span>Featured Build</span>
                  <strong>DreamTime Platform</strong>
                </div>
                <small>Authentication • Admin Roles • Cloud Deployment</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-block">
        <div className="section-head">
          <span className="section-badge">WHAT I DO</span>
          <h2>Building full stack applications with clean architecture and real security.</h2>
          <p>
            I focus on practical applications that combine strong UI, secure APIs,
            scalable backend structure, and cloud deployment practices.
          </p>
        </div>

        <div className="feature-cards-v2">
          <article className="feature-card-v2">
            <div className="feature-icon">01</div>
            <h3>Frontend Engineering</h3>
            <p>
              React, Vite, Router, Axios, protected routes, responsive layouts,
              reusable components, and user-focused UI flows.
            </p>
          </article>

          <article className="feature-card-v2">
            <div className="feature-icon">02</div>
            <h3>Backend Engineering</h3>
            <p>
              ASP.NET Core Web API, EF Core, DTOs, services, repositories,
              middleware, JWT auth, refresh tokens, and role authorization.
            </p>
          </article>

          <article className="feature-card-v2">
            <div className="feature-icon">03</div>
            <h3>Cloud Deployment</h3>
            <p>
              Azure App Service, Azure Static Web Apps, Azure SQL, secure config
              setup, and production-style application hosting.
            </p>
          </article>
        </div>
      </div>

      <div className="section-block">
        <div className="section-head">
          <span className="section-badge">STACK & SKILLS</span>
          <h2>Technologies used in this portfolio application</h2>
        </div>

        <div className="skills-shell">
          <div className="skills-card">
            <h3>Frontend</h3>
            <div className="skill-list">
              <span>React</span>
              <span>Vite</span>
              <span>React Router</span>
              <span>Axios</span>
              <span>Responsive Design</span>
              <span>Validation</span>
              <span>Toast UI</span>
            </div>
          </div>

          <div className="skills-card">
            <h3>Backend</h3>
            <div className="skill-list">
              <span>ASP.NET Core</span>
              <span>EF Core</span>
              <span>SQL Server</span>
              <span>Azure SQL</span>
              <span>JWT Auth</span>
              <span>Refresh Tokens</span>
              <span>Role Authorization</span>
            </div>
          </div>

          <div className="skills-card">
            <h3>Architecture & Cloud</h3>
            <div className="skill-list">
              <span>Azure App Service</span>
              <span>Static Web Apps</span>
              <span>REST API Design</span>
              <span>Layered Architecture</span>
              <span>Repository Pattern</span>
              <span>Service Layer</span>
              <span>Deployment Workflow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="project-banner">
        <div className="project-banner-left">
          <span className="section-badge">FEATURED PROJECT</span>
          <h2>DreamTime — Authentication & Admin Dashboard</h2>
          <p>
            A complete full stack application demonstrating registration, login,
            refresh token flow, protected routes, admin-only access, database integration,
            and Azure-based hosting.
          </p>

          <ul>
            <li>JWT authentication and refresh token support</li>
            <li>Admin and user role-based authorization</li>
            <li>Protected dashboard and admin panel</li>
            <li>Azure SQL integration with cloud deployment</li>
          </ul>
        </div>

        <div className="project-banner-right">
          <div className="metric-box">
            <span>Security</span>
            <strong>JWT + Refresh Tokens</strong>
          </div>
          <div className="metric-box">
            <span>Authorization</span>
            <strong>Admin / User Roles</strong>
          </div>
          <div className="metric-box">
            <span>Cloud</span>
            <strong>Azure Hosted</strong>
          </div>
        </div>
      </div>

      <div className="final-cta-v2">
        <div>
          <span className="section-badge">LIVE FLOW</span>
          <h2>Test the full user journey.</h2>
          <p>
            Create an account, login securely, access your dashboard, and explore
            role-based features in a real portfolio-grade application.
          </p>
        </div>

        <div className="hero-cta">
          <Link to="/register" className="hero-btn hero-btn-primary">
            Create Account
          </Link>
          <a
            href="https://github.com/jeMEspOnd"
            target="_blank"
            rel="noreferrer"
            className="hero-btn hero-btn-secondary"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;