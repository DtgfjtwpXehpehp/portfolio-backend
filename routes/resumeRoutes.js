import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get resume information
router.get('/', async (req, res) => {
  try {
    const [resume] = await db.query('SELECT * FROM resume ORDER BY order_index ASC');
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume information:', error);
    res.status(500).json({ error: 'Error fetching resume information' });
  }
});

export default router;
