"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
// Debug endpoint to test database connection
router.get('/debug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield database_1.default.from('about').select('count', { count: 'exact', head: true });
        res.json({
            connected: !error,
            error: (error === null || error === void 0 ? void 0 : error.message) || null,
            url: process.env.VITE_SUPABASE_URL ? 'set' : 'missing'
        });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}));
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
// Get about information
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield database_1.default
            .from('about')
            .select('*')
            .limit(1)
            .maybeSingle();
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        res.json(data || {});
    }
    catch (error) {
        console.error('Error fetching about:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error fetching about information: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Error fetching about information' });
        }
    }
}));
// Update about information with image upload
router.put('/', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, title, content, skills } = req.body;
        let imageUrl = undefined;
        // If there's a file, upload it to Cloudinary
        if (req.file) {
            // Convert buffer to base64
            const base64Image = Buffer.from(req.file.buffer).toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
            // Upload to Cloudinary
            const result = yield cloudinary_1.default.uploader.upload(dataUri, {
                folder: 'portfolio/about',
                resource_type: 'auto'
            });
            imageUrl = result.secure_url;
        }
        // Build update object
        const updateData = {};
        if (name)
            updateData.name = name;
        if (title)
            updateData.title = title;
        if (content)
            updateData.content = content;
        if (skills)
            updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        if (imageUrl)
            updateData.image_url = imageUrl;
        // Get existing record
        const { data: existing, error: fetchError } = yield database_1.default
            .from('about')
            .select('id')
            .limit(1)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        if (existing) {
            // Update existing record
            const { data, error } = yield database_1.default
                .from('about')
                .update(updateData)
                .eq('id', existing.id)
                .select()
                .maybeSingle();
            if (error)
                throw error;
            res.json(data);
        }
        else {
            // Create new record
            const { data, error } = yield database_1.default
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
            if (error)
                throw error;
            res.json(data);
        }
    }
    catch (error) {
        console.error('Error updating about information:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error updating about information: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Error updating about information' });
        }
    }
}));
// Create initial about record if it doesn't exist
router.post('/init', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if about record exists
        const { data: existing, error: fetchError } = yield database_1.default
            .from('about')
            .select('id')
            .limit(1)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        if (existing) {
            return res.status(400).json({ error: 'About record already exists' });
        }
        // Create initial record
        const { data, error } = yield database_1.default
            .from('about')
            .insert({
            name: 'Web Developer',
            title: 'Full Stack Developer',
            content: 'Welcome to my portfolio!',
            skills: ['JavaScript', 'TypeScript', 'Node.js', 'Vue.js']
        })
            .select()
            .maybeSingle();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error creating initial about record:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Error creating initial about record: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Error creating initial about record' });
        }
    }
}));
exports.default = router;
