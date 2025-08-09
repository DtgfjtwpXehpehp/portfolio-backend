import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import aboutRoutes from './routes/aboutRoutes';
import contactRoutes from './routes/contactRoutes';
import resumeRoutes from './routes/resumeRoutes';
import documentRoutes from "./routes/documentsRoutes"
import router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL || 'https://sivuyilemtwetwe.co.za'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
// app.use(express.static('public')); // Serve static files from public directory

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/documents', documentRoutes);



// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.listen("/api",()=>{
    console.log("Welcome to the API");
})
