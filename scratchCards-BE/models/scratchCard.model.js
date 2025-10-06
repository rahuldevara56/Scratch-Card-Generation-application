import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const scratchCardSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  discountAmount: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isScratched: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true } // Automatically adds createdAt and updatedAt fields

)

const ScratchCard = mongoose.model("ScratchCard", scratchCardSchema);
export default ScratchCard;