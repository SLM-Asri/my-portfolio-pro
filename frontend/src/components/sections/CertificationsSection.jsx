export default function CertificationsSection() {
    return (
        <section id="certifications" className="scroll-section" style={{backgroundColor: 'var(--bg-secondary)'}}>
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Certifications &amp; Courses</h2>
      <div className="title-underline" />
    </div>
    <div className="certifications-bento-grid">
      {/* Card 1: Python for Beginners (Wide top tile) */}
      <div className="bento-card bento-card-wide-top" data-bento-theme="orange">
        <div className="bento-card-inner">
          <div className="bento-card-header">
            <div className="bento-card-icon">
              <i className="fas fa-certificate" />
            </div>
            <span className="bento-status-tag">COMPLETED</span>
          </div>
          <div className="bento-card-content">
            <h3>PYTHON FOR BEGINNERS</h3>
            <p>Foundational Python programming certification from University of Moratuwa.</p>
            <div className="bento-tags">
              <span><i className="fab fa-python" /> Python</span>
              <span><i className="fas fa-code" /> Programming Basics</span>
              <span><i className="fas fa-university" /> Univ. of Moratuwa</span>
            </div>
          </div>
        </div>
      </div>
      {/* Card 2: Python via VS Code - Microsoft LSA (Tall tile) */}
      <div className="bento-card bento-card-tall" data-bento-theme="blue">
        <div className="bento-card-inner">
          <div className="bento-card-header">
            <div className="bento-card-icon">
              <i className="fas fa-laptop-code" />
            </div>
            <span className="bento-status-tag">COMPLETED</span>
          </div>
          <div className="bento-card-content">
            <h3>PYTHON PROGRAMMING USING VS CODE</h3>
            <p>Certified by Microsoft Learn Student Ambassador program, covering practical Python development in Visual Studio Code.</p>
            <div className="bento-tags vertical-tags">
              <span><i className="fab fa-microsoft" /> Microsoft Learn</span>
              <span><i className="fas fa-code" /> VS Code</span>
              <span><i className="fab fa-python" /> Python</span>
              <span><i className="fas fa-user-graduate" /> Student Ambassador</span>
            </div>
          </div>
        </div>
      </div>
      {/* Card 3: Spoken English (Wide bottom tile) */}
      <div className="bento-card bento-card-wide-bottom" data-bento-theme="green">
        <div className="bento-card-inner">
          <div className="bento-card-header">
            <div className="bento-card-icon">
              <i className="fas fa-comments" />
            </div>
            <span className="bento-status-tag">COMPLETED</span>
          </div>
          <div className="bento-card-content">
            <h3>SPOKEN ENGLISH</h3>
            <p>Certificate in Spoken English from Vidura Faculty of English, strengthening professional communication skills.</p>
            <div className="bento-tags">
              <span><i className="fas fa-language" /> English</span>
              <span><i className="fas fa-microphone" /> Communication</span>
            </div>
          </div>
        </div>
      </div>
      {/* Card 4: Psychology & Moulavi Certificate (Full width bottom tile) */}
      <div className="bento-card bento-card-full-width" data-bento-theme="purple">
        <div className="bento-card-inner">
          <div className="bento-card-header">
            <div className="bento-card-icon">
              <i className="fas fa-brain" />
            </div>
            <span className="bento-status-tag">COMPLETED</span>
          </div>
          <div className="bento-card-content">
            <h3>PSYCHOLOGY &amp; MOULAVI CERTIFICATION</h3>
            <p>Certificate in Psychology from NKB Studies and Media College, and Certificate of Moulavi from Dharus Salam Arabic College.</p>
            <div className="bento-tags">
              <span><i className="fas fa-book" /> Psychology</span>
              <span><i className="fas fa-mosque" /> Moulavi Certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
