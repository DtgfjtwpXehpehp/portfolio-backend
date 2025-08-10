import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get contact information
router.get('/', async (req, res) => {
  try {
    const [contact] = await db.query('SELECT * FROM contact LIMIT 1');
    res.json(contact[0] || {});
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({ error: 'Error fetching contact information' });
  }
});

export default router;
