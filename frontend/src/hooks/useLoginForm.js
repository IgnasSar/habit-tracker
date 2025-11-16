import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

export function useLoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");
    setSuccess(false);

    if (!formData.username.trim()) {
      setFieldErrors({ username: "Username is required." });
      return;
    }
    if (!formData.password.trim()) {
      setFieldErrors({ password: "Password is required." });
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      setSuccess(true);
      navigate("/main");
    } catch (err) {
      let parsed;
      try {
        parsed = JSON.parse(err.message);
        if (
          parsed.message?.toLowerCase().includes("invalid credentials") ||
          parsed.code === 401
        ) {
          setFieldErrors({
            password: "Invalid username or password.",
          });
          return;
        }
        setServerError(parsed.message || "Login failed.");
      } catch {
        const msg = err.message.toLowerCase();
        if (msg.includes("invalid credentials")) {
          setFieldErrors({
            password: "Invalid username or password.",
          });
        } else {
          setServerError("Login failed.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    fieldErrors,
    serverError,
    success,
    loading,
    handleChange,
    handleSubmit,
  };
}
