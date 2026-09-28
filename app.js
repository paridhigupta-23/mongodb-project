const state = { events: [], users: [] };

const $ = (selector) => document.querySelector(selector);

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

async function api(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function loadStats() {
  const data = await api("/api/analytics/overview");
  $("#eventCount").textContent = data.eventCount;
  $("#registrationCount").textContent = data.registrationCount;
  $("#upcomingCount").textContent = data.upcomingCount;
  $("#utilization").textContent = `${data.utilization}%`;
}

async function loadEvents() {
  const category = $("#categoryFilter").value;
  const query = category ? `?category=${encodeURIComponent(category)}&status=upcoming` : "?status=upcoming";
  state.events = await api(`/api/events${query}`);

  $("#eventGrid").innerHTML = state.events.length
    ? state.events.map(eventCard).join("")
    : `<div class="event"><h3>No events found</h3><p>Try another category.</p></div>`;

  document.querySelectorAll("[data-event]").forEach((button) => {
    button.addEventListener("click", () => openRegistration(button.dataset.event));
  });
}

function eventCard(event) {
  const remaining = Math.max(event.capacity - event.registeredCount, 0);
  return `
    <article class="event">
      <div class="event-top">
        <span class="tag">${event.category}</span>
        <span class="tag">${remaining} seats</span>
      </div>
      <h3>${escapeHtml(event.title)}</h3>
      <p>${escapeHtml(event.description)}</p>
      <div class="meta">
        <span>📅 ${formatDate(event.startAt)}</span>
        <span>📍 ${escapeHtml(event.venue)}</span>
      </div>
      <button class="primary" data-event="${event._id}" ${remaining === 0 ? "disabled" : ""}>
        ${remaining === 0 ? "Full" : "Register"}
      </button>
    </article>
  `;
}

async function loadAnalytics() {
  const rows = await api("/api/analytics/events");
  $("#analyticsBody").innerHTML = rows.length
    ? rows.map(row => `
      <tr>
        <td>${escapeHtml(row.title)}</td>
        <td>${escapeHtml(row.category)}</td>
        <td>${row.registrations}</td>
        <td>${row.capacity}</td>
        <td>${row.utilization}%</td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">No registrations yet. Register for an event to populate the aggregation.</td></tr>`;
}

async function loadUsers() {
  // The prototype gets demo users from the seed endpoint-independent list below.
  // In a production build, authentication would provide the current user.
  try {
    const events = await api("/api/events?status=upcoming");
    if (!events.length) return;
    // Demo user IDs are intentionally not exposed by a public API.
    // The registration dialog therefore uses the IDs written to localStorage
    // after the seed command is run, if the user adds one manually.
    const saved = localStorage.getItem("stackworks_demo_user_id");
    if (saved) {
      state.users = [{ _id: saved, name: "Selected demo student" }];
      $("#studentSelect").innerHTML = `<option value="${saved}">Selected demo student</option>`;
    } else {
      $("#studentSelect").innerHTML = `
        <option value="">Paste a seeded user ID in the browser's localStorage as stackworks_demo_user_id</option>
      `;
    }
  } catch (error) {
    console.error(error);
  }
}

function openRegistration(eventId) {
  const event = state.events.find(item => item._id === eventId);
  if (!event) return;
  $("#eventId").value = eventId;
  $("#dialogTitle").textContent = event.title;
  $("#dialogMeta").textContent = `${formatDate(event.startAt)} · ${event.venue}`;
  $("#formMessage").textContent = "";
  $("#registerDialog").showModal();
}

$("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = $("#studentSelect").value;
  const eventId = $("#eventId").value;

  if (!userId) {
    $("#formMessage").textContent = "Add a seeded user ID to localStorage first.";
    return;
  }

  try {
    const registration = await api("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventId })
    });

    $("#registerDialog").close();
    showToast(`Registered! Ticket: ${registration.ticketCode}`);
    await Promise.all([loadStats(), loadEvents(), loadAnalytics()]);
  } catch (error) {
    $("#formMessage").textContent = error.message;
  }
});

$("#categoryFilter").addEventListener("change", loadEvents);
$("#refreshBtn").addEventListener("click", async () => {
  await Promise.all([loadStats(), loadEvents(), loadAnalytics()]);
  showToast("Analytics refreshed");
});

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

async function init() {
  try {
    await Promise.all([loadStats(), loadEvents(), loadAnalytics(), loadUsers()]);
  } catch (error) {
    console.error(error);
    showToast("Connect MongoDB and run the seed command first.");
  }
}

init();
