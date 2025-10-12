import { useState } from "react";
import Header from "../components/Header";
import "../styles/Profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: "Hembo Tingor",
    email: "rntng@gmail.com",
    phone: "98979989898",
    role: "admin", // or "user"
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(form);
    setEditing(false);
    // TODO: call API to save
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      // TODO: call API to delete account
      alert("Account deleted");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar"></div>
          <h3>{user.username}</h3>
          <p>{user.role === "admin" ? "Administrator" : "User"}</p>
        </div>

        <div className="profile-right">
          <h3>Account Information</h3>

          <div className="info-group">
            <label>Email</label>
            {editing ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="info-group">
            <label>Phone</label>
            {editing ? (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{user.phone}</p>
            )}
          </div>

          <div className="buttons">
            {editing ? (
              <>
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <button className="password-btn">Change Password</button>
              </>
            )}

            {user.role === "admin" && (
              <>
                <button className="privilege-btn">Change Privileges</button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
