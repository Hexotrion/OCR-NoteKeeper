// routes/ocrRouter.js
import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import OcrResult from '../models/OcrResult.js'; // Define this model in models/OcrResult.js
import auth from '../middleware/auth.js'; // Your authentication middleware
import fs from 'fs';
const router = express.Router();

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



// Routes
router.post('/upload', [auth,upload.single('image')], async (req, res) => {
  const imagePath = req.file.path;
  console.log(imagePath);

  const pythonProcess = spawn('python', ['scripts/ocr.py', imagePath]);

  let ocrText = '';

  pythonProcess.stdout.on('data', (data) => {
    ocrText += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    if (!res.headersSent) {
      //console.log("error while processing image");
      res.status(500).json({ error: 'Failed to process the image' });
    }
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process the image' });
      }
      return;
    }
     // Delete the image file after OCR processing
     fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }else{
            console.log('image deleted successfully');
        }
      });

    try {
      const newOcrResult = new OcrResult({ imagePath, text: ocrText });
      const result = await newOcrResult.save();
      if (!res.headersSent) {
        res.json(result);
      }
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to save OCR result' });
      }
    }
  });
});

export default router;
