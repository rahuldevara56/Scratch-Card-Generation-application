import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import User from "../models/user.model.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("USER API TESTS", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      userEmail: "akshaybosale@gmail.com",
      firstName: "akshay",
      lastName: "bosale",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("userEmail", "akshaybosale@gmail.com");
  });

  it("should not create a user with invalid email", async () => {
    const res = await request(app).post("/api/users").send({
      userEmail: "akshaybosalegmail.com",
      firstName: "akshay",
      lastName: "bosale",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should get all users", async () => {
    // Create a user first
    await new User({
      userEmail: "charan@gmail.com",
      firstName: "charan",
      lastName: "kondi",
    }).save();

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("should get a user by ID", async () => {
    // Create one user
    const user = await new User({
      userEmail: "findkondi@gmail.com",
      firstName: "find",
      lastName: "kondi",
    }).save();

    // Request by ID
    const res = await request(app).get(`/api/users/${user.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("id", user.id);
  });

  it("should not allow creating a user with duplicate email", async () => {
    await request(app).post("/api/users").send({
      userEmail: "chintu@gmail.com",
      firstName: "chintu",
      lastName: "chinnu",
    });

    const res = await request(app).post("/api/users").send({
      userEmail: "chintu@gmail.com",
      firstName: "chintu",
      lastName: "chinnu",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should update a user by ID", async () => {
    const user = await new User({
      userEmail: "swathijaps@gmail.com",
      firstName: "swathi",
      lastName: "japs",
    }).save();

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ firstName: "swathisony" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstName).toBe("swathisony");
  });

  it("should delete a user by ID", async () => {
    const user = await new User({
      userEmail: "roy@gmail.com",
      firstName: "roy",
      lastName: "tempuser",
    }).save();

    const res = await request(app).delete(`/api/users/${user.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);
  });

  it("should update a user by ID", async () => {
    const user = await User.create({
      userEmail: "charan@gmail.com",
      firstName: "charan",
      lastName: "appana",
    });

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ firstName: "kondi" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstName).toBe("kondi");
  });

  it("should return 404 if updating non-existent user", async () => {
    const res = await request(app)
      .put(`/api/users/invalidid`)
      .send({ firstName: "Nothing" });

    expect(res.statusCode).toBe(404);
  });

  it("should delete a user by ID", async () => {
    const user = await User.create({
      userEmail: "kondi@gmail.com",
      firstName: "kondi",
      lastName: "charan",
    });

    const res = await request(app).delete(`/api/users/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should return 404 when deleting non-existent user", async () => {
    const res = await request(app).delete(`/api/users/fakeid`);
    expect(res.statusCode).toBe(404);
  });

  it("should activate multiple users", async () => {
    const users = await User.create([
      { userEmail: "aaa@gmail.com", firstName: "a", lastName: "b" },
      { userEmail: "bbb@gmai..com", firstName: "b", lastName: "a" },
    ]);

    const ids = users.map((u) => u.id);

    const res = await request(app).put("/api/users/activate").send({ ids });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await User.find({ id: { $in: ids } });
    expect(updated.every((u) => u.isActive === true)).toBe(true);
  });

  it("should deactivate multiple users", async () => {
    const users = await User.create([
      { userEmail: "aaa@gmail.com", firstName: "a", lastName: "b" },
      { userEmail: "bbb@gmail.com", firstName: "b", lastName: "a" },
    ]);

    const ids = users.map((u) => u.id);

    const res = await request(app).put("/api/users/deactivate").send({ ids });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await User.find({ id: { $in: ids } });
    expect(updated.every((u) => u.isActive === false)).toBe(true);
  });
});
