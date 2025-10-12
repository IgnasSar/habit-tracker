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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

// Get current logged-in user
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

// Get all users (admin only)
export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

export async function updateUser(updateData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

export async function deleteUser() {
  const res = await fetch(`${API_BASE}/users`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.text();
}
