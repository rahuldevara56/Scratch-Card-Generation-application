import express from 'express';
import { connectToDB } from './config/db.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/users', userRoutes);

app.listen(3000, () => {
  connectToDB(); // Connect to the database when the server starts
  console.log('Server is running on port 3000...');
});
