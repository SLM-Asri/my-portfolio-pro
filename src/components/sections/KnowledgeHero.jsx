import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';

export default function KnowledgeHero() {
    return (
        <section className="company-hero">
  <div className="container hero-container">
    <div className="hero-content">
      <div className="service-badge">Internship Project</div>
      <h1 style={{fontSize: '3rem', fontWeight: 800, lineHeight: '1.1', marginBottom: 16, color: 'var(--text-primary)'}}>
        Gamified Student <span style={{color: '#10b981'}}>Knowledge System</span>
      </h1>
      <h3 style={{fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 24}}>
        Built by: <strong style={{color: '#10b981'}}>S.L.M. Asri</strong>
      </h3>
      <p className="hero-desc" style={{maxWidth: 600, marginBottom: 32}}>
        A web-based student knowledge assessment system built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL. It uses gamified quizzes with scoring, levels, and progress tracking to boost student engagement, backed by secure JWT authentication and real-time dashboards.
      </p>
      <div className="hero-actions">
        <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" className="btn btn-primary" style={{backgroundColor: '#10b981', borderColor: '#10b981', color: '#000'}}><i className="fab fa-github" /> View on GitHub</a>
        <Link to="/#contact" className="btn btn-secondary">Get in Touch</Link>
        <Link to="/" className="btn btn-secondary"><i className="fas fa-arrow-left" /> Main Portfolio</Link>
      </div>
    </div>
    <div className="company-logo-container">
      <div className="company-logo-wrapper">
        <img src={logo} alt="Gamified Knowledge System" className="company-logo-img" />
      </div>
    </div>
  </div>
</section>

    );
}
