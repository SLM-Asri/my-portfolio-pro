import { Link } from 'react-router-dom';
import resumeVideo from '../../assets/videos/video_20260616_124849.mp4';

export default function ResumeShowcase() {
    return (
        <section className="resume-hero scroll-section">
  {/* High-tech background grid blueprint */}
  <div className="about-bg-grid" />
  <div className="about-glow-orb orb-orange" style={{opacity: '0.08'}} />
  <div className="about-glow-orb orb-blue" style={{opacity: '0.08'}} />
  <div className="container">
    <div className="resume-grid">
      {/* Left: Professional Video Player */}
      <div className="video-player-wrapper animate-spotlight">
        <div className="video-container" id="videoContainer">
          <video className="resume-video" id="resumeVideo" loop playsInline>
            <source src={resumeVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Custom Futuristic Play Overlay for Autoplay Bypass */}
          <div className="video-overlay-play" id="videoOverlayPlay">
            <div className="play-pulse-btn">
              <i className="fas fa-play" />
            </div>
            <span className="play-overlay-text">Click to Start Video with Sound</span>
          </div>
          {/* Custom Futuristic Control Bar (No mute/volume) */}
          <div className="custom-video-controls" id="videoControls">
            <button className="control-btn" id="playPauseBtn"><i className="fas fa-play" /></button>
            <div className="timeline-container">
              <div className="progress-bar-custom">
                <div className="progress-filled" id="progressFilled" />
              </div>
            </div>
            <span className="time-display" id="timeDisplay">0:00 / 0:00</span>
            <button className="control-btn" id="fullscreenBtn"><i className="fas fa-expand" /></button>
          </div>
        </div>
      </div>
      {/* Right: Description and Action */}
      <div className="resume-features-card">
        <div className="video-badge">Showcase</div>
        <h1 style={{fontSize: '2.2rem', fontWeight: 800, lineHeight: '1.2', marginBottom: 8}}>ANIMATION VIDEO RESUME</h1>
        <h2 style={{fontFamily: 'var(--font-body)', fontSize: '1.15rem', fontWeight: 500, color: 'var(--accent-secondary)', marginBottom: 16}}>
          Visualizing Full-Stack, Mobile &amp; AI Development
        </h2>
        <p style={{color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6'}}>
          Step into my software development journey. This video resume showcases my foundation in full-stack web development, mobile &amp; desktop applications, and growing AI/cybersecurity skills. (Sample placeholder video — will be replaced with a personal video soon.)
        </p>
        <ul className="features-list">
          <li>
            <i className="fas fa-code" style={{color: 'var(--accent-primary)'}} />
            <div>
              <strong>Full-Stack Core:</strong> HTML5, CSS3, JavaScript, Node.js, and MySQL.
            </div>
          </li>
          <li>
            <i className="fas fa-mobile-alt" style={{color: 'var(--accent-secondary)'}} />
            <div>
              <strong>Mobile &amp; Desktop Apps:</strong> Building with Flutter/Dart and Electron.
            </div>
          </li>
          <li>
            <i className="fas fa-shield-alt" style={{color: '#ffffff'}} />
            <div>
              <strong>AI &amp; Cybersecurity:</strong> Exploring AI, Deep Learning, and cybersecurity fundamentals.
            </div>
          </li>
        </ul>
        <div style={{marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap'}}>
          <Link to="/#contact" className="btn btn-primary" style={{flex: 1, minWidth: 150, textAlign: 'center', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 8}}>
            <i className="fas fa-paper-plane" /> Contact Me
          </Link>
          <Link to="/" className="btn btn-secondary" style={{flex: 1, minWidth: 150, textAlign: 'center', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 8}}>
            <i className="fas fa-arrow-left" /> Home Page
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
