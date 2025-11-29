const API_BASE = "http://localhost:80/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function getUnreadNotifications() {
  const res = await fetch(`${API_BASE}/notifications/unread`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function markNotificationAsRead(id) {
  const res = await fetch(`${API_BASE}/notifications/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isRead: true }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
