import express from 'express';
import supabase from '../config/database';

const router = express.Router();

// Get resume information
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resume')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching resume information' });
    }
});

export default router;
