const express = require("express");
const router = express.Router();
require("dotenv").config();

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post("/summary", async (req, res) => {
  try {
    const { customer } = req.body;

    const prompt = `Create a short summary about this customer for CRM usage:\n\n
    Name: ${customer.name}\n
    Email: ${customer.email}\n
    Phone: ${customer.phone}\n
    Total Spend: ${customer.totalSpend}\n
    Visit Count: ${customer.visitCount}\n
    Last Purchase: ${customer.lastPurchase}\n
    Segments: ${customer.segmentTags?.join(", ") || "None"}\n\n
    Summary:`;

    const response = await cohere.generate({
      model: "command",
      prompt: prompt,
      maxTokens: 100,
      temperature: 0.7,
    });

    const summary = response.generations[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error("❌ Cohere summary error:", error);
    res.status(500).json({ message: "Failed to generate summary", details: error.message });
  }
});

module.exports = router;
