import express from 'express';
import projectRoutes from './projectRoutes';
import aboutRoutes from './aboutRoutes';
import contactRoutes from './contactRoutes';
import resumeRoutes from './resumeRoutes';
import documentRoutes from "./documentsRoutes"

const router = express.Router();

router.use('/', projectRoutes);
router.use('/', aboutRoutes);
router.use('/', contactRoutes);
router.use('/', resumeRoutes);
router.use("/", documentRoutes)


export default router;
