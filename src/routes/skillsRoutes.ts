import express from 'express';
import supabase from '../config/database';

const router = express.Router();

router.get('/skills', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('id, name, category, icon')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching skills' });
    }
});

export default router;
