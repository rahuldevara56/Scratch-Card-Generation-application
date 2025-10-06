import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  const user = req.body // user will send this data

  if (!user.firstName || !user.lastName || !user.userEmail) {
    return res.status(400).json({ success: false, message: "firstName, lastName and userEmail are required fields" });
  };

  const newUser = new User(user);
  try {
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// get user by id
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// update user by id
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ id: userId }, updateData, { new: true })
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message });

  }
});

// delete user by id
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findOneAndDelete({ id: userId });
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });

  }
});

export default router;