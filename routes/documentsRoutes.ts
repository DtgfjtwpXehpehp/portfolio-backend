import express from 'express';
import db from '../config/database';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM documents');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


export default router;