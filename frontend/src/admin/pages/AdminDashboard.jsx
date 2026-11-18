import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { observeScrollReveals } from '../../utils/scrollReveal.js';
import '../styles/admin.css';

const initialPersonalInfo = {
  full_name: '',
  headline: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  resume_url: '',
  hero_video_url: '',
  avatar_url: '',
  is_published: true
};

const initialSettings = {
  site_name: '',
  meta_title: '',
  meta_description: '',
  contact_email: '',
  contact_phone: '',
  location: '',
  primary_color: '#3b82f6',
  secondary_color: '#f97316',
  skills_degree_label: 'HND IT',
  about_degree_title: 'HND Information Technology',
  is_maintenance_mode: false
};

const projectDefaults = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  project_type: 'Portfolio',
  featured_image: '',
  link_url: '',
  completion_status: 'Completed',
  problem_statement: '',
  proposed_solution: '',
  objectives: '',
  features: '',
  technologies: '',
  frontend_details: '',
  backend_details: '',
  database_details: '',
  screenshots: '',
  architecture: '',
  database_structure: '',
  challenges: '',
  role_contributions: '',
  github_url: '',
  live_demo_url: '',
  is_published: true
};

const toLineList = (value) => String(value || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

function projectToForm(project) {
  return {
    ...projectDefaults,
    ...project,
    summary: project.summary || '',
    description: project.description || '',
    project_type: project.project_type || 'Portfolio',
    featured_image: project.featured_image || '',
    link_url: project.link_url || '',
    completion_status: project.completion_status || 'Completed',
    problem_statement: project.problem_statement || '',
    proposed_solution: project.proposed_solution || '',
    frontend_details: project.frontend_details || '',
    backend_details: project.backend_details || '',
    database_details: project.database_details || '',
    architecture: project.architecture || '',
    database_structure: project.database_structure || '',
    challenges: project.challenges || '',
    role_contributions: project.role_contributions || '',
    github_url: project.github_url || '',
    live_demo_url: project.live_demo_url || '',
    technologies: (project.technologies || []).join('\n'),
    objectives: (project.objectives || []).join('\n'),
    features: (project.features || []).join('\n'),
    screenshots: (project.screenshots || []).join('\n'),
    is_published: Boolean(project.is_published)
  };
}

const skillDefaults = {
  name: '',
  category: 'General',
  level: 80,
  description: '',
  is_published: true
};

const certificationDefaults = {
  title: '',
  organization: '',
  description: '',
  issued_date: '',
  is_published: true
};

const adminNavItems = [
  { id: 'overview', label: 'Overview', icon: 'fa-chart-pie', description: 'Portfolio status and recent activity.' },
  { id: 'personal', label: 'Personal info', icon: 'fa-user', description: 'Manage your public profile and contact details.' },
  { id: 'projects', label: 'Projects', icon: 'fa-folder-open', description: 'Create and update your portfolio projects.' },
  { id: 'skills', label: 'Skills', icon: 'fa-code', description: 'Maintain the skills shown on your portfolio.' },
  { id: 'certifications', label: 'Certifications', icon: 'fa-certificate', description: 'Manage certifications and courses.' },
  { id: 'education', label: 'Education', icon: 'fa-graduation-cap', description: 'Update the 3D education timeline.' },
  { id: 'settings', label: 'Site settings', icon: 'fa-sliders', description: 'Configure branding and site metadata.' },
  { id: 'messages', label: 'Messages', icon: 'fa-envelope', description: 'Review and manage contact messages.' }
];

const educationDefaults = {
  degree: '',
  institution: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
  is_published: true
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminContentRef = useRef(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [dashboard, setDashboard] = useState({
    personalInfo: null,
    projects: [],
    skills: [],
    certifications: [],
    education: [],
    settings: null,
    messages: []
  });
  const [adminUser, setAdminUser] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingCertificationId, setEditingCertificationId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [personalForm, setPersonalForm] = useState(initialPersonalInfo);
  const [settingsForm, setSettingsForm] = useState(initialSettings);
  const [projectForm, setProjectForm] = useState(projectDefaults);
  const [skillForm, setSkillForm] = useState(skillDefaults);
  const [certificationForm, setCertificationForm] = useState(certificationDefaults);
  const [educationForm, setEducationForm] = useState(educationDefaults);

  const refreshDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setDashboard(data);
      setPersonalForm(data.personalInfo || initialPersonalInfo);
      setSettingsForm({
        site_name: data.settings?.site_name || '',
        meta_title: data.settings?.meta_title || '',
        meta_description: data.settings?.meta_description || '',
        contact_email: data.settings?.contact_email || '',
        contact_phone: data.settings?.contact_phone || '',
        location: data.settings?.location || '',
        primary_color: data.settings?.primary_color || '#3b82f6',
        secondary_color: data.settings?.secondary_color || '#f97316',
        skills_degree_label: data.settings?.skills_degree_label || 'HND IT',
        about_degree_title: data.settings?.about_degree_title || 'HND Information Technology',
        is_maintenance_mode: Boolean(data.settings?.is_maintenance_mode)
      });
    } catch (error) {
      if (error.message?.includes('401') || error.response?.status === 401) {
        setIsAuthorized(false);
        navigate('/admin');
        return;
      }
      setStatus(error.message || 'Dashboard could not load.');
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await api.get('/admin/me');
        setAdminUser(data.admin);
        setIsAuthorized(true);
        await refreshDashboard();
      } catch (error) {
        navigate('/admin');
      }
    };

    loadSession();
  }, [navigate]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isAuthorized) return undefined;
    return observeScrollReveals(
      adminContentRef.current,
      '.admin-page-heading, .admin-notice, .admin-grid > .admin-card, .admin-content > .admin-card'
    );
  }, [activeTab, isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  const summaryCards = [
    { label: 'Portfolio profile', value: dashboard.personalInfo ? 'Ready' : 'Not set', icon: 'fa-id-card', tone: 'blue' },
    { label: 'Projects', value: String(dashboard.projects.length), icon: 'fa-folder-open', tone: 'violet' },
    { label: 'Skills', value: String(dashboard.skills.length), icon: 'fa-code', tone: 'green' },
    { label: 'Messages', value: String(dashboard.messages.length), icon: 'fa-envelope', tone: 'orange' }
  ];
  const activeNavItem = adminNavItems.find((item) => item.id === activeTab) || adminNavItems[0];

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
      navigate('/admin');
    } catch (error) {
      setStatus(error.message || 'Logout failed. Please try again.');
    }
  };

  const handlePersonalSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...personalForm };
      if (dashboard.personalInfo?.id) {
        await api.put(`/admin/personal-info/${dashboard.personalInfo.id}`, payload);
      } else {
        await api.post('/admin/personal-info', payload);
      }
      setStatus('Personal info saved.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Could not save personal info.');
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    try {
      if (dashboard.settings?.id) {
        await api.put(`/admin/settings/${dashboard.settings.id}`, settingsForm);
      } else {
        await api.post('/admin/settings', settingsForm);
      }
      setStatus('Site settings saved.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Could not save settings.');
    }
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...projectForm,
        technologies: toLineList(projectForm.technologies),
        objectives: toLineList(projectForm.objectives),
        features: toLineList(projectForm.features),
        screenshots: toLineList(projectForm.screenshots)
      };
      if (editingProjectId) {
        await api.put(`/admin/projects/${editingProjectId}`, payload);
        setStatus('Project updated.');
      } else {
        await api.post('/admin/projects', payload);
        setStatus('Project created.');
      }
      setProjectForm(projectDefaults);
      setEditingProjectId(null);
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Project could not be created.');
    }
  };

  const handleEditProject = async (projectId) => {
    try {
      const { data } = await api.get(`/admin/projects/${projectId}`);
      setProjectForm(projectToForm(data));
      setEditingProjectId(projectId);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Project could not be loaded for editing.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/admin/projects/${projectId}`);
      if (editingProjectId === projectId) {
        setProjectForm(projectDefaults);
        setEditingProjectId(null);
      }
      setStatus('Project deleted.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Project could not be deleted.');
    }
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingSkillId) {
        await api.put(`/admin/skills/${editingSkillId}`, skillForm);
        setStatus('Skill updated.');
      } else {
        await api.post('/admin/skills', skillForm);
        setStatus('Skill created.');
      }
      setSkillForm(skillDefaults);
      setEditingSkillId(null);
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Skill could not be saved.');
    }
  };

  const handleEditSkill = (skill) => {
    setSkillForm({
      name: skill.name || '',
      category: skill.category || 'General',
      level: Number(skill.level || 80),
      description: skill.description || '',
      is_published: Boolean(skill.is_published)
    });
    setEditingSkillId(skill.id);
    setStatus('');
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/admin/skills/${skillId}`);
      if (editingSkillId === skillId) {
        setSkillForm(skillDefaults);
        setEditingSkillId(null);
      }
      setStatus('Skill deleted.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Skill could not be deleted.');
    }
  };

  const handleCertificationSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCertificationId) {
        await api.put(`/admin/certifications/${editingCertificationId}`, certificationForm);
        setStatus('Certification updated.');
      } else {
        await api.post('/admin/certifications', certificationForm);
        setStatus('Certification created.');
      }
      setCertificationForm(certificationDefaults);
      setEditingCertificationId(null);
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Certification could not be saved.');
    }
  };

  const handleEditCertification = (certification) => {
    setCertificationForm({
      title: certification.title || '',
      organization: certification.organization || '',
      description: certification.description || '',
      issued_date: certification.issued_date || '',
      is_published: Boolean(certification.is_published)
    });
    setEditingCertificationId(certification.id);
    setStatus('');
  };

  const handleDeleteCertification = async (certificationId) => {
    try {
      await api.delete(`/admin/certifications/${certificationId}`);
      if (editingCertificationId === certificationId) {
        setCertificationForm(certificationDefaults);
        setEditingCertificationId(null);
      }
      setStatus('Certification deleted.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Certification could not be deleted.');
    }
  };

  const handleEducationSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingEducationId) {
        await api.put(`/admin/education/${editingEducationId}`, educationForm);
        setStatus('Education timeline item updated.');
      } else {
        await api.post('/admin/education', educationForm);
        setStatus('Education timeline item added.');
      }
      setEducationForm(educationDefaults);
      setEditingEducationId(null);
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Education timeline item could not be saved.');
    }
  };

  const handleEditEducation = (education) => {
    setEducationForm({
      degree: education.degree || '',
      institution: education.institution || '',
      location: education.location || '',
      start_date: education.start_date || '',
      end_date: education.end_date || '',
      description: education.description || '',
      is_published: Boolean(education.is_published)
    });
    setEditingEducationId(education.id);
    setStatus('');
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/admin/messages/${messageId}`);
      setStatus('Message deleted.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Message could not be deleted.');
    }
  };

  const handleMarkRead = async (messageId) => {
    try {
      await api.patch(`/admin/messages/${messageId}/read`);
      setStatus('Message marked as read.');
      await refreshDashboard();
    } catch (error) {
      setStatus(error.message || 'Message status could not be updated.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-brand-group">
            <button
              type="button"
              className="admin-menu-toggle"
              aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isSidebarOpen}
              aria-controls="admin-sidebar"
              onClick={() => setIsSidebarOpen((open) => !open)}
            >
              <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
            </button>
            <div className="admin-brand-mark"><i className="fas fa-layer-group" aria-hidden="true" /></div>
            <div>
              <div className="admin-brand">Asri Portfolio</div>
              <div className="admin-brand-caption">ADMIN CONSOLE</div>
            </div>
          </div>
          <div className="admin-actions">
            <div className="admin-user">
              <span className="admin-user-avatar">{adminUser?.name?.slice(0, 1).toUpperCase() || 'A'}</span>
              <span className="admin-user-name">{adminUser ? adminUser.name : 'Loading...'}</span>
            </div>
            <button className="admin-btn secondary admin-logout" onClick={handleLogout}>
              <i className="fas fa-arrow-right-from-bracket" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {isSidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="admin-layout">
          <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} id="admin-sidebar">
            <div className="admin-sidebar-heading">
              <div>
                <span className="admin-sidebar-kicker">Workspace</span>
                <strong>Manage portfolio</strong>
              </div>
              <button
                type="button"
                className="admin-sidebar-close"
                aria-label="Close navigation menu"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
            <nav className="admin-tabs" aria-label="Admin sections">
              {adminNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-tab ${activeTab === item.id ? 'active' : ''}`}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <i className={`fas ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {activeTab === item.id && <i className="fas fa-chevron-right admin-tab-current" aria-hidden="true" />}
                </button>
              ))}
            </nav>
          </aside>

          <main className="admin-content" ref={adminContentRef}>
            <div className="admin-page-heading">
              <div>
                <div className="admin-breadcrumb">ADMINISTRATION <i className="fas fa-chevron-right" aria-hidden="true" /> {activeNavItem.label.toUpperCase()}</div>
                <h1>{activeTab === 'overview' ? 'Dashboard overview' : activeNavItem.label}</h1>
                <p>{activeNavItem.description}</p>
              </div>
            </div>

            {status && <div className="admin-notice" role="status" aria-live="polite">{status}</div>}

            {activeTab === 'overview' && (
              <div className="admin-grid">
                {summaryCards.map((card) => (
                  <div key={card.label} className="admin-card metric-card">
                    <div className={`metric-icon ${card.tone}`}><i className={`fas ${card.icon}`} aria-hidden="true" /></div>
                    <div className="metric-label">{card.label}</div>
                    <div className="metric-value">{card.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="admin-card">
                <div className="admin-section-heading">
                  <div>
                    <h2>Recent projects</h2>
                    <p>Your latest portfolio work</p>
                  </div>
                  <span className="admin-section-count">{dashboard.projects.length} total</span>
                </div>
                <div className="admin-list">
                  {dashboard.projects.slice(0, 5).map((project) => (
                    <div className="admin-item" key={project.id}>
                      <div>
                        <strong>{project.title}</strong>
                        <small>{project.slug}</small>
                      </div>
                      <span>{project.is_published ? 'Published' : 'Draft'}</span>
                    </div>
                  ))}
                  {dashboard.projects.length === 0 && <p className="admin-empty">No projects added yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="admin-card">
                <h3>Personal Information</h3>
                <form className="admin-form" onSubmit={handlePersonalSubmit}>
                  <div className="admin-row">
                    <div className="admin-field"><label>Full name</label><input value={personalForm.full_name || ''} onChange={(e) => setPersonalForm({ ...personalForm, full_name: e.target.value })} /></div>
                    <div className="admin-field"><label>Headline</label><input value={personalForm.headline || ''} onChange={(e) => setPersonalForm({ ...personalForm, headline: e.target.value })} /></div>
                  </div>
                  <div className="admin-field"><label>Bio</label><textarea value={personalForm.bio || ''} onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })} /></div>
                  <div className="admin-row">
                    <div className="admin-field"><label>Email</label><input value={personalForm.email || ''} onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })} /></div>
                    <div className="admin-field"><label>Phone</label><input value={personalForm.phone || ''} onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })} /></div>
                  </div>
                  <div className="admin-row">
                    <div className="admin-field"><label>Location</label><input value={personalForm.location || ''} onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })} /></div>
                    <div className="admin-field"><label>LinkedIn</label><input value={personalForm.linkedin || ''} onChange={(e) => setPersonalForm({ ...personalForm, linkedin: e.target.value })} /></div>
                  </div>
                  <div className="admin-row">
                    <div className="admin-field"><label>GitHub</label><input value={personalForm.github || ''} onChange={(e) => setPersonalForm({ ...personalForm, github: e.target.value })} /></div>
                    <div className="admin-field"><label>Resume URL</label><input value={personalForm.resume_url || ''} onChange={(e) => setPersonalForm({ ...personalForm, resume_url: e.target.value })} /></div>
                  </div>
                  <div className="admin-row">
                    <div className="admin-field"><label>Hero video URL</label><input value={personalForm.hero_video_url || ''} onChange={(e) => setPersonalForm({ ...personalForm, hero_video_url: e.target.value })} /></div>
                    <div className="admin-field"><label>Avatar URL</label><input value={personalForm.avatar_url || ''} onChange={(e) => setPersonalForm({ ...personalForm, avatar_url: e.target.value })} /></div>
                  </div>
                  <div className="admin-field"><label>Published</label><select value={personalForm.is_published ? 'true' : 'false'} onChange={(e) => setPersonalForm({ ...personalForm, is_published: e.target.value === 'true' })}><option value="true">Published</option><option value="false">Hidden</option></select></div>
                  <button type="submit" className="admin-btn primary">Save personal info</button>
                </form>
              </div>
            )}

        {activeTab === 'projects' && (
          <div className="admin-card">
            <h3>Projects</h3>
            <form className="admin-form" onSubmit={handleProjectSubmit}>
              <div className="admin-row">
                <div className="admin-field"><label>Title</label><input required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} /></div>
                <div className="admin-field"><label>Slug</label><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Summary</label><textarea value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} /></div>
              <div className="admin-field"><label>Description</label><textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} /></div>
              <div className="admin-row">
                <div className="admin-field"><label>Category</label><input value={projectForm.project_type} onChange={(e) => setProjectForm({ ...projectForm, project_type: e.target.value })} /></div>
                <div className="admin-field"><label>Completion status</label><input value={projectForm.completion_status} onChange={(e) => setProjectForm({ ...projectForm, completion_status: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Thumbnail image URL</label><input required value={projectForm.featured_image} onChange={(e) => setProjectForm({ ...projectForm, featured_image: e.target.value })} /></div>
              <div className="admin-field"><label>Technologies (one per line)</label><textarea value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} /></div>
              <div className="admin-row">
                <div className="admin-field"><label>GitHub repository URL</label><input value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} /></div>
                <div className="admin-field"><label>Live demo URL</label><input value={projectForm.live_demo_url} onChange={(e) => setProjectForm({ ...projectForm, live_demo_url: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Problem statement</label><textarea value={projectForm.problem_statement} onChange={(e) => setProjectForm({ ...projectForm, problem_statement: e.target.value })} /></div>
              <div className="admin-field"><label>Proposed solution</label><textarea value={projectForm.proposed_solution} onChange={(e) => setProjectForm({ ...projectForm, proposed_solution: e.target.value })} /></div>
              <div className="admin-field"><label>Objectives (one per line)</label><textarea value={projectForm.objectives} onChange={(e) => setProjectForm({ ...projectForm, objectives: e.target.value })} /></div>
              <div className="admin-field"><label>Features (one per line)</label><textarea value={projectForm.features} onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })} /></div>
              <div className="admin-row">
                <div className="admin-field"><label>Frontend details</label><textarea value={projectForm.frontend_details} onChange={(e) => setProjectForm({ ...projectForm, frontend_details: e.target.value })} /></div>
                <div className="admin-field"><label>Backend details</label><textarea value={projectForm.backend_details} onChange={(e) => setProjectForm({ ...projectForm, backend_details: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Database details</label><textarea value={projectForm.database_details} onChange={(e) => setProjectForm({ ...projectForm, database_details: e.target.value })} /></div>
              <div className="admin-field"><label>Screenshot image URLs (one per line)</label><textarea value={projectForm.screenshots} onChange={(e) => setProjectForm({ ...projectForm, screenshots: e.target.value })} /></div>
              <div className="admin-field"><label>System architecture</label><textarea value={projectForm.architecture} onChange={(e) => setProjectForm({ ...projectForm, architecture: e.target.value })} /></div>
              <div className="admin-field"><label>Database structure</label><textarea value={projectForm.database_structure} onChange={(e) => setProjectForm({ ...projectForm, database_structure: e.target.value })} /></div>
              <div className="admin-field"><label>Challenges</label><textarea value={projectForm.challenges} onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })} /></div>
              <div className="admin-field"><label>My role and contributions</label><textarea value={projectForm.role_contributions} onChange={(e) => setProjectForm({ ...projectForm, role_contributions: e.target.value })} /></div>
              <div className="admin-field"><label>Published</label><select value={projectForm.is_published ? 'true' : 'false'} onChange={(e) => setProjectForm({ ...projectForm, is_published: e.target.value === 'true' })}><option value="true">Published</option><option value="false">Draft</option></select></div>
              <div className="admin-actions">
                <button type="submit" className="admin-btn primary">{editingProjectId ? 'Save project' : 'Create project'}</button>
                {editingProjectId && <button type="button" className="admin-btn secondary" onClick={() => { setProjectForm(projectDefaults); setEditingProjectId(null); }}>Cancel edit</button>}
              </div>
            </form>
            <div className="admin-list" style={{ marginTop: 20 }}>
              {dashboard.projects.map((project) => (
                <div className="admin-item" key={project.id}>
                  <div>
                    <strong>{project.title}</strong>
                    <small>{project.slug} · {project.is_published ? 'Published' : 'Draft'}</small>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn secondary" onClick={() => handleEditProject(project.id)}>Edit</button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="admin-card">
            <h3>Skills</h3>
            <form className="admin-form" onSubmit={handleSkillSubmit}>
              <div className="admin-row">
                <div className="admin-field"><label>Name</label><input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} /></div>
                <div className="admin-field"><label>Category</label><input value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} /></div>
              </div>
              <div className="admin-row">
                <div className="admin-field"><label>Level</label><input type="number" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} /></div>
                <div className="admin-field"><label>Published</label><select value={skillForm.is_published ? 'true' : 'false'} onChange={(e) => setSkillForm({ ...skillForm, is_published: e.target.value === 'true' })}><option value="true">Published</option><option value="false">Draft</option></select></div>
              </div>
              <div className="admin-field"><label>Description</label><textarea value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} /></div>
              <div className="admin-actions">
                <button type="submit" className="admin-btn primary">{editingSkillId ? 'Save skill' : 'Add skill'}</button>
                {editingSkillId && <button type="button" className="admin-btn secondary" onClick={() => { setSkillForm(skillDefaults); setEditingSkillId(null); }}>Cancel edit</button>}
              </div>
            </form>
            <div className="admin-list" style={{ marginTop: 20 }}>
              {dashboard.skills.map((skill) => (
                <div className="admin-item" key={skill.id}>
                  <div>
                    <strong>{skill.name}</strong>
                    <small>{skill.category} · {skill.level}% · {skill.is_published ? 'Published' : 'Draft'}</small>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn secondary" onClick={() => handleEditSkill(skill)}>Edit</button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="admin-card">
            <h3>Certifications</h3>
            <form className="admin-form" onSubmit={handleCertificationSubmit}>
              <div className="admin-row">
                <div className="admin-field"><label>Title</label><input value={certificationForm.title} onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })} /></div>
                <div className="admin-field"><label>Organization</label><input value={certificationForm.organization} onChange={(e) => setCertificationForm({ ...certificationForm, organization: e.target.value })} /></div>
              </div>
              <div className="admin-row">
                <div className="admin-field"><label>Issued date</label><input value={certificationForm.issued_date} onChange={(e) => setCertificationForm({ ...certificationForm, issued_date: e.target.value })} /></div>
                <div className="admin-field"><label>Published</label><select value={certificationForm.is_published ? 'true' : 'false'} onChange={(e) => setCertificationForm({ ...certificationForm, is_published: e.target.value === 'true' })}><option value="true">Published</option><option value="false">Draft</option></select></div>
              </div>
              <div className="admin-field"><label>Description</label><textarea value={certificationForm.description} onChange={(e) => setCertificationForm({ ...certificationForm, description: e.target.value })} /></div>
              <div className="admin-actions">
                <button type="submit" className="admin-btn primary">{editingCertificationId ? 'Save certification' : 'Add certification'}</button>
                {editingCertificationId && <button type="button" className="admin-btn secondary" onClick={() => { setCertificationForm(certificationDefaults); setEditingCertificationId(null); }}>Cancel edit</button>}
              </div>
            </form>
            <div className="admin-list" style={{ marginTop: 20 }}>
              {dashboard.certifications.map((certification) => (
                <div className="admin-item" key={certification.id}>
                  <div>
                    <strong>{certification.title}</strong>
                    <small>{certification.organization} · {certification.issued_date || 'No date'} · {certification.is_published ? 'Published' : 'Draft'}</small>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn secondary" onClick={() => handleEditCertification(certification)}>Edit</button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDeleteCertification(certification.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="admin-card">
            <h3>3D Education Timeline</h3>
            <form className="admin-form" onSubmit={handleEducationSubmit}>
              <div className="admin-field"><label>Qualification / degree</label><input required value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} /></div>
              <div className="admin-row">
                <div className="admin-field"><label>Institution</label><input value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} /></div>
                <div className="admin-field"><label>Location</label><input value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} /></div>
              </div>
              <div className="admin-row">
                <div className="admin-field"><label>Start year</label><input value={educationForm.start_date} onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })} /></div>
                <div className="admin-field"><label>End year / status</label><input value={educationForm.end_date} onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })} placeholder="e.g. 2025 or Present" /></div>
              </div>
              <div className="admin-field"><label>Timeline details (one per line; shown on the card back)</label><textarea value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} /></div>
              <div className="admin-field"><label>Published</label><select value={educationForm.is_published ? 'true' : 'false'} onChange={(e) => setEducationForm({ ...educationForm, is_published: e.target.value === 'true' })}><option value="true">Published</option><option value="false">Draft</option></select></div>
              <div className="admin-actions">
                <button type="submit" className="admin-btn primary">{editingEducationId ? 'Save timeline item' : 'Add timeline item'}</button>
                {editingEducationId && <button type="button" className="admin-btn secondary" onClick={() => { setEducationForm(educationDefaults); setEditingEducationId(null); }}>Cancel edit</button>}
              </div>
            </form>
            <div className="admin-list" style={{ marginTop: 20 }}>
              {dashboard.education.map((item) => (
                <div className="admin-item" key={item.id}>
                  <div>
                    <strong>{item.degree}</strong>
                    <small>{item.institution} · {[item.start_date, item.end_date].filter(Boolean).join(' - ') || 'No dates'} · {item.is_published ? 'Published' : 'Draft'}</small>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn secondary" onClick={() => handleEditEducation(item)}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-card">
            <h3>Site Settings</h3>
            <form className="admin-form" onSubmit={handleSettingsSubmit}>
              <div className="admin-row">
                <div className="admin-field"><label>Site name</label><input value={settingsForm.site_name} onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })} /></div>
                <div className="admin-field"><label>Location</label><input value={settingsForm.location} onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })} /></div>
              </div>
              <div className="admin-row">
                <div className="admin-field"><label>Skills photo degree label</label><input required maxLength={255} value={settingsForm.skills_degree_label} onChange={(e) => setSettingsForm({ ...settingsForm, skills_degree_label: e.target.value })} /></div>
                <div className="admin-field"><label>About Me degree title</label><input required maxLength={255} value={settingsForm.about_degree_title} onChange={(e) => setSettingsForm({ ...settingsForm, about_degree_title: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Meta title</label><input value={settingsForm.meta_title} onChange={(e) => setSettingsForm({ ...settingsForm, meta_title: e.target.value })} /></div>
              <div className="admin-field"><label>Meta description</label><textarea value={settingsForm.meta_description} onChange={(e) => setSettingsForm({ ...settingsForm, meta_description: e.target.value })} /></div>
              <div className="admin-row">
                <div className="admin-field"><label>Contact email</label><input value={settingsForm.contact_email} onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })} /></div>
                <div className="admin-field"><label>Contact phone</label><input value={settingsForm.contact_phone} onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })} /></div>
              </div>
              <div className="admin-row">
                <div className="admin-field"><label>Primary color</label><input type="color" value={settingsForm.primary_color} onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })} /></div>
                <div className="admin-field"><label>Secondary color</label><input type="color" value={settingsForm.secondary_color} onChange={(e) => setSettingsForm({ ...settingsForm, secondary_color: e.target.value })} /></div>
              </div>
              <button type="submit" className="admin-btn primary">Save settings</button>
            </form>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="admin-card">
            <h3>Messages</h3>
            <div className="admin-list">
              {dashboard.messages.map((message) => (
                <div className="admin-item" key={message.id}>
                  <div>
                    <strong>{message.name}</strong>
                    <small>{message.email} · {message.subject}</small>
                    <div style={{ marginTop: 8 }}>{message.message}</div>
                  </div>
                  <div>
                    <button className="admin-btn secondary" onClick={() => handleMarkRead(message.id)}>{message.is_read ? 'Read' : 'Mark read'}</button>
                    <button className="admin-btn danger" style={{ marginLeft: 8 }} onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </main>
        </div>
      </div>
    </div>
  );
}
