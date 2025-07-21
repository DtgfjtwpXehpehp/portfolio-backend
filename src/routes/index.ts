import express from 'express';
import projectRoutes from './projectRoutes';
import aboutRoutes from './aboutRoutes';
import contactRoutes from './contactRoutes';
import resumeRoutes from './resumeRoutes';

const router = express.Router();

router.use('/projects', projectRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/resume', resumeRoutes);

export default router;
