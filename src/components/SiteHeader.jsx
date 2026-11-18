import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';
import resume from '../assets/documents/Asri_Resume.pdf';

export default function SiteHeader({ page }) {
    const isHome = page === 'home';
    const isResume = page === 'resume';
    const isProject = page === 'chatbot' || page === 'knowledge';
    const isProjectDirectory = page === 'projects';
    const isProjectDetails = page === 'project-details';
    const homeHref = isHome ? '#home' : '/#home';
    const aboutHref = isHome ? '#about' : '/#about';
    const skillsHref = isHome ? '#skills' : '/#skills';
    const contactHref = isHome ? '#contact' : '/#contact';
    const logoHref = isHome ? '#home' : '/';
    const resumeHref = '/video-resume';
    const projectsHref = '/projects';
    const backHref = isProjectDetails ? projectsHref : '/';

    return (
        <>
            <header className={isHome ? 'header' : 'header sticky'}>
                <div className="container nav-container">
                    <Link to={logoHref} className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <img src={logo} alt="Asri Logo" className="header-logo-img" style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--accent-primary)', objectFit: 'cover' }} />
                        <span>Asri<span className="logo-dot">.</span><span className="logo-m">Dev</span></span>
                    </Link>
                    <nav className="nav-menu">
                        <Link to={homeHref} className={`nav-link${isHome ? ' active' : ''}`}>Home</Link>
                        <Link to={aboutHref} className="nav-link">About</Link>
                        <Link to={projectsHref} className={`nav-link${isProjectDirectory ? ' active' : ''}`}>Projects</Link>
                        <Link to={resumeHref} className={`nav-link${isResume ? ' active' : ''}`}>Video Resume</Link>
                        <Link to={skillsHref} className="nav-link">{isResume ? 'Skills' : 'Skills & Languages'}</Link>
                        <Link to={contactHref} className="nav-link">Contact</Link>
                        {isHome ? (
                            <a href={resume} download className="btn btn-secondary nav-btn" style={{ padding: '6px 16px', fontSize: '0.85rem', marginLeft: 10 }}>
                                <i className="fas fa-download" /> Resume
                            </a>
                        ) : (
                            <Link to={backHref} className="btn btn-secondary nav-btn" style={{ padding: '6px 16px', fontSize: '0.85rem', marginLeft: 10 }}>
                                <i className="fas fa-arrow-left" /> {isProjectDetails ? 'Back to Projects' : 'Back to Portfolio'}
                            </Link>
                        )}
                    </nav>
                    <div className="menu-toggle" id="mobileMenuBtn">
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </div>
                </div>
            </header>
            <div className="mobile-nav" id="mobileNavMenu">
                <Link to={homeHref} className="mobile-link">Home</Link>
                <Link to={aboutHref} className="mobile-link">About</Link>
                <Link to={projectsHref} className={`mobile-link${isProjectDirectory ? ' active' : ''}`}>Projects</Link>
                <Link to={resumeHref} className={`mobile-link${isResume ? ' active' : ''}`}>Video Resume</Link>
                <Link to={skillsHref} className="mobile-link">Skills &amp; Languages</Link>
                <Link to={contactHref} className="mobile-link">Contact</Link>
                {isHome ? (
                    <a href={resume} download className="mobile-link" style={{ color: 'var(--accent-primary)' }}>
                        <i className="fas fa-download" /> Download Resume
                    </a>
                ) : isProject || isProjectDirectory || isProjectDetails ? (
                    <Link to={backHref} className="mobile-link" style={{ color: 'var(--accent-primary)' }}>
                        <i className="fas fa-arrow-left" /> {isProjectDetails ? 'Back to Projects' : 'Back to Portfolio'}
                    </Link>
                ) : null}
            </div>
        </>
    );
}
