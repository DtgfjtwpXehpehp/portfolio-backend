import express from 'express';
import supabase from '../config/database';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Get a single project
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', req.params.id)
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project' });
    }
});

export default router;
