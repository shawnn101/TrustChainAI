const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const modelPath = path.resolve(__dirname, '../../model/receipt_auth_model/model.json');
let model;

// Load the model at startup
(async () => {
  try {
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('✅ TFJS model loaded');
  } catch (error) {
    console.error('❌ Failed to load model:', error);
  }
})();

// Dummy feature extraction
function extractFeatures(text) {
  const keywords = ['auditor', 'revenue', 'expenses', 'conclusion', 'report'];
  const cleaned = text.toLowerCase();
  const features = keywords.map(word => (cleaned.includes(word) ? 1 : 0));
  const lengthScore = Math.min(1, cleaned.length / 1000);
  return [...features, lengthScore]; // Must match model's input shape
}

// POST /api/analyze
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!model) return res.status(500).json({ error: 'Model not loaded' });

    const filePath = req.file.path;
    const text = fs.readFileSync(filePath, 'utf-8');

    const input = extractFeatures(text);
    const inputTensor = tf.tensor2d([input]);

    const prediction = model.predict(inputTensor);
    const result = await prediction.data();
    const label = result[0] > 0.5 ? 'REAL' : 'FAKE';

    fs.unlinkSync(filePath); // Clean up
    res.json({ label, confidence: result[0] });
  } catch (err) {
    console.error('❌ Analyze Error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;
