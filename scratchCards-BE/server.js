import express from 'express';
import { connectToDB } from './config/db.js';

console.log('MongoDB URI:', process.env.MONGO_URI); // Log the MONGO_URI to verify it's loaded correctly

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World! welcome to Scratch Cards Backend');
});

app.listen(3000, () => {
  connectToDB(); // Connect to the database when the server starts
  console.log('Server is running on port 3000...');
});
