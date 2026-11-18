import { useEffect, useState } from 'react';
import skillsVideo from '../../assets/videos/Animate_face_speaking_text_202606171220.mp4';
import api from '../../services/api.js';

export default function SkillsSection() {
    const [degreeLabel, setDegreeLabel] = useState('HND IT');

    useEffect(() => {
        let isMounted = true;

        api.get('/portfolio')
            .then(({ data }) => {
                if (isMounted && data?.settings?.skills_degree_label) {
                    setDegreeLabel(data.settings.skills_degree_label);
                }
            })
            .catch(() => {
                if (isMounted) setDegreeLabel('HND IT');
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section id="skills" className="skills-section scroll-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Skills &amp; Languages</h2>
      <div className="title-underline" />
    </div>
    <div className="skills-grid">
      {/* Professional Profile Photo Card */}
      <div className="skills-photo-card">
        <div className="photo-frame">
          <video className="skills-avatar" id="skillsVideo" muted playsInline>
            <source src={skillsVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="photo-glow-effect" />
          <div className="photo-badges">
            <span className="photo-badge badge-orange">FULL-STACK DEV</span>
            <span className="photo-badge badge-blue">{degreeLabel}</span>
          </div>
          <button className="photo-replay-btn" id="photoReplayBtn" title="Replay Video" aria-label="Replay Video">
            <i className="fas fa-redo" />
          </button>
        </div>
        <div className="photo-card-info">
          <h3>Sulaiman Lebbe Muhammad Asri</h3>
          <p>Building responsive web apps, mobile &amp; desktop software, and exploring AI-driven solutions.</p>
        </div>
      </div>
      {/* Coding & Tech Skills */}
      <div className="skills-category">
        <h3 className="category-title"><i className="fas fa-code" /> Technology &amp; Coding</h3>
        <div className="tech-dashboard-container">
          {/* Module 1: Web Fundamentals */}
          <div className="tech-diagnostic-module" data-theme="orange">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="85, 100" />
                </svg>
                <i className="fab fa-html5 tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>HTML5, CSS3 &amp; JavaScript</h4>
                <span className="tech-status-badge">[ STATE: COMPILED ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: web_fundamentals.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> Responsive Layouts &amp; Semantic Markup</li>
                <li><span className="prompt">&gt;</span> Modern JavaScript (ES6) Development</li>
                <li><span className="prompt">&gt;</span> Object-Oriented Programming (OOP)</li>
                <li><span className="prompt">&gt;</span> Bootstrap-based Responsive UI</li>
              </ul>
            </div>
          </div>
          {/* Module 2: Node.js & Backend */}
          <div className="tech-diagnostic-module" data-theme="blue">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="75, 100" />
                </svg>
                <i className="fab fa-node-js tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>Node.js &amp; Express.js</h4>
                <span className="tech-status-badge">[ SERVER: ACTIVE ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: nodejs_backend.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> REST API Design &amp; Development</li>
                <li><span className="prompt">&gt;</span> JWT Authentication &amp; Secure Login</li>
                <li><span className="prompt">&gt;</span> Server-side Routing &amp; Middleware</li>
                <li><span className="prompt">&gt;</span> Real-time Dashboard Data Handling</li>
              </ul>
            </div>
          </div>
          {/* Module 3: MySQL & Databases */}
          <div className="tech-diagnostic-module" data-theme="white">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="80, 100" />
                </svg>
                <i className="fas fa-database tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>MySQL &amp; Database Management</h4>
                <span className="tech-status-badge">[ DB: SYNCED ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: mysql_db.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> Relational Schema Design</li>
                <li><span className="prompt">&gt;</span> MySQL Workbench &amp; XAMPP Environments</li>
                <li><span className="prompt">&gt;</span> Query Optimization &amp; Data Integrity</li>
                <li><span className="prompt">&gt;</span> Database-driven Application Integration</li>
              </ul>
            </div>
          </div>
          {/* Module 4: Flutter & Mobile Development */}
          <div className="tech-diagnostic-module" data-theme="green">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="65, 100" />
                </svg>
                <i className="fab fa-flutter tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>Flutter &amp; Dart (Mobile Apps)</h4>
                <span className="tech-status-badge">[ BUILD: RUNNING ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: flutter_mobile.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> Cross-platform Mobile UI (Dart)</li>
                <li><span className="prompt">&gt;</span> Widget-based Application Architecture</li>
                <li><span className="prompt">&gt;</span> XML Layouts &amp; State Management</li>
                <li><span className="prompt">&gt;</span> Mobile-first App Prototyping</li>
              </ul>
            </div>
          </div>
          {/* Module 5: Electron (Desktop Apps) */}
          <div className="tech-diagnostic-module" data-theme="purple">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="70, 100" />
                </svg>
                <i className="fas fa-desktop tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>Electron (Desktop Applications)</h4>
                <span className="tech-status-badge">[ APP: PACKAGED ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: electron_desktop.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> Cross-platform Desktop App Builds</li>
                <li><span className="prompt">&gt;</span> Node.js-powered Desktop Logic</li>
                <li><span className="prompt">&gt;</span> Native-feel UI with Web Technologies</li>
                <li><span className="prompt">&gt;</span> Git &amp; GitHub Version Control</li>
              </ul>
            </div>
          </div>
          {/* Module 6: Cybersecurity */}
          <div className="tech-diagnostic-module" data-theme="red">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="65, 100" />
                </svg>
                <i className="fas fa-shield-alt tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>Cybersecurity Fundamentals</h4>
                <span className="tech-status-badge">[ PARAPET: SECURED ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: cyber_sec.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> User Authentication &amp; Session Security</li>
                <li><span className="prompt">&gt;</span> Cybersecurity Awareness Content Design</li>
                <li><span className="prompt">&gt;</span> Secure Database Connectivity</li>
                <li><span className="prompt">&gt;</span> AI-powered Security Awareness Tools</li>
              </ul>
            </div>
          </div>
          {/* Module 7: Communication */}
          <div className="tech-diagnostic-module" data-theme="yellow">
            <div className="tech-module-header">
              <div className="tech-indicator-circle">
                <svg className="tech-ring" viewBox="0 0 36 36">
                  <circle className="ring-bg" cx={18} cy={18} r={16} />
                  <circle className="ring-fill" cx={18} cy={18} r={16} strokeDasharray="90, 100" />
                </svg>
                <i className="fas fa-comments tech-icon" />
              </div>
              <div className="tech-title-wrap">
                <h4>Communication &amp; Teamwork</h4>
                <span className="tech-status-badge">[ LINK STATE: OPTIMAL ]</span>
              </div>
              <div className="tech-toggle-arrow">
                <i className="fas fa-chevron-down" />
              </div>
            </div>
            <div className="tech-log-console">
              <div className="console-title">&gt; SYSTEM DIAGNOSTICS: core_comm.sys</div>
              <ul className="console-logs">
                <li><span className="prompt">&gt;</span> Problem Solving &amp; Time Management</li>
                <li><span className="prompt">&gt;</span> Teamwork &amp; Cross-functional Collaboration</li>
                <li><span className="prompt">&gt;</span> Project Planning &amp; Documentation</li>
                <li><span className="prompt">&gt;</span> Leadership &amp; Group Facilitation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Languages & Tools */}
      <div className="skills-category">
        <h3 className="category-title"><i className="fas fa-language" /> Languages &amp; Interpersonal</h3>
        <div className="languages-grid">
          {/* Card 1: English */}
          <div className="lang-card" data-lang-theme="blue">
            <div className="lang-header">
              <div className="lang-meta">
                <span className="lang-code-badge">EN</span>
                <h4>English</h4>
              </div>
              <span className="lang-level-badge">FLUENT</span>
            </div>
            <div className="lang-progress-container">
              <div className="lang-progress-bar">
                <div className="lang-progress-fill" />
              </div>
              <span className="lang-progress-val">95%</span>
            </div>
            <p className="lang-desc">Technical documentation, professional correspondence, and confident presentation skills.</p>
          </div>
          {/* Card 2: Tamil */}
          <div className="lang-card" data-lang-theme="orange">
            <div className="lang-header">
              <div className="lang-meta">
                <span className="lang-code-badge">TA</span>
                <h4>Tamil</h4>
              </div>
              <span className="lang-level-badge">NATIVE</span>
            </div>
            <div className="lang-progress-container">
              <div className="lang-progress-bar">
                <div className="lang-progress-fill" />
              </div>
              <span className="lang-progress-val">100%</span>
            </div>
            <p className="lang-desc">Native communication, regional cultural alignment, and local technical presentation capabilities.</p>
          </div>
          {/* Card 3: Sinhala */}
          <div className="lang-card" data-lang-theme="green">
            <div className="lang-header">
              <div className="lang-meta">
                <span className="lang-code-badge">SI</span>
                <h4>Sinhala</h4>
              </div>
              <span className="lang-level-badge">FLUENT</span>
            </div>
            <div className="lang-progress-container">
              <div className="lang-progress-bar">
                <div className="lang-progress-fill" />
              </div>
              <span className="lang-progress-val">90%</span>
            </div>
            <p className="lang-desc">Fluent conversation, local community networking, and effective team coordination.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    );
}
