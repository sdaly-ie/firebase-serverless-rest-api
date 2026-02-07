// Comments page calls the API

const API_BASE = "https://us-central1-assignment4-54794.cloudfunctions.net/api";

async function fetchComments() {
  const res = await fetch(`${API_BASE}/comments`);
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json();
}

async function postComment(handle, text) {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, text }),
  });

  if (!res.ok) {
    let errMsg = "Failed to post comment";
    try {
      const err = await res.json();
      if (err?.error) errMsg = err.error;
    } catch (e) {
      // Ignores if response isn't JSON
    }
    throw new Error(errMsg);
  }
}

function renderComments(comments) {
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  comments.forEach((c) => {
    const wrapper = document.createElement("div");
    wrapper.className = "col-12";

    wrapper.innerHTML = `
      <div class="card shadow-sm mb-2">
        <div class="card-body">
          <p class="mb-1">
            <strong>${escapeHtml(c.handle)}</strong>
            <small class="text-muted ms-2">${c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</small>
          </p>
          <p class="mb-0">${escapeHtml(c.text)}</p>
        </div>
      </div>
    `;

    list.appendChild(wrapper);
  });
}

// Show the comment as text, not as code
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refreshComments(errorBox) {
  try {
    const comments = await fetchComments();
    renderComments(comments);
    if (errorBox) errorBox.classList.add("d-none");
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = err.message;
      errorBox.classList.remove("d-none");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("commentForm");
  const handleInput = document.getElementById("handle");
  const commentInput = document.getElementById("commentText");
  const errorBox = document.getElementById("commentError");

  // Load comments when the page opens
  refreshComments(errorBox);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const handle = handleInput.value.trim();
    const text = commentInput.value.trim();

    // Quick check before sending
    if (!handle || !text) {
      errorBox.textContent = "Please enter both a handle and a comment.";
      errorBox.classList.remove("d-none");
      return;
    }

    // Block hacker before sending 
    let normalized = handle.toLowerCase();
    if (normalized.startsWith("@")) normalized = normalized.slice(1);
    if (normalized === "hacker") {
      errorBox.textContent = "Sorry, that handle is not allowed.";
      errorBox.classList.remove("d-none");
      return;
    }

    try {
      await postComment(handle, text);
      form.reset();
      await refreshComments(errorBox);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.remove("d-none");
    }
  });
});
