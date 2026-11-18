import { Link } from 'react-router-dom';
import developerImage from '../../assets/images/hari-founder.jpg';

export default function KnowledgeDeveloper() {
    return (
        <section className="founder-section scroll-section">
  <div className="container founder-container">
    <div className="founder-image-wrapper">
      <div className="founder-img-card">
        <img src={developerImage} alt="S.L.M. Asri - Developer of the Gamified Knowledge System" className="founder-img" />
      </div>
    </div>
    <div className="founder-info-content">
      <div className="founder-title-badge">About the Developer</div>
      <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: 8}}>Meet the Developer</h2>
      <h3 style={{fontFamily: 'var(--font-body)', fontSize: '1.2rem', fontWeight: 500, color: '#10b981', marginBottom: 20}}>
        Sulaiman Lebbe Muhammad Asri <span style={{color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 400, marginLeft: 8}}>| HND IT Student, SLIATE Anuradhapura</span>
      </h3>
      <p style={{color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.05rem'}}>
        This system grew out of my interest in full-stack web development and making learning more engaging. I designed and built it end-to-end — from the Node.js/Express.js backend and MySQL schema to the responsive front-end and gamification logic.
      </p>
      <p style={{color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1.05rem'}}>
        It reflects my core stack: HTML5, CSS3, JavaScript, Node.js, Express.js, and MySQL, along with practical experience implementing secure authentication and real-time dashboards.
      </p>
      <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
        <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" className="btn btn-primary" style={{backgroundColor: '#10b981', borderColor: '#10b981', color: '#000'}}>
          <i className="fab fa-github" /> View on GitHub
        </a>
        <Link to="/#contact" className="btn btn-secondary">
          <i className="fas fa-paper-plane" /> Contact Me
        </Link>
        <Link to="/projects/cybersecurity-chatbot" className="btn btn-secondary">
          <i className="fas fa-robot" /> View Cybersecurity Chatbot
        </Link>
      </div>
    </div>
  </div>
</section>

    );
}
