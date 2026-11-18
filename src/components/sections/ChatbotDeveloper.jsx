import { Link } from 'react-router-dom';
import developerImage from '../../assets/images/hari-founder-chatbot.jpg';

export default function ChatbotDeveloper() {
    return (
        <section className="founder-section scroll-section">
  <div className="container founder-container">
    <div className="founder-image-wrapper">
      <div className="founder-img-card">
        <img src={developerImage} alt="S.L.M. Asri - Developer of the Cybersecurity Chatbot" className="founder-img" />
      </div>
    </div>
    <div className="founder-info-content">
      <div className="founder-title-badge">About the Developer</div>
      <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: 8}}>Meet the Developer</h2>
      <h3 style={{fontFamily: 'var(--font-body)', fontSize: '1.2rem', fontWeight: 500, color: '#3b82f6', marginBottom: 20}}>
        Sulaiman Lebbe Muhammad Asri <span style={{color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 400, marginLeft: 8}}>| HND IT Student, SLIATE Anuradhapura</span>
      </h3>
      <p style={{color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.05rem'}}>
        As an HND IT student with a strong interest in cybersecurity fundamentals, I built this chatbot to make cybersecurity awareness more approachable and engaging for everyday users through simple, conversational learning.
      </p>
      <p style={{color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1.05rem'}}>
        The project combines a Python/Flask backend, MySQL database, and a responsive front-end built with HTML, CSS, and JavaScript — bringing together my full-stack skills to solve a real awareness problem.
      </p>
      <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
        <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" className="btn btn-primary">
          <i className="fab fa-github" /> View on GitHub
        </a>
        <Link to="/#contact" className="btn btn-secondary">
          <i className="fas fa-paper-plane" /> Contact Me
        </Link>
      </div>
    </div>
  </div>
</section>

    );
}
