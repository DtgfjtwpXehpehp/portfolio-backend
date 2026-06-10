import express from 'express';
import supabase from '../config/database';

const router = express.Router();

// Get contact information
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contact')
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching contact information' });
    }
});

export default router;
