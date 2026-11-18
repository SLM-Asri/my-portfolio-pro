import express from 'express';
import {
  getPortfolioOverview,
  getPortfolioProjects,
  getPortfolioProjectBySlug,
  getPortfolioSkills,
  getPortfolioCertifications,
  getPortfolioSettings,
  submitContactMessage
} from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/portfolio', getPortfolioOverview);
router.get('/portfolio/projects', getPortfolioProjects);
router.get('/portfolio/projects/:slug', getPortfolioProjectBySlug);
router.get('/portfolio/skills', getPortfolioSkills);
router.get('/portfolio/certifications', getPortfolioCertifications);
router.get('/portfolio/settings', getPortfolioSettings);
router.post('/contact', submitContactMessage);

export default router;
