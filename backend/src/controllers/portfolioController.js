import { query } from '../config/database.js';
import { fetchProjects, fetchPublicProjectBySlug } from './projectController.js';
import { defaultEducation } from './educationController.js';

const fallbackPortfolio = {
  personalInfo: {
    full_name: 'Sulaiman Lebbe Muhammad Asri',
    headline: 'Full-Stack Web Developer',
    bio: 'I am a highly motivated HND IT student with a strong foundation in software engineering, full-stack web development, mobile application development, and desktop application development.',
    email: 'mohammadasri553@gmail.com',
    phone: '+94 76 896 7587',
    location: 'Anuradhapura, Sri Lanka',
    linkedin: 'https://www.linkedin.com/in/muhammad-asri-37a192329',
    github: 'https://github.com/SLM-Asri',
    resume_url: '/assets/documents/Asri_Resume.pdf',
    hero_video_url: '/assets/videos/Say_this_Hello_welcome_to_my.mp4',
    avatar_url: '/assets/images/logo.jpg'
  },
  skills: [],
  certifications: [],
  education: defaultEducation.map((item) => ({ ...item, is_published: 1 })),
  settings: {
    site_name: 'Asri Dev',
    meta_title: 'Sulaiman Lebbe Muhammad Asri | Full-Stack & Software Engineering Student',
    meta_description: 'Professional Portfolio of Sulaiman Lebbe Muhammad Asri - Full-Stack Web Developer, Mobile & Desktop App Developer, and AI/Cybersecurity Enthusiast.',
    skills_degree_label: 'HND IT',
    about_degree_title: 'HND Information Technology'
  },
  projects: []
};

export async function getPortfolioOverview(req, res) {
  try {
    const [personalInfoRows, skillsRows, certificationsRows, educationRows, settingsRows, projectsRows] = await Promise.all([
      query('SELECT * FROM personal_info WHERE is_published = 1 ORDER BY id DESC LIMIT 1'),
      query('SELECT * FROM skills WHERE is_published = 1 ORDER BY id ASC'),
      query('SELECT * FROM certifications WHERE is_published = 1 ORDER BY id DESC'),
      query('SELECT * FROM education WHERE is_published = 1 ORDER BY id DESC'),
      query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1'),
      query('SELECT * FROM projects WHERE is_published = 1 ORDER BY id DESC')
    ]);

    const portfolio = {
      personalInfo: personalInfoRows[0] || fallbackPortfolio.personalInfo,
      skills: skillsRows.length ? skillsRows : fallbackPortfolio.skills,
      certifications: certificationsRows.length ? certificationsRows : fallbackPortfolio.certifications,
      education: educationRows,
      settings: settingsRows[0] || fallbackPortfolio.settings,
      projects: projectsRows.length ? projectsRows : fallbackPortfolio.projects
    };

    return res.json(portfolio);
  } catch (error) {
    console.warn('Portfolio fallback used:', error.message);
    return res.json(fallbackPortfolio);
  }
}

export async function getPortfolioProjects(req, res) {
  try {
    return res.json(await fetchProjects({ publishedOnly: true }));
  } catch (error) {
    console.error('Unable to load public projects:', error);
    return res.status(503).json({ message: 'Projects are temporarily unavailable.' });
  }
}

export async function getPortfolioProjectBySlug(req, res) {
  try {
    const project = await fetchPublicProjectBySlug(req.params.slug);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json(project);
  } catch (error) {
    console.error('Unable to load public project:', error);
    return res.status(503).json({ message: 'Project details are temporarily unavailable.' });
  }
}

export async function getPortfolioSkills(req, res) {
  try {
    const rows = await query('SELECT * FROM skills WHERE is_published = 1 ORDER BY id ASC');
    return res.json(rows.length ? rows : []);
  } catch (error) {
    console.warn('Skills fallback used:', error.message);
    return res.json([]);
  }
}

export async function getPortfolioCertifications(req, res) {
  try {
    const rows = await query('SELECT * FROM certifications WHERE is_published = 1 ORDER BY id DESC');
    return res.json(rows.length ? rows : []);
  } catch (error) {
    console.warn('Certification fallback used:', error.message);
    return res.json([]);
  }
}

export async function getPortfolioSettings(req, res) {
  try {
    const rows = await query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    return res.json(rows[0] || fallbackPortfolio.settings);
  } catch (error) {
    console.warn('Settings fallback used:', error.message);
    return res.json(fallbackPortfolio.settings);
  }
}

export async function submitContactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const result = await query(
      'INSERT INTO contact_messages (name, email, subject, message, status, is_read) VALUES (?, ?, ?, ?, ?, 0)',
      [String(name).trim(), String(email).trim(), subject || 'Portfolio inquiry', String(message).trim(), 'new']
    );

    return res.status(201).json({
      message: 'Message sent successfully.',
      id: result.insertId
    });
  } catch (error) {
    console.warn('Contact fallback used:', error.message);
    return res.status(202).json({
      message: 'Message received. Database sync is currently offline, but the message was accepted.'
    });
  }
}
