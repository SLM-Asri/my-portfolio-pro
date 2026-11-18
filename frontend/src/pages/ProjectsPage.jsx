import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import api from '../services/api.js';
import { resolveProjectImage } from '../utils/projectImage.js';
import { observeScrollReveals } from '../utils/scrollReveal.js';
import '../styles/projects.css';

function ProjectCard({ project }) {
  return (
    <article className="project-showcase-card">
      <Link to={`/projects/${project.slug}`} className="project-showcase-image-link" aria-label={`View ${project.title}`}>
        {project.featured_image ? (
          <img
            className="project-showcase-image"
            src={resolveProjectImage(project.featured_image)}
            alt={`${project.title} preview`}
            loading="lazy"
          />
        ) : (
          <div className="project-showcase-image-fallback" aria-label={`${project.title} preview unavailable`}>
            <i className="fas fa-code" aria-hidden="true" />
          </div>
        )}
      </Link>
      <div className="project-showcase-content">
        <div className="project-showcase-meta">
          <span className="project-category">{project.project_type || 'Project'}</span>
          <span className="project-status">{project.completion_status || 'Completed'}</span>
        </div>
        <h2>{project.title}</h2>
        <p className="project-showcase-summary">{project.summary || project.description}</p>
        {project.technologies?.length > 0 && (
          <ul className="project-tech-list" aria-label="Technologies used">
            {project.technologies.slice(0, 5).map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
            {project.technologies.length > 5 && <li>+{project.technologies.length - 5}</li>}
          </ul>
        )}
        <Link to={`/projects/${project.slug}`} className="btn btn-primary project-view-button">
          View Project <i className="fas fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const projectsPageRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.get('/portfolio/projects')
      .then(({ data }) => {
        if (isMounted) setProjects(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.response?.data?.message || requestError.message || 'Projects could not be loaded.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(
    () => observeScrollReveals(projectsPageRef.current, '.projects-page-heading, .project-showcase-card'),
    [isLoading, projects]
  );

  return (
    <SiteLayout
      page="projects"
      title="Projects | S.L.M. Asri"
      description="Explore completed full-stack, education, and cybersecurity projects by Sulaiman Lebbe Muhammad Asri."
    >
      <main className="projects-page" ref={projectsPageRef}>
        <div className="container">
          <header className="projects-page-heading">
            <span className="service-badge">Selected Work</span>
            <h1 className="section-title">Projects</h1>
            <div className="title-underline" />
            <p className="hero-desc">
              A collection of completed projects, the problems they address, and the technologies behind them.
            </p>
          </header>

          {isLoading ? (
            <p className="projects-state" role="status">Loading projects...</p>
          ) : error ? (
            <p className="projects-state projects-state-error" role="alert">{error}</p>
          ) : projects.length ? (
            <div className="project-showcase-grid">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <p className="projects-state">No published projects are available yet.</p>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}
