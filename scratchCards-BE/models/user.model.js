import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  firstName: {
    type: String,
    required: true,
    match: [/^[a-zA-Z]+$/, 'First name must contain only letters']
  },
  lastName: {
    type: String,
    required: true,
    match: [/^[a-zA-Z]+$/, 'Last name must contain only letters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);

export default User;