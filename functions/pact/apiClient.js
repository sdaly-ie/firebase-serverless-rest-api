async function readResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

class CommentsApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getHealth() {
    const res = await fetch(`${this.baseUrl}/health`);
    return readResponse(res);
  }

  async getComments() {
    const res = await fetch(`${this.baseUrl}/comments`);
    return readResponse(res);
  }

  async createComment({ handle, text }) {
    const res = await fetch(`${this.baseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handle, text }),
    });

    return readResponse(res);
  }
}

module.exports = { CommentsApiClient };