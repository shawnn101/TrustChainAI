const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const sharp = require("sharp");
const tf = require("@tensorflow/tfjs-node");
const cosineSimilarity = require("compute-cosine-similarity");
const { loadModel, predictFraud } = require("./modelService");
const { parseGeminiText } = require("./geminiService");

let model;

// Load TensorFlow model on startup
(async () => {
  model = await loadModel();
})();

// Multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/analyze-receipt
router.post("/analyze-receipt", upload.single("receipt"), async (req, res) => {
  try {
    const imageBuffer = await sharp(req.file.buffer).resize(512).toBuffer();

    // 1. Gemini OCR & NLP
    const ocrText = await parseGeminiText(imageBuffer);

    // 2. Fraud prediction (image features + text logic)
    const fraudScore = await predictFraud(model, imageBuffer);

    // 3. Duplicate detection (simplified cosine similarity demo)
    const isDuplicate = await checkForDuplicate(ocrText);

    res.json({
      extractedText: ocrText,
      fraudScore,
      isDuplicate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Receipt analysis failed." });
  }
});

async function checkForDuplicate(newText) {
  const existingReceipts = await getStoredReceiptTexts(); // Assume from MongoDB
  const newVector = textToVector(newText);

  for (const existingText of existingReceipts) {
    const existingVector = textToVector(existingText);
    if (cosineSimilarity(newVector, existingVector) > 0.95) return true;
  }
  return false;
}

function textToVector(text) {
  const tokens = text.toLowerCase().split(/\s+/);
  const wordFreq = {};
  tokens.forEach((t) => (wordFreq[t] = (wordFreq[t] || 0) + 1));
  return Object.values(wordFreq);
}

async function getStoredReceiptTexts() {
  // Placeholder - retrieve from MongoDB
  return ["Amazon Purchase 2024 $103.45", "Uber 2023 ride $21.88"];
}

module.exports = router;


// File: server/ai/geminiService.js

const axios = require("axios");
const fs = require("fs");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

async function parseGeminiText(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString("base64");

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
            {
              text: "Extract and return merchant, total amount, date, and item names from this receipt image."
            }
          ],
        },
      ],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return output || "No text extracted.";
  } catch (error) {
    console.error("Gemini API OCR error:", error.response?.data || error.message);
    return "[ERROR] Gemini OCR failed.";
  }
}

module.exports = {
  parseGeminiText,
};


