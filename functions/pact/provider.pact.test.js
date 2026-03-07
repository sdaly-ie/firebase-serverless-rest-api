const path = require("path");
const http = require("http");
const { Verifier } = require("@pact-foundation/pact");
const { createApp } = require("../app");

const providerState = {
  comments: [],
  failGetComments: false,
  failAddComment: false,
  lastCreated: null,
};

function resetState() {
  providerState.comments = [];
  providerState.failGetComments = false;
  providerState.failAddComment = false;
  providerState.lastCreated = null;
}

function buildDoc(comment) {
  return {
    id: comment.id,
    data: () => ({
      handle: comment.handle,
      text: comment.text,
      createdAt: {
        toDate: () => new Date(comment.createdAt),
      },
    }),
  };
}

function buildDependencies(state) {
  return {
    db: {
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn(async () => {
              if (state.failGetComments) {
                throw new Error("GET /comments failed");
              }

              return {
                docs: state.comments.map(buildDoc),
              };
            }),
          })),
        })),
        add: jest.fn(async (payload) => {
          if (state.failAddComment) {
            throw new Error("POST /comments failed");
          }

          state.lastCreated = payload;
          return { id: "newComment123" };
        }),
      })),
    },
    admin: {
      firestore: {
        FieldValue: {
          serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
        },
      },
    },
    logger: {
      error: jest.fn(),
    },
  };
}

describe("Pact provider verification for FirebaseCommentsApi", () => {
  let server;

  beforeAll(async () => {
    resetState();

    const app = createApp(buildDependencies(providerState));
    server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(8081, "127.0.0.1", resolve);
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test(
    "verifies the generated pact file",
    () => {
      const opts = {
        providerBaseUrl: "http://127.0.0.1:8081",
        provider: "FirebaseCommentsApi",
        pactUrls: [
          path.resolve(
            __dirname,
            "..",
            "pacts",
            "WebsiteCommentsClient-FirebaseCommentsApi.json"
          ),
        ],
        logLevel: "INFO",
        stateHandlers: {
          "provider is healthy": async () => {
            resetState();
          },

          "comments exist": async () => {
            resetState();
            providerState.comments = [
              {
                id: "abc123",
                handle: "@stephen",
                text: "Posting from Postman",
                createdAt: "2026-02-07T20:20:25.524Z",
              },
            ];
          },

          "comment can be created": async () => {
            resetState();
          },
        },
      };

      return new Verifier(opts).verifyProvider();
    },
    30000
  );
});