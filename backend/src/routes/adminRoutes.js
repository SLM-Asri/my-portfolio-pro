import express from 'express';
import { query } from '../config/database.js';
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '../controllers/authController.js';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { listSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { listCertifications, createCertification, updateCertification, deleteCertification } from '../controllers/certificationController.js';
import { listEducation, createEducation, updateEducation, ensureDefaultEducation } from '../controllers/educationController.js';
import { getSettings, upsertSettings } from '../controllers/settingsController.js';
import { listMessages, markMessageAsRead, deleteMessage } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' }
});

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.use(requireAuth);

router.get('/me', getCurrentAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    await ensureDefaultEducation();
    const [personalInfo, projects, skills, certifications, education, settings, messages] = await Promise.all([
      query('SELECT * FROM personal_info ORDER BY id DESC LIMIT 1'),
      query('SELECT * FROM projects ORDER BY id DESC'),
      query('SELECT * FROM skills ORDER BY id DESC'),
      query('SELECT * FROM certifications ORDER BY id DESC'),
      query('SELECT * FROM education ORDER BY id DESC'),
      query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1'),
      query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    ]);

    res.json({
      personalInfo: personalInfo[0] || null,
      projects,
      skills,
      certifications,
      education,
      settings: settings[0] || null,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load admin dashboard data.', error: error.message });
  }
});

router.get('/personal-info', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM personal_info ORDER BY id DESC LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load personal info.', error: error.message });
  }
});

router.post('/personal-info', async (req, res) => {
  try {
    const { full_name, headline, bio, email, phone, location, linkedin, github, resume_url, hero_video_url, avatar_url, is_published } = req.body || {};
    if (!full_name) {
      return res.status(400).json({ message: 'Full name is required.' });
    }

    const result = await query(
      'INSERT INTO personal_info (full_name, headline, bio, email, phone, location, linkedin, github, resume_url, hero_video_url, avatar_url, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [full_name, headline || '', bio || '', email || '', phone || '', location || '', linkedin || '', github || '', resume_url || '', hero_video_url || '', avatar_url || '', is_published === false ? 0 : 1]
    );

    return res.status(201).json({ id: result.insertId, message: 'Personal info created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create personal info.', error: error.message });
  }
});

router.put('/personal-info/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, headline, bio, email, phone, location, linkedin, github, resume_url, hero_video_url, avatar_url, is_published } = req.body || {};
    await query(
      'UPDATE personal_info SET full_name = ?, headline = ?, bio = ?, email = ?, phone = ?, location = ?, linkedin = ?, github = ?, resume_url = ?, hero_video_url = ?, avatar_url = ?, is_published = ? WHERE id = ?',
      [full_name || '', headline || '', bio || '', email || '', phone || '', location || '', linkedin || '', github || '', resume_url || '', hero_video_url || '', avatar_url || '', is_published === false ? 0 : 1, id]
    );
    return res.json({ message: 'Personal info updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update personal info.', error: error.message });
  }
});

router.get('/projects', listProjects);
router.get('/projects/:id', getProject);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.get('/skills', listSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

router.get('/certifications', listCertifications);
router.post('/certifications', createCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

router.get('/education', listEducation);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);

router.get('/settings', getSettings);
router.post('/settings', upsertSettings);
router.put('/settings/:id', upsertSettings);

router.get('/messages', listMessages);
router.patch('/messages/:id/read', markMessageAsRead);
router.delete('/messages/:id', deleteMessage);

export default router;
