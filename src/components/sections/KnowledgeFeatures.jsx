export default function KnowledgeFeatures() {
    return (
        <section className="scroll-section" style={{backgroundColor: 'var(--bg-secondary)'}}>
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Project Features</h2>
      <div className="title-underline" style={{backgroundColor: '#10b981'}} />
    </div>
    <div className="skills-grid" style={{marginTop: 40}}>
      {/* Card 1 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(16, 185, 129, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981'}}>
          <i className="fas fa-user-lock" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>Secure JWT Authentication</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Secure user registration and login built on JWT authentication, protecting student and admin accounts alike.
          </p>
        </div>
      </div>
      {/* Card 2 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(16, 185, 129, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981'}}>
          <i className="fas fa-gamepad" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>Gamified Quizzes</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Scoring, levels, and progress tracking designed to make knowledge assessment engaging rather than a chore.
          </p>
        </div>
      </div>
      {/* Card 3 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(16, 185, 129, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981'}}>
          <i className="fas fa-chart-line" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>Real-Time Dashboards</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            Responsive dashboards for both students and administrators, with real-time performance monitoring.
          </p>
        </div>
      </div>
      {/* Card 4 */}
      <div className="about-card-item" style={{padding: 32, borderColor: 'rgba(16, 185, 129, 0.15)'}}>
        <div className="card-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981'}}>
          <i className="fas fa-database" />
        </div>
        <div className="card-info">
          <h3 style={{fontSize: '1.3rem', marginBottom: 8}}>MySQL Data Integration</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
            A MySQL database powers user management, quiz data, and assessment results across the platform.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
