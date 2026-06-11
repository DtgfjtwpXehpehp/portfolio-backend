import express from 'express';
import projectRoutes from './projectRoutes';
import aboutRoutes from './aboutRoutes';
import contactRoutes from './contactRoutes';
import resumeRoutes from './resumeRoutes';
import documentRoutes from "./documentsRoutes";
import skillsRoutes from "./skillsRoutes";

const router = express.Router();

router.use('/projects', projectRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/resume', resumeRoutes);
router.use("/documents", documentRoutes);
router.use("/skills", skillsRoutes);


export default router;
