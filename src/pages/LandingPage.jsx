import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import profile from '../assets/profile.jpeg';
import { toast } from 'react-toastify';
import api from '../services/api';

const FEEDBACK_KEY = 'portfolio_feedback_list';
const LOCATION_KEY = 'portfolio_user_location';

function LandingPage() {
  
  const [feedbackForm, setFeedbackForm] = useState({
  name: '',
  rating: 5,
  remarks: '',
});


  const [feedbackList, setFeedbackList] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
   const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedFeedback = localStorage.getItem(FEEDBACK_KEY);
    if (savedFeedback) {
      try {
        setFeedbackList(JSON.parse(savedFeedback));
      } catch {
        setFeedbackList([]);
      }
    }

    const savedLocation = localStorage.getItem(LOCATION_KEY);
    if (savedLocation) {
      try {
        setLocationInfo(JSON.parse(savedLocation));
      } catch {
        setLocationInfo(null);
      }
    }

    requestAndStoreLocation();
  }, []);

  const averageRating = useMemo(() => {
    if (!feedbackList.length) return 0;
    const total = feedbackList.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return (total / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  const requestAndStoreLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address.');
          }

          const data = await response.json();

          const locationPayload = {
            latitude,
            longitude,
            address: data.display_name || 'Address not found',
            savedAt: new Date().toISOString(),
          };

          localStorage.setItem(LOCATION_KEY, JSON.stringify(locationPayload));
          setLocationInfo(locationPayload);
        } catch (error) {
          setLocationError('Location found, but address lookup failed.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError('Location permission was denied.');
        } else if (error.code === 2) {
          setLocationError('Location is unavailable.');
        } else if (error.code === 3) {
          setLocationError('Location request timed out.');
        } else {
          setLocationError('Unable to get location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleFeedbackSubmit = async (e) => {
  e.preventDefault();

  if (!feedbackForm.name.trim() || !feedbackForm.remarks.trim()) {
    toast.error('Name and remarks are required.');
    return;
  }
setLoading(true);
  try {
    await api.post('/feedback/', {
      name: feedbackForm.name.trim(),
      rating: Number(feedbackForm.rating),
      remarks: feedbackForm.remarks.trim(),
      locationAddress: locationInfo?.address || null,
    });

    toast.success('Feedback submitted To Linkan successfully.');

    setFeedbackForm({
      name: '',
      rating: 5,
      remarks: '',
    });
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to submit feedback.';
    toast.error(message);
  }finally
  {
    setLoading(false);
  }
};

  return (
    <section className="landing-v3">
      <div className="landing-v3-orb orb-one"></div>
      <div className="landing-v3-orb orb-two"></div>
      <div className="landing-v3-grid"></div>

      <div className="hero-v3">
        <div className="hero-v3-left">
          <div className="hero-badge-v3">FULL STACK DEVELOPER • PORTFOLIO • CLOUD APP</div>

          <h1 className="hero-title-v3">
            Hi, I’m <span>Linkan</span>
            <br />
            I create secure and modern full stack applications.
          </h1>

          <p className="hero-text-v3">
            This portfolio project highlights my skills in React, ASP.NET Core Web API,
            SQL Server, Azure SQL, JWT authentication, refresh token flow, role-based access,
            and production-style deployment.
          </p>

          <div className="hero-buttons-v3">
            <Link to="/register" className="hero-main-btn">
              Explore Project
            </Link>

            <Link to="/dashboard" className="hero-alt-btn">
              Open Dashboard
            </Link>
          </div>

          <div className="hero-link-row-v3">
            <a href="mailto:youremail@gmail.com">Email</a>
            <a href="https://github.com/jeMEspOnd" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>

          <div className="quick-stats-v3">
            <div className="quick-stat-card">
              <strong>10+</strong>
              <span>Projects</span>
            </div>
            <div className="quick-stat-card">
              <strong>JWT</strong>
              <span>Security Focus</span>
            </div>
            <div className="quick-stat-card">
              <strong>Azure</strong>
              <span>Cloud Deployment</span>
            </div>
          </div>
        </div>

        <div className="hero-v3-right">
          <div className="profile-card-v3">
            <div className="profile-card-top">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <img src={profile} alt="Linkan profile" className="profile-image-v3" />

            <h3>Linkan</h3>
            <p className="profile-role-v3">Full Stack Developer</p>

            <div className="profile-tags-v3">
              <span>React</span>
              <span>.NET</span>
              <span>Azure</span>
              <span>SQL</span>
            </div>

            <div className="profile-feature-box">
              <span>Featured Build</span>
              <strong>DreamTime Platform</strong>
              <small>JWT Auth • Roles • Admin Dashboard • Azure</small>
            </div>
          </div>
        </div>
      </div>

      <div className="highlight-grid-v3">
        <div className="highlight-card-v3 active-card">
          <p className="section-chip-v3">FEATURED PROJECT</p>
          <h3>DreamTime Platform</h3>
          <p>
            A full stack application with registration, login, protected routes,
            refresh tokens, admin authorization, and Azure cloud hosting.
          </p>
        </div>

        <div className="highlight-card-v3">
          <p className="section-chip-v3">WHAT I BUILD</p>
          <h3>Scalable Web Solutions</h3>
          <p>
            I focus on responsive UI, secure APIs, clean architecture,
            and practical production workflows.
          </p>
        </div>

        <div className="highlight-card-v3">
          <p className="section-chip-v3">CORE VALUE</p>
          <h3>Security + Architecture</h3>
          <p>
            My projects emphasize maintainability, secure authentication,
            cloud readiness, and structured engineering.
          </p>
        </div>
      </div>

      <div className="section-shell-v3">
        <div className="section-header-v3">
          <span className="section-chip-v3">SKILLS & STACK</span>
          <h2>Technologies used in this portfolio application</h2>
          <p>
            This project combines frontend development, backend engineering,
            database work, security, and cloud deployment into one complete solution.
          </p>
        </div>

        <div className="skills-grid-v3">
          <div className="skills-card-v3">
            <h3>Frontend</h3>
            <div className="skill-pills-v3">
              <span>React</span>
              <span>Vite</span>
              <span>React Router</span>
              <span>Axios</span>
              <span>Responsive UI</span>
              <span>Validation</span>
              <span>Toast UX</span>
            </div>
          </div>

          <div className="skills-card-v3">
            <h3>Backend</h3>
            <div className="skill-pills-v3">
              <span>ASP.NET Core</span>
              <span>EF Core</span>
              <span>SQL Server</span>
              <span>Azure SQL</span>
              <span>JWT Auth</span>
              <span>Refresh Tokens</span>
              <span>Role Authorization</span>
            </div>
          </div>

          <div className="skills-card-v3">
            <h3>Cloud & Architecture</h3>
            <div className="skill-pills-v3">
              <span>Azure App Service</span>
              <span>Static Web Apps</span>
              <span>REST API</span>
              <span>Layered Architecture</span>
              <span>Repository Pattern</span>
              <span>Deployment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="location-feedback-grid">
        <div className="location-card-v3">
          <div className="section-header-v3 compact">
            <span className="section-chip-v3">VISITOR LOCATION</span>
            <h2>Location capture</h2>
          </div>

          {locationLoading && <p className="muted-text-v3">Fetching your location...</p>}

          {!locationLoading && locationInfo && (
            <div className="location-result-v3">
              <p><strong>Address:</strong> {locationInfo.address}</p>
              <p>
                <strong>Coordinates:</strong> {locationInfo.latitude.toFixed(5)}, {locationInfo.longitude.toFixed(5)}
              </p>
            </div>
          )}

          {!locationLoading && locationError && (
            <p className="location-error-v3">{locationError}</p>
          )}

          <button className="hero-alt-btn location-refresh-btn" onClick={requestAndStoreLocation}>
            Refresh Location
          </button>
        </div>

        <div className="feedback-card-v3">
          <div className="section-header-v3 compact">
            <span className="section-chip-v3">FEEDBACK & RATING</span>
            <h2>Share your opinion</h2>
            <p>
              Visitors can leave a name, rating, and remarks for this portfolio project.
            </p>
          </div>

          <div className="feedback-summary-v3">
            <div>
              <strong>{feedbackList.length}</strong>
              <span>Total Feedback</span>
            </div>
            <div>
              <strong>{averageRating || '0.0'}</strong>
              <span>Average Rating</span>
            </div>
          </div>

          <form className="feedback-form-v3" onSubmit={handleFeedbackSubmit}>
            <div className="feedback-field-v3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={feedbackForm.name}
                onChange={handleFeedbackChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="feedback-field-v3">
              <label>Rating</label>
              <select
                name="rating"
                value={feedbackForm.rating}
                onChange={handleFeedbackChange}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="feedback-field-v3">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={feedbackForm.remarks}
                onChange={handleFeedbackChange}
                placeholder="Write your feedback"
                rows="4"
                required
              />
            </div>

            <button type="submit" className="hero-main-btn feedback-submit-btn" disabled={loading}>
             {loading?'Submitting..': 'Submit Feedback'}
            </button>
          </form>

          <div className="feedback-list-v3">
            {feedbackList.length === 0 && (
              <p className="muted-text-v3">No feedback yet. Be the first to add one.</p>
            )}

            {feedbackList.map((item) => (
              <div key={item.id} className="feedback-item-v3">
                <div className="feedback-item-head">
                  <strong>{item.name}</strong>
                  <span>{'★'.repeat(item.rating)}</span>
                </div>
                <p>{item.remarks}</p>
                <small>{item.createdAt}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;