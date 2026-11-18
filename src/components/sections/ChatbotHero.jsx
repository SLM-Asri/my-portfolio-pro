import { Link } from 'react-router-dom';
import projectBanner from '../../assets/images/chatbot-banner.jpg';

export default function ChatbotHero() {
    return (
        <section className="company-hero">
  <div className="container hero-container">
    <div className="hero-content">
      <div className="service-badge">Internship Project</div>
      <h1 style={{fontSize: '3rem', fontWeight: 800, lineHeight: '1.1', marginBottom: 16, color: 'var(--text-primary)'}}>
        AI-Powered <br /><span className="text-coral">Cybersecurity Chatbot</span>
      </h1>
      <h3 style={{fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 24}}>
        Built by: <strong style={{color: 'var(--accent-primary)'}}>S.L.M. Asri</strong>
      </h3>
      <p className="hero-desc" style={{maxWidth: 600, marginBottom: 32}}>
        A cybersecurity awareness chatbot built with Python, Flask, HTML, CSS, JavaScript, and MySQL. The platform delivers interactive quizzes and awareness content to help users learn safe digital practices through a friendly, conversational interface.
      </p>
      <div className="hero-actions">
        <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" className="btn btn-primary"><i className="fab fa-github" /> View on GitHub</a>
        <Link to="/#contact" className="btn btn-secondary">Ask About This Project</Link>
      </div>
    </div>
    <div className="company-logo-container">
      <div className="company-logo-wrapper">
        <img src={projectBanner} alt="AI Cybersecurity Chatbot" className="company-logo-img" />
      </div>
    </div>
  </div>
</section>

    );
}
