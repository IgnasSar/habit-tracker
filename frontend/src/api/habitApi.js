const API_BASE = "http://localhost:80/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function getAllHabits(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/habits?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createHabit(data) {
  const res = await fetch(`${API_BASE}/habits`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function updateHabit(id, data) {
  const res = await fetch(`${API_BASE}/habits/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteHabit(id) {
  const res = await fetch(`${API_BASE}/habits/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status !== 204) throw new Error(await res.text());
  return true;
}

export async function getHabitChecks(habitId, fromDate, toDate) {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
  });
  const res = await fetch(`${API_BASE}/habits/${habitId}/checks?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createHabitCheck(habitId, entryDate) {
  const res = await fetch(`${API_BASE}/habits/${habitId}/checks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      entry_date: entryDate,
      is_completed: true,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}


export async function deleteHabitCheck(checkId) {
  const res = await fetch(`${API_BASE}/habit-checks/${checkId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status !== 204) throw new Error(await res.text());
  return true;
}
