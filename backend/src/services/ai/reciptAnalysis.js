const express = require('express');
const router = express.Router();
const { runGeminiAnalysis } = require('./geminiService');
const { runModelPrediction } = require('./modelService');

router.post('/analyze', async (req, res) => {
  try {
    const { receiptText } = req.body;

    // 1. NLP via Gemini
    const geminiData = await runGeminiAnalysis(receiptText);

    // 2. ML Classification via TensorFlow
    const prediction = await runModelPrediction(geminiData);

    res.json({ success: true, geminiData, prediction });
  } catch (err) {
    console.error("❌ AI Analysis Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

