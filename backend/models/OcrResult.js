// Define a model for storing OCR results
// models/OcrResult.js
import mongoose from 'mongoose';

const ocrResultSchema = new mongoose.Schema({
  imagePath: String,
  text: String
});

const OcrResult = mongoose.model('OcrResult', ocrResultSchema);
export default OcrResult;