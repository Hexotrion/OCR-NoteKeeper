import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/userRouter.js';
import noteRouter from './routes/nodeRouter.js';
import ocrRouter from './routes/ocrRoutes.js'; // Import the OCR router

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Routes
app.use('/user', userRouter);
app.use('/api/notes', noteRouter);
app.use('/api/ocr', ocrRouter); // Use the OCR routes

// Connection to MongoDB
const { MONGO_URI, PORT, NODE_ENV } = process.env;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Serve static assets if in production
if (NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, 'client', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Listen server
const port = PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
