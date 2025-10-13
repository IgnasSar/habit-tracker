import { useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/Profile.css";
import avatarImg from "../assets/ef025950-094e-4280-a45b-9b2c13acac10.png";
import { getCurrentUser, updateUser, deleteUser, getAllUsers } from "../api/userApi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setForm({ username: currentUser.username, password: "" });

        if (currentUser.role === "admin") {
          const users = await getAllUsers();
          setAllUsers(users.filter((u) => u.id !== currentUser.id));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user information. Please log in again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    try {
      const updatePayload = {};
      if (form.username.trim() && form.username !== user.username)
        updatePayload.username = form.username;
      if (form.password.trim() !== "") updatePayload.password = form.password;

      const updatedUser = await updateUser(user.username, updatePayload);
      setUser(updatedUser);
      setEditing(false);
      setErrors({});
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      let parsedErrors = {};
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.errors) parsedErrors = parsed.errors;
      } catch {
        parsedErrors.general = "Something went wrong.";
      }
      setErrors(parsedErrors);
    }
  };

  const handleUserRoleChange = async (targetUsername, newRole) => {
    if (!user || user.role !== "admin") {
      alert("Only admins can change user roles.");
      return;
    }

    try {
      const updatedUser = await updateUser(targetUsername, { role: newRole });
      setAllUsers((prev) =>
        prev.map((u) => (u.username === targetUsername ? updatedUser : u))
      );
      alert(`Role changed to ${newRole} for ${targetUsername}`);
    } catch (err) {
      console.error(err);
      alert("Failed to change role.");
    }
  };

  const handleUserDelete = async (targetUsername) => {
    if (!user || user.role !== "admin") {
      alert("Only admins can delete users.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${targetUsername}?`)) {
      try {
        await deleteUser(targetUsername);
        setAllUsers((prev) => prev.filter((u) => u.username !== targetUsername));
        alert("User deleted successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
      }
    }
  };

  if (loading)
    return (
      <div className="profile-page">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="profile-page">
        <p>{error}</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar">
            <img src={avatarImg} alt="User Avatar" />
          </div>
          <h3>{user.username}</h3>
          <p>{user.role === "admin" ? "Administrator" : "User"}</p>
        </div>

        <div className="profile-right">
          <h3>Account Information</h3>

          <div className="info-group">
            <label>Username</label>
            {editing ? (
              <>
                <input name="username" value={form.username} onChange={handleChange} />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </>
            ) : (
              <p>{user.username}</p>
            )}
          </div>

          <div className="info-group">
            <label>Email</label>
            <p>{user.email}</p>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {editing && (
            <div className="info-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
          )}

          {errors.general && (
            <p className="error-text" style={{ marginTop: "0.5rem" }}>
              {errors.general}
            </p>
          )}

          <div className="buttons">
            {editing ? (
              <>
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}

            {user.role === "admin" && (
              <button
                className="privilege-btn"
                onClick={() => setShowUserList(!showUserList)}
              >
                Manage Users
              </button>
            )}
          </div>

          {showUserList && (
            <div className="user-list">
              <h4>Manage Users</h4>

              {allUsers.length === 0 ? (
                <div className="no-users-box">
                  <p>No other users found.</p>
                </div>
              ) : (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u.username, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleUserDelete(u.username)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
