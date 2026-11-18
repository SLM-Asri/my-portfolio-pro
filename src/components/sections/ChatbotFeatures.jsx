export default function ChatbotFeatures() {
    return (
        <section className="scroll-section" style={{backgroundColor: 'var(--bg-secondary)'}}>
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Project Features</h2>
      <div className="title-underline" />
    </div>
    <div className="skills-grid" style={{marginTop: 40}}>
      {/* Card 1 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(59, 130, 246, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6'}}>
          <i className="fas fa-robot" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>Conversational Chatbot Interface</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            A user-friendly chatbot interface built with HTML, CSS, and JavaScript to guide users through cybersecurity awareness topics.
          </p>
        </div>
      </div>
      {/* Card 2 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(59, 130, 246, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6'}}>
          <i className="fas fa-user-shield" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>User Registration &amp; Authentication</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Secure user registration and login features that let learners track their progress through the awareness modules.
          </p>
        </div>
      </div>
      {/* Card 3 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(59, 130, 246, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6'}}>
          <i className="fas fa-shield-alt" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>Cybersecurity Quizzes</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Integrated quizzes and awareness content that reinforce good cybersecurity habits through interactive learning.
          </p>
        </div>
      </div>
      {/* Card 4 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(59, 130, 246, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6'}}>
          <i className="fas fa-database" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>MySQL Database Connectivity</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Full database connectivity for user accounts, quiz data, and progress tracking, built on a Flask backend.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
