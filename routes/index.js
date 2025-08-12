import express from 'express';
import projectRoutes from './projectRoutes.js';
import aboutRoutes from './aboutRoutes.js';
import contactRoutes from './contactRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import documentRoutes from './documentsRoutes.js';

const router = express.Router();

router.use('/api/projects', projectRoutes);
router.use('/api/about', aboutRoutes);
router.use('/api/contact', contactRoutes);
router.use('/api/resume', resumeRoutes);
router.use('/api/documents', documentRoutes);

export default router;
