import express from 'express';
import { connectToDB } from './config/db.js';
import User from './models/user.model.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Hello World! welcome to Scratch Cards Backend');
});

app.post('/api/users', async (req, res) => {
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

app.listen(3000, () => {
  connectToDB(); // Connect to the database when the server starts
  console.log('Server is running on port 3000...');
});
