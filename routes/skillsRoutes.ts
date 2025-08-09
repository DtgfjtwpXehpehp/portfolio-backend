import express from 'express';
import db from '../config/database';

const router = express.Router();

router.get('/skills', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, category, icon FROM skills ORDER BY FIELD(category, \'frontend\', \'backend\', \'database\', \'devops\', \'uiux\'), name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching skills' });
    }
});

export default router;