import express from 'express';
import projectRoutes from './projectRoutes';
import aboutRoutes from './aboutRoutes';
import contactRoutes from './contactRoutes';
import resumeRoutes from './resumeRoutes';
import documentRoutes from "./documentsRoutes"

const router = express.Router();

router.use('/projects', projectRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/resume', resumeRoutes);
router.use("/documents", documentRoutes)


export default router;
