import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import db from '../config/database';
import { About } from '../types/about';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

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
        const [rows] = await db.query<(About & RowDataPacket)[]>('SELECT * FROM about LIMIT 1');
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching about information' });
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

        // Update the database
        const updateFields = [];
        const updateValues = [];

        if (name) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (title) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (content) {
            updateFields.push('content = ?');
            updateValues.push(content);
        }
        if (skills) {
            updateFields.push('skills = ?');
            updateValues.push(JSON.stringify(skills));
        }
        if (imageUrl) {
            updateFields.push('image_url = ?');
            updateValues.push(imageUrl);
        }

        if (updateFields.length > 0) {
            const query = `UPDATE about SET ${updateFields.join(', ')} WHERE id = 1`;
            await db.query(query, updateValues);
        }

        // Check if the update was successful
        if (updateFields.length > 0) {
            // Fetch and return updated data
            const [rows] = await db.query<(About & RowDataPacket)[]>('SELECT * FROM about WHERE id = 1');
            if (!rows || rows.length === 0) {
                return res.status(404).json({ error: 'About information not found' });
            }
            res.json(rows[0]);
        } else {
            // No fields to update
            const [rows] = await db.query<(About & RowDataPacket)[]>('SELECT * FROM about WHERE id = 1');
            res.json(rows[0] || {});
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
        const [existing] = await db.query<(About & RowDataPacket)[]>('SELECT id FROM about LIMIT 1');
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'About record already exists' });
        }

        // Create initial record
        const initialData = {
            name: 'Web Developer',
            title: 'Full Stack Developer',
            content: 'Welcome to my portfolio!',
            skills: JSON.stringify(['JavaScript', 'TypeScript', 'Node.js', 'Vue.js']),
        };

        await db.query<ResultSetHeader>(
            'INSERT INTO about (name, title, content, skills) VALUES (?, ?, ?, ?)',
            [initialData.name, initialData.title, initialData.content, initialData.skills]
        );

        const [rows] = await db.query<(About & RowDataPacket)[]>('SELECT * FROM about WHERE id = 1');
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating initial about record:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error creating initial about record: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Error creating initial about record' });
        }
    }
});

// Get skills for the about section
router.get('/skills', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, category, icon FROM skills ORDER BY FIELD(category, \'frontend\', \'backend\', \'database\', \'devops\', \'uiux\'), name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching skills' });
    }
});

export default router;
