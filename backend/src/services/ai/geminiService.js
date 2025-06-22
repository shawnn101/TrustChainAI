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

