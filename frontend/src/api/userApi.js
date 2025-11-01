const API_BASE = "http://localhost:80/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getAllUsers(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function updateUser(username, updateData) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteUser(username) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.text();
}
