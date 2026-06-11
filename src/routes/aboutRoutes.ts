import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import supabase from '../config/database';

const router = express.Router();

// Debug endpoint to test database connection
router.get('/debug', async (req, res) => {
    try {
        const { data, error } = await supabase.from('about').select('count', { count: 'exact', head: true });
        res.json({
            connected: !error,
            error: error?.message || null,
            url: process.env.VITE_SUPABASE_URL ? 'set' : 'missing'
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Get about information
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('about')
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        res.json(data || {});
    } catch (error) {
        console.error('Error fetching about:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error fetching about information: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Error fetching about information' });
        }
    }
});

// Update about information with image upload
router.put('/', upload.single('image'), async (req, res) => {
    try {
        const { name, title, content, skills } = req.body;
        let imageUrl = undefined;

        // If there's a file, upload it to Cloudinary
        if (req.file) {
            // Convert buffer to base64
            const base64Image = Buffer.from(req.file.buffer).toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataUri, {
                folder: 'portfolio/about',
                resource_type: 'auto'
            });
            imageUrl = result.secure_url;
        }

        // Build update object
        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (skills) updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        if (imageUrl) updateData.image_url = imageUrl;

        // Get existing record
        const { data: existing, error: fetchError } = await supabase
            .from('about')
            .select('id')
            .limit(1)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
            // Update existing record
            const { data, error } = await supabase
                .from('about')
                .update(updateData)
                .eq('id', existing.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            res.json(data);
        } else {
            // Create new record
            const { data, error } = await supabase
                .from('about')
                .insert({
                    name: name || 'Your Name',
                    title: title || 'Full Stack Developer',
                    content: content || 'Welcome to my portfolio!',
                    skills: skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [],
                    image_url: imageUrl
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            res.json(data);
        }
    } catch (error) {
        console.error('Error updating about information:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error updating about information: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Error updating about information' });
        }
    }
});

// Create initial about record if it doesn't exist
router.post('/init', async (req, res) => {
    try {
        // Check if about record exists
        const { data: existing, error: fetchError } = await supabase
            .from('about')
            .select('id')
            .limit(1)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (existing) {
            return res.status(400).json({ error: 'About record already exists' });
        }

        // Create initial record
        const { data, error } = await supabase
            .from('about')
            .insert({
                name: 'Web Developer',
                title: 'Full Stack Developer',
                content: 'Welcome to my portfolio!',
                skills: ['JavaScript', 'TypeScript', 'Node.js', 'Vue.js']
            })
            .select()
            .maybeSingle();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error creating initial about record:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error creating initial about record: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Error creating initial about record' });
        }
    }
});

export default router;
