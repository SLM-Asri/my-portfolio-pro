import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import introVideo from '../../assets/videos/Say_this_Hello_welcome_to_my.mp4';
import logo from '../../assets/images/logo.jpg';
import resume from '../../assets/documents/Asri_Resume.pdf';
import api from '../../services/api.js';

const defaultProfile = {
    full_name: "Sulaiman Lebbe Muhammad Asri",
    headline: "Full-Stack Web Developer"
};

export default function HeroSection() {
    const [profile, setProfile] = useState(defaultProfile);

    useEffect(() => {
        let isMounted = true;

        api.get('/portfolio')
            .then(({ data }) => {
                if (!isMounted || !data?.personalInfo) return;
                setProfile({
                    ...defaultProfile,
                    full_name: data.personalInfo.full_name || defaultProfile.full_name,
                    headline: data.personalInfo.headline || defaultProfile.headline
                });
            })
            .catch(() => {
                if (isMounted) setProfile(defaultProfile);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section id="home" className="hero-section">
  {/* Background Video */}
  <video muted playsInline preload="none" webkit-playsinline="" className="hero-bg-video" id="heroVideo">
    <source src={introVideo} type="video/mp4" />
  </video>
  {/* Overlay */}
  <div className="hero-overlay" />
  {/* Floating Replay Button (appears when video ends) */}
  <button id="videoReplayBtn" className="video-replay-btn" aria-label="Replay Intro Video" style={{display: 'none'}}>
    <i className="fas fa-undo-alt" />
    <span>Replay Intro</span>
  </button>
  <div className="container hero-container">
    <div className="hero-content">
      {/* Mobile Only Hero Avatar */}
      <div className="mobile-hero-avatar">
        <img src={logo} alt="Asri Logo" />
      </div>
      <div className="greeting-badge">
        <span>Hello</span><span className="dot">.</span>
      </div>
      <h2 className="hero-intro">I'm {profile.full_name}</h2>
      <h1 className="hero-title">
        <span className="typewriter-text" data-words="[&quot;Full-Stack Web Developer&quot;, &quot;Mobile App Developer (Flutter)&quot;, &quot;Desktop App Developer (Electron)&quot;, &quot;HND IT Student&quot;, &quot;AI & Cybersecurity Enthusiast&quot;, &quot;Database & Backend Developer&quot;]">{profile.headline}</span>
      </h1>
      <p className="hero-desc">
        Pursuing a <strong>Higher National Diploma in Information Technology (HND IT)</strong> at SLIATE Anuradhapura. Motivated <strong>Full-Stack Web Developer</strong>, <strong>Mobile &amp; Desktop App Developer</strong>, and <strong>AI enthusiast</strong> specializing in responsive web applications, database-driven systems, and practical software projects.
      </p>
      <div className="hero-actions">
        <a href="#contact" className="btn btn-primary">Get in Touch</a>
        <a href={resume} download className="btn btn-secondary">
          <i className="fas fa-download" /> Download Resume
        </a>
        <Link to="/video-resume" className="btn btn-secondary">
          <i className="fas fa-play-circle" /> Watch Video Resume
        </Link>
      </div>
    </div>
  </div>
</section>

    );
}
