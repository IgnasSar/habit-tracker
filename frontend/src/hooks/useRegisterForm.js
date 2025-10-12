import { useState } from "react";
import { registerUser } from "../api/userApi";
import { validateUserForm } from "../validators/userValidator";

export function useRegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");
    setSuccess(false);

    const clientErrors = validateUserForm(formData);
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess(true);
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);

        if (parsed.errors) {
          const errors = {};
          if (parsed.errors.username) errors.username = parsed.errors.username;
          if (parsed.errors.email) errors.email = parsed.errors.email;
          if (parsed.errors.password) errors.password = parsed.errors.password;
          setFieldErrors(errors);
          return;
        }

        if (parsed.message?.includes("username")) {
          setFieldErrors({ username: "Username already exists" });
          return;
        }
        if (parsed.message?.includes("email")) {
          setFieldErrors({ email: "Email already exists" });
          return;
        }

        setServerError(parsed.message || "Registration failed.");
      } catch {
        const msg = err.message.toLowerCase();
        if (msg.includes("username")) {
          setFieldErrors({ username: "Username already exists" });
        } else if (msg.includes("email")) {
          setFieldErrors({ email: "Email already exists" });
        } else {
          setServerError("Registration failed.");
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
