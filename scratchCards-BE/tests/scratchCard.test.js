import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import ScratchCard from "../models/scratchCard.model.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await ScratchCard.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("SCRATCH CARD API TESTS", () => {
  it("should generate new scratch cards successfully", async () => {
    const res = await request(app)
      .post("/api/scratchcards/generate")
      .send({ numberOfScratchCards: 3 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it("should reject invalid number of scratch cards", async () => {
    const res = await request(app)
      .post("/api/scratchcards/generate")
      .send({ numberOfScratchCards: -5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should not allow generating when enough active cards already exist", async () => {
    await ScratchCard.create([
      {
        Amount: 100,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isScratched: false,
      },
      {
        Amount: 200,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isScratched: false,
      },
      {
        Amount: 300,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        isScratched: false,
      },
    ]);

    const res = await request(app)
      .post("/api/scratchcards/generate")
      .send({ numberOfScratchCards: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
  it("should get all scratch cards", async () => {
    await ScratchCard.create([
      {
        Amount: 100,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        Amount: 200,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    ]);

    const res = await request(app).get("/api/scratchcards");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
  it("should get all unused scratch cards", async () => {
    await ScratchCard.create([
      {
        Amount: 100,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isScratched: false,
      },
      {
        Amount: 200,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isScratched: true,
      },
    ]);

    const res = await request(app).get("/api/scratchcards/unused");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].isScratched).toBe(false);
  });

  it("should scratch a valid unused card", async () => {
    const card = await ScratchCard.create({
      Amount: 500,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isScratched: false,
    });

    const res = await request(app).post(
      `/api/scratchcards/scratch/${card._id}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isScratched).toBe(true);
  });

  it("should not allow scratching an already scratched card", async () => {
    const card = await ScratchCard.create({
      Amount: 500,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isScratched: true,
    });

    const res = await request(app).post(
      `/api/scratchcards/scratch/${card._id}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already scratched/i);
  });

  it("should not allow scratching an expired card", async () => {
    const expiredCard = await ScratchCard.create({
      Amount: 250,
      expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // already expired
      isScratched: false,
    });

    const res = await request(app).post(
      `/api/scratchcards/scratch/${expiredCard._id}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/expired/i);
  });
});
