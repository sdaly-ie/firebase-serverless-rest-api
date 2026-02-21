const request = require("supertest");
const { createApp } = require("../app");

function buildMocks() {
  const getMock = jest.fn();
  const addMock = jest.fn();

  const collectionMock = {
    orderBy: jest.fn(() => ({
      limit: jest.fn(() => ({
        get: getMock,
      })),
    })),
    add: addMock,
  };

  const db = {
    collection: jest.fn(() => collectionMock),
  };

  const admin = {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
      },
    },
  };

  const logger = {
    error: jest.fn(),
  };

  return {
    db,
    admin,
    logger,
    getMock,
    addMock,
  };
}

describe("Firebase Serverless REST API app", () => {
  test("GET /health returns API health response", async () => {
    const { db, admin, logger } = buildMocks();
    const app = createApp({ db, admin, logger });

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: "API is running" });
  });

  test("GET /comments returns mapped comments (newest first as provided by query)", async () => {
    const { db, admin, logger, getMock } = buildMocks();
    const app = createApp({ db, admin, logger });

    getMock.mockResolvedValue({
      docs: [
        {
          id: "abc123",
          data: () => ({
            handle: "@stephen",
            text: "Posting from Postman",
            createdAt: {
              toDate: () => new Date("2026-02-07T20:20:25.524Z"),
            },
          }),
        },
        {
          id: "def456",
          data: () => ({
            handle: "@trailrunner23",
            text: "Great run today!",
            createdAt: {
              toDate: () => new Date("2026-02-07T19:30:18.671Z"),
            },
          }),
        },
      ],
    });

    const res = await request(app).get("/comments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toEqual({
      id: "abc123",
      handle: "@stephen",
      text: "Posting from Postman",
      createdAt: "2026-02-07T20:20:25.524Z",
    });
    expect(res.body[1]).toEqual({
      id: "def456",
      handle: "@trailrunner23",
      text: "Great run today!",
      createdAt: "2026-02-07T19:30:18.671Z",
    });
  });

  test("POST /comments returns 400 when handle or text is missing", async () => {
    const { db, admin, logger, addMock } = buildMocks();
    const app = createApp({ db, admin, logger });

    const res = await request(app)
      .post("/comments")
      .send({ handle: "@stephen", text: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "handle and text are required" });
    expect(addMock).not.toHaveBeenCalled();
  });

  test("POST /comments blocks hacker handle (including @hacker)", async () => {
    const { db, admin, logger, addMock } = buildMocks();
    const app = createApp({ db, admin, logger });

    const res = await request(app)
      .post("/comments")
      .send({ handle: "@hacker", text: "test" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Handle not allowed" });
    expect(addMock).not.toHaveBeenCalled();
  });

  test("POST /comments creates a new comment and returns id", async () => {
    const { db, admin, logger, addMock } = buildMocks();
    const app = createApp({ db, admin, logger });

    addMock.mockResolvedValue({ id: "newComment123" });

    const res = await request(app)
      .post("/comments")
      .send({ handle: "@trailrunner23", text: "Great run today!" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "newComment123" });

    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith({
      handle: "@trailrunner23",
      text: "Great run today!",
      createdAt: "SERVER_TIMESTAMP",
    });
  });
});