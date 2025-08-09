import express from 'express';
import db from '../config/database';

const router = express.Router();

// Get resume information
router.get('/', async (req, res) => {
    try {
        const [resume] = await db.query('SELECT * FROM resume');
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching resume information' });
    }
});

export default router;
