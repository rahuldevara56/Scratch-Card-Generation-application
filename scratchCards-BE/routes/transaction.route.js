import express from 'express';
import Transaction from '../models/transaction.model.js';
import ScratchCard from '../models/scratchCard.model.js';
import User from '../models/user.model.js';

const router = express.Router();

// create a transaction
router.post('/', async (req, res) => {
  try {
    const { userId, transactionAmount } = req.body; // Changed from username to fullName
    if (!userId || transactionAmount == null) {
      return res.status(400).json({
        success: false,
        message: 'userId and transactionAmount are required',
      });
    }

    const card = await ScratchCard.findOne({
      isScratched: false,
      isActive: true,
    });
    if (!card) {
      return res
        .status(400)
        .json({ success: false, message: 'No unused scratch card available' });
    }
    if (card.expiryDate < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: 'Scratch card has expired' });
    }

    card.isScratched = true;
    await card.save();

    const created = await Transaction.create({
      dateOfTransaction: new Date(),
      transactionAmount,
      userId: userId,
      scratchCardId: card.id,
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Combined GET route for all transactions with optional filters
router.get('/', async (req, res) => {
  try {
    const { dateOfTransaction, userId, transactionAmount } = req.query;
    let filter = {};

    if (dateOfTransaction) {
      const date = new Date(dateOfTransaction);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      filter.dateOfTransaction = { $gte: date, $lt: nextDate };
    }
    if (userId) {
      filter.userId = userId;
    }
    if (transactionAmount) {
      filter.transactionAmount = Number(transactionAmount);
    }

    const transactions = await Transaction.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $addFields: {
          fullName: {
            $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'],
          },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
