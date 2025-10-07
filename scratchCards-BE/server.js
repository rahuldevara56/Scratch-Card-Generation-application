import express from 'express';
import { connectToDB } from './config/db.js';
import userRoutes from './routes/user.route.js';
import scratchCardRoutes from './routes/scratchCard.route.js';

const app = express()

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/users', userRoutes);

app.use('/api/scratchcards', scratchCardRoutes);

app.listen(3000, () => {
  connectToDB(); // Connect to the database when the server starts
  console.log('Server is running on port 3000...');
});
