import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import api from '../services/api.js';
import { resolveProjectImage } from '../utils/projectImage.js';
import '../styles/projects.css';

function ContentSection({ title, children, className = '' }) {
  if (!children) return null;
  return (
    <section className={`project-detail-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TextList({ items }) {
  if (!items?.length) return null;
  return <ul className="project-detail-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function ExternalLink({ href, children }) {
  if (!href) return null;
  try {
    const protocol = new URL(href, window.location.origin).protocol;
    if (protocol !== 'http:' && protocol !== 'https:') return null;
  } catch {
    return null;
  }
  return <a className="btn btn-secondary" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function ProjectContent({ project }) {
  const liveDemo = project.live_demo_url || project.link_url;

  return (
    <>
      <section className="project-detail-hero">
        <div className="container">
          <Link to="/projects" className="project-back-link"><i className="fas fa-arrow-left" /> Back to Projects</Link>
          <div className="project-detail-hero-grid">
            <div className="project-detail-intro">
              <div className="project-showcase-meta">
                <span className="project-category">{project.project_type || 'Project'}</span>
                <span className="project-status">{project.completion_status || 'Completed'}</span>
              </div>
              <h1>{project.title}</h1>
              {(project.summary || project.description) && <p>{project.summary || project.description}</p>}
              <div className="project-detail-actions">
                <ExternalLink href={project.github_url}><i className="fab fa-github" /> GitHub Repository</ExternalLink>
                <ExternalLink href={liveDemo}><i className="fas fa-external-link-alt" /> Live Demo</ExternalLink>
              </div>
            </div>
            {project.featured_image && (
              <img
                className="project-detail-hero-image"
                src={resolveProjectImage(project.featured_image)}
                alt={`${project.title} project preview`}
              />
            )}
          </div>
        </div>
      </section>

      <main className="project-detail-content container">
        {(project.description || project.summary) && (
          <ContentSection title="Project Overview">
            <p>{project.description || project.summary}</p>
          </ContentSection>
        )}

        {(project.problem_statement || project.proposed_solution) && (
          <div className="project-detail-two-column">
            <ContentSection title="Problem Statement">{project.problem_statement && <p>{project.problem_statement}</p>}</ContentSection>
            <ContentSection title="Proposed Solution">{project.proposed_solution && <p>{project.proposed_solution}</p>}</ContentSection>
          </div>
        )}

        {project.objectives?.length > 0 && (
          <ContentSection title="Project Objectives"><TextList items={project.objectives} /></ContentSection>
        )}
        {project.features?.length > 0 && (
          <ContentSection title="Key Features"><TextList items={project.features} /></ContentSection>
        )}

        {project.technologies?.length > 0 && (
          <ContentSection title="Technologies & Tools">
            <ul className="project-tech-list project-detail-tech">
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </ContentSection>
        )}

        {(project.frontend_details || project.backend_details || project.database_details) && (
          <ContentSection title="Application Stack">
            <div className="project-stack-grid">
              {project.frontend_details && <div><h3>Frontend</h3><p>{project.frontend_details}</p></div>}
              {project.backend_details && <div><h3>Backend</h3><p>{project.backend_details}</p></div>}
              {project.database_details && <div><h3>Database</h3><p>{project.database_details}</p></div>}
            </div>
          </ContentSection>
        )}

        {project.screenshots?.length > 0 && (
          <ContentSection title="Project Gallery">
            <div className="project-gallery">
              {project.screenshots.map((screenshot, index) => (
                <a key={`${screenshot}-${index}`} href={resolveProjectImage(screenshot)} target="_blank" rel="noopener noreferrer">
                  <img src={resolveProjectImage(screenshot)} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" />
                </a>
              ))}
            </div>
          </ContentSection>
        )}

        {project.architecture && <ContentSection title="System Architecture"><p>{project.architecture}</p></ContentSection>}
        {project.database_structure && <ContentSection title="Database Structure"><p>{project.database_structure}</p></ContentSection>}
        {project.challenges && <ContentSection title="Challenges"><p>{project.challenges}</p></ContentSection>}
        {project.role_contributions && <ContentSection title="My Role & Contributions"><p>{project.role_contributions}</p></ContentSection>}

        {project.relatedProjects?.length > 0 && (
          <ContentSection title="Related Projects">
            <div className="related-project-grid">
              {project.relatedProjects.map((related) => (
                <Link key={related.id} to={`/projects/${related.slug}`} className="related-project-card">
                  {related.featured_image && (
                    <img src={resolveProjectImage(related.featured_image)} alt="" loading="lazy" />
                  )}
                  <span>{related.project_type || 'Project'}</span>
                  <h3>{related.title}</h3>
                  <span className="related-project-link">View Project <i className="fas fa-arrow-right" /></span>
                </Link>
              ))}
            </div>
          </ContentSection>
        )}

        <Link to="/projects" className="btn btn-secondary project-back-bottom">
          <i className="fas fa-arrow-left" /> Back to Projects
        </Link>
      </main>
    </>
  );
}

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setProject(null);
    setIsLoading(true);
    setError('');
    api.get(`/portfolio/projects/${encodeURIComponent(slug)}`)
      .then(({ data }) => {
        if (isMounted) setProject(data);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.response?.status === 404
          ? 'This project could not be found.'
          : requestError.response?.data?.message || requestError.message || 'Project details could not be loaded.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const title = project ? `${project.title} | S.L.M. Asri` : 'Project Details | S.L.M. Asri';
  return (
    <SiteLayout page="project-details" title={title} description={project?.summary || 'Project details and technologies.'}>
      {project ? (
        <ProjectContent project={project} />
      ) : (
        <main className="projects-page">
          <div className="container project-load-state" role={error ? 'alert' : 'status'}>
            <p>{isLoading ? 'Loading project...' : error}</p>
            {!isLoading && <Link to="/projects" className="btn btn-secondary">Back to Projects</Link>}
          </div>
        </main>
      )}
    </SiteLayout>
  );
}
