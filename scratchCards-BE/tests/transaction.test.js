import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import User from "../models/user.model.js";
import ScratchCard from "../models/scratchCard.model.js";
import Transaction from "../models/transaction.model.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
  await ScratchCard.deleteMany({});
  await Transaction.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("TRANSACTION API TESTS", () => {
  it("should create a transaction with valid user and card", async () => {
    const user = await User.create({
      userEmail: "rahul@gmail.com",
      firstName: "rahul",
      lastName: "kurma",
    });

    const card = await ScratchCard.create({
      Amount: 500,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isScratched: false,
      isActive: true,
    });

    const res = await request(app).post("/api/transactions").send({
      userId: user.id,
      transactionAmount: 250,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("userId", user.id);
    expect(res.body.data).toHaveProperty("scratchCardId", card.id);
  });
  it("should reject transaction creation without userId or amount", async () => {
    const res = await request(app).post("/api/transactions").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject when no unused scratch cards are available", async () => {
    const user = await User.create({
      userEmail: "rahul@gmail.com",
      firstName: "Rahul",
      lastName: "Kurma",
    });

    await ScratchCard.create({
      Amount: 100,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isScratched: true,
      isActive: true,
    });

    const res = await request(app).post("/api/transactions").send({
      userId: user.id,
      transactionAmount: 100,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/No unused scratch card/i);
  });

  it("should reject if scratch card is expired", async () => {
    const user = await User.create({
      userEmail: "expireduser@example.com",
      firstName: "Expired",
      lastName: "User",
    });

    await ScratchCard.create({
      Amount: 200,
      expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isScratched: false,
      isActive: true,
    });

    const res = await request(app).post("/api/transactions").send({
      userId: user.id,
      transactionAmount: 150,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/expired/i);
  });

  it("should fetch all transactions with user full names", async () => {
    const user = await User.create({
      userEmail: "rahul@gmail.com",
      firstName: "Rahul",
      lastName: "Kurma",
    });

    const card = await ScratchCard.create({
      Amount: 400,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isScratched: false,
      isActive: true,
    });

    await Transaction.create({
      transactionAmount: 400,
      userId: user.id,
      scratchCardId: card.id,
    });

    const res = await request(app).get("/api/transactions");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0]).toHaveProperty("fullName", "Rahul Kurma");
  });

  it("should filter transactions by userId", async () => {
    const userA = await User.create({
      userEmail: "rahul@example.com",
      firstName: "Rahul",
      lastName: "Kurma",
    });
    const userB = await User.create({
      userEmail: "swathi@example.com",
      firstName: "Swathi",
      lastName: "Kurma",
    });

    const cardA = await ScratchCard.create({
      Amount: 100,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isScratched: true,
      isActive: true,
    });
    const cardB = await ScratchCard.create({
      Amount: 200,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isScratched: true,
      isActive: true,
    });

    await Transaction.create([
      { transactionAmount: 50, userId: userA.id, scratchCardId: cardA.id },
      { transactionAmount: 150, userId: userB.id, scratchCardId: cardB.id },
    ]);

    const res = await request(app).get(`/api/transactions?userId=${userA.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].userId).toBe(userA.id);
  });

  it("should filter transactions by dateOfTransaction", async () => {
    const user = await User.create({
      userEmail: "rahul@example.com",
      firstName: "Rahul",
      lastName: "Kurma",
    });

    const card = await ScratchCard.create({
      Amount: 150,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isScratched: true,
      isActive: true,
    });

    const transaction = await Transaction.create({
      transactionAmount: 150,
      userId: user.id,
      scratchCardId: card.id,
      dateOfTransaction: new Date(),
    });

    const today = new Date().toISOString().split("T")[0];
    const res = await request(app).get(
      `/api/transactions?dateOfTransaction=${today}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].id).toBe(transaction.id);
  });
});
