import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

const defaultAboutText = 'I am a highly motivated HND IT student with a strong foundation in software engineering, full-stack web development, mobile application development, and desktop application development. Proficient in HTML5, CSS3, JavaScript, Node.js, Electron, MySQL, Flutter, and Object-Oriented Programming (OOP), I enjoy designing responsive web applications and database-driven systems. I\'m currently expanding my knowledge in Artificial Intelligence, Deep Learning, and Computer Vision through practical projects, and I approach every challenge with a quick-learning, problem-solving, and team-first mindset.';

const fallbackEducation = [
    {
        degree: 'Higher National Diploma in Information Technology (HND IT)',
        institution: 'SLIATE Anuradhapura',
        start_date: '2024',
        end_date: 'Present',
        description: 'Database Management Systems\nSoftware Engineering & System Analysis\nNetworking & Cybersecurity Fundamentals'
    },
    {
        degree: 'G.C.E. Advanced Level (Technology Stream)',
        institution: 'Dharus Salam Arabic College - Oddamavadi',
        start_date: '2022',
        end_date: '2023',
        description: 'Engineering Technology subjects\nIntroductory programming foundation\nStrong communication skill-building'
    },
    {
        degree: 'G.C.E. Ordinary Level',
        institution: 'Dharus Salam Arabic College - Oddamavadi',
        end_date: '2019',
        description: 'General Science & Math basics\nOutstanding language & communication skills\nComputer literacy & hardware basics'
    }
];

function educationDate(item) {
    if (item.start_date && item.end_date) return `${item.start_date} - ${item.end_date}`;
    if (item.start_date) return `${item.start_date} - Present`;
    if (item.end_date) return `Completed in ${item.end_date}`;
    return 'Education';
}

export default function AboutSection() {
    const [aboutText, setAboutText] = useState(defaultAboutText);
    const [aboutDegreeTitle, setAboutDegreeTitle] = useState('HND Information Technology');
    const [education, setEducation] = useState(fallbackEducation);
    const [flippedCards, setFlippedCards] = useState(new Set());

    useEffect(() => {
        let isMounted = true;

        api.get('/portfolio')
            .then(({ data }) => {
                if (!isMounted) return;
                if (data?.personalInfo?.bio) setAboutText(data.personalInfo.bio);
                if (data?.settings?.about_degree_title) setAboutDegreeTitle(data.settings.about_degree_title);
                if (Array.isArray(data?.education)) setEducation(data.education);
            })
            .catch(() => {
                if (isMounted) {
                    setAboutText(defaultAboutText);
                    setAboutDegreeTitle('HND Information Technology');
                    setEducation(fallbackEducation);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const [degreeHighlight, ...degreeSubtitleParts] = aboutDegreeTitle.trim().split(/\s+/);
    const degreeSubtitle = degreeSubtitleParts.join(' ');

    const toggleEducationCard = (cardId) => {
        setFlippedCards((current) => {
            const next = new Set(current);
            if (next.has(cardId)) next.delete(cardId);
            else next.add(cardId);
            return next;
        });
    };

    return (
        <section id="about" className="about-section scroll-section">
  {/* High-tech background grid and glowing theme orbs */}
  <div className="about-bg-grid" />
  <div className="about-glow-orb orb-orange" />
  <div className="about-glow-orb orb-blue" />
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">About Me</h2>
      <div className="title-underline" />
    </div>
    <div className="about-grid">
      {/* Left: Interactive 3D Shape Showcase cards */}
      <div className="about-cards shapes-3d-gallery">
        {/* Card 1: Founder & Creative Director */}
        <div className="shape-card-3d" id="shape-card-founder" style={{borderColor: 'rgba(59, 130, 246, 0.25)'}}>
          <div className="card-icon-2d" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6'}}>
            <i className="fas fa-robot" />
          </div>
          <div className="shape-card-content">
            <h3>Founder &amp; Creative Director</h3>
            <p>Built an <strong>AI-Powered Cybersecurity Awareness Chatbot</strong> using Python, Flask, and MySQL with quizzes and user authentication.</p>
            <Link to="/projects/cybersecurity-chatbot" style={{color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6}}>View Project <i className="fas fa-arrow-right" /></Link>
          </div>
        </div>
        {/* Card 2: Gamified Student Knowledge Level Identification System */}
        <div className="shape-card-3d" id="shape-card-sujok" style={{borderColor: 'rgba(16, 185, 129, 0.25)'}}>
          <div className="card-icon-2d" style={{backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981'}}>
            <i className="fas fa-gamepad" />
          </div>
          <div className="shape-card-content">
            <h3>Gamified Knowledge Assessment System</h3>
            <p>A web-based student knowledge assessment platform with gamified quizzes, JWT auth, and real-time dashboards.</p>
            <Link to="/projects/knowledge-assessment" style={{color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6}}>View Project <i className="fas fa-arrow-right" /></Link>
          </div>
        </div>
        {/* Card 3: Full-Stack & Mobile Development */}
        <div className="shape-card-3d" id="shape-card-mechatronics" style={{borderColor: 'rgba(249, 115, 22, 0.25)'}}>
          <div className="card-icon-2d" style={{backgroundColor: 'rgba(249, 115, 22, 0.08)', color: '#f97316'}}>
            <i className="fas fa-mobile-alt" />
          </div>
          <div className="shape-card-content">
            <h3>Mobile &amp; Desktop App Development</h3>
            <p>Building cross-platform apps with Flutter/Dart and desktop applications using Electron and Node.js.</p>
          </div>
        </div>
        {/* Card 4: AI & Cybersecurity */}
        <div className="shape-card-3d" id="shape-card-ai" style={{borderColor: 'rgba(255, 255, 255, 0.25)'}}>
          <div className="card-icon-2d" style={{backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff'}}>
            <i className="fas fa-brain" />
          </div>
          <div className="shape-card-content">
            <h3>Artificial Intelligence &amp; Cybersecurity</h3>
            <p>Expanding knowledge in AI, Deep Learning, Computer Vision, and cybersecurity fundamentals through practical projects.</p>
          </div>
        </div>
      </div>
      {/* Right: Bio and Timeline */}
      <div className="about-text-content">
        <p className="about-bio">
          {aboutText}
        </p>
        <div className="stats-counter-grid">
          <div className="stat-box">
            <span className="stat-number">6+</span>
            <span className="stat-label">Core Technologies</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">3</span>
            <span className="stat-label">Spoken Languages</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{degreeHighlight}</span>
            <span className="stat-label">{degreeSubtitle}</span>
          </div>
        </div>
        {/* Video Portfolio Button */}
        <div className="video-portfolio-btn-wrapper" style={{margin: '25px 0', display: 'flex', alignItems: 'center', gap: 15}}>
          <div className="attention-arrow" aria-hidden="true">
            <i className="fas fa-arrow-right" />
          </div>
          <Link to="/video-resume" className="btn btn-primary glowing-pulse-btn colorful-theme-btn" style={{width: 'fit-content', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: 1}}>
            <i className="fas fa-play-circle" style={{fontSize: '1.1rem'}} /> Watch My Video Resume
          </Link>
        </div>
        {/* Education Timeline */}
        <div className="education-timeline-wrapper">
          <h3 className="timeline-title"><i className="fas fa-graduation-cap" /> 3D Education Timeline</h3>
          <div className="timeline-3d-rail">
            {education.map((item, index) => {
                const cardId = item.id ?? `${item.degree}-${index}`;
                const milestones = String(item.description || '').split(/\r?\n/).map((text) => text.trim()).filter(Boolean);
                return (
                  <div
                    className="timeline-card-3d"
                    key={cardId}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.degree}, ${educationDate(item)}. Click to flip card.`}
                    aria-pressed={flippedCards.has(cardId)}
                    onClick={() => toggleEducationCard(cardId)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleEducationCard(cardId);
                        }
                    }}
                  >
                    <div className={`card-3d-inner ${flippedCards.has(cardId) ? 'flipped' : ''}`}>
                      <div className="card-3d-front">
                        <div className="timeline-badge" />
                        <span className="timeline-date">{educationDate(item)}</span>
                        <h4>{item.degree}</h4>
                        <p className="institution">{item.institution}{item.location ? ` · ${item.location}` : ''}</p>
                        <div className="flip-hint">Click to flip <i className="fas fa-rotate" /></div>
                      </div>
                      <div className="card-3d-back">
                        <h4>{item.institution || item.degree}</h4>
                        <ul className="milestones-list">
                          {milestones.map((milestone, milestoneIndex) => (
                            <li key={`${cardId}-milestone-${milestoneIndex}`}><i className="fas fa-graduation-cap" /> {milestone}</li>
                          ))}
                        </ul>
                        <div className="flip-hint">Click to flip <i className="fas fa-rotate" /></div>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
