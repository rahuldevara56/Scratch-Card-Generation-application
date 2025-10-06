import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  dateOfTransaction: {
    type: Date,
    default: Date.now,
  },
  transactionAmount: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  scratchCardId: {
    type: String,
    required: true,
    ref: 'ScratchCard'
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true } // Automatically adds createdAt and updatedAt fields  
)

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
