import express from "express";
import ScratchCard from "../models/scratchCard.model.js";

const router = express.Router();

// generate scratch cards
router.post('/generate', async (req, res) => {
  const rawCount = req.body.numberOfScratchCards;
  const numberOfScratchCards = parseInt(rawCount, 10);

  if (!Number.isInteger(numberOfScratchCards) || numberOfScratchCards <= 0) {
    return res.status(400).json({
      success: false,
      message: "numberOfScratchCards is required and should be a positive integer"
    });
  }

  try {
    const activeCards = await ScratchCard.find({ isScratched: false });
    if (activeCards.length >= numberOfScratchCards) {
      return res.status(400).json({
        success: false,
        message: `You already have ${activeCards.length} active scratch cards. Please use them before generating new ones.`
      });
    }

    let cards = [];
    for (let i = 0; i < numberOfScratchCards; i++) {
      cards.push({
        // Random discount between 1 and 1000
        discountAmount: Math.floor(Math.random() * 1001),
        // Expiry date set to 5 days from now
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      });
    }

    const createdCards = await ScratchCard.insertMany(cards);
    res.status(201).json({ success: true, data: createdCards });
  } catch (error) {
    console.error('Error generating scratch cards:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// get all unused scratch cards
router.get('/unused', async (req, res) => {
  try {
    const unusedCards = await ScratchCard.find({ isScratched: false, isActive: true });
    res.status(200).json({ success: true, data: unusedCards });
  } catch (error) {
    console.error('Error fetching unused scratch cards:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;