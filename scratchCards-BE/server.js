import express from "express";
import { connectToDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import scratchCardRoutes from "./routes/scratchCard.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/scratchcards", scratchCardRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    connectToDB();
    console.log("Server is running on port 3000...");
  });
}
