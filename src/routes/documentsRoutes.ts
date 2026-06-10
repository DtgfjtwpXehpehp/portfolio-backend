import express from 'express';
import supabase from '../config/database';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('id, title, file_url, type, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

export default router;
