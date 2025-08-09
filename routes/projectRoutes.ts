import express from 'express';
import db from '../config/database';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Get a single project
router.get('/:id', async (req, res) => {
    try {
        const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (Array.isArray(project) && project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project' });
    }
});

export default router;
