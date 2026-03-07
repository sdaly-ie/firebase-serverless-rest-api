const path = require("path");
const { PactV3, MatchersV3 } = require("@pact-foundation/pact");
const { CommentsApiClient } = require("./apiClient");

const { like, eachLike } = MatchersV3;

describe("Pact consumer tests for FirebaseCommentsApi", () => {
  const provider = new PactV3({
    consumer: "WebsiteCommentsClient",
    provider: "FirebaseCommentsApi",
    dir: path.resolve(__dirname, "..", "pacts"),
  });

  test("GET /health", async () => {
    provider
      .given("provider is healthy")
      .uponReceiving("a request for API health")
      .withRequest({
        method: "GET",
        path: "/health",
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: like({
          ok: true,
          message: "API is running",
        }),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new CommentsApiClient(mockServer.url);
      const result = await client.getHealth();

      expect(result).toEqual({
        ok: true,
        message: "API is running",
      });
    });
  });

  test("GET /comments", async () => {
    provider
      .given("comments exist")
      .uponReceiving("a request for the latest comments")
      .withRequest({
        method: "GET",
        path: "/comments",
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: eachLike({
          id: like("abc123"),
          handle: like("@stephen"),
          text: like("Posting from Postman"),
          createdAt: like("2026-02-07T20:20:25.524Z"),
        }),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new CommentsApiClient(mockServer.url);
      const result = await client.getComments();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual({
        id: "abc123",
        handle: "@stephen",
        text: "Posting from Postman",
        createdAt: "2026-02-07T20:20:25.524Z",
      });
    });
  });

  test("POST /comments", async () => {
    provider
      .given("comment can be created")
      .uponReceiving("a request to create a new comment")
      .withRequest({
        method: "POST",
        path: "/comments",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          handle: "@trailrunner23",
          text: "Great run today!",
        },
      })
      .willRespondWith({
        status: 201,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: like({
          id: "newComment123",
        }),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new CommentsApiClient(mockServer.url);
      const result = await client.createComment({
        handle: "@trailrunner23",
        text: "Great run today!",
      });

      expect(result).toEqual({
        id: "newComment123",
      });
    });
  });
});