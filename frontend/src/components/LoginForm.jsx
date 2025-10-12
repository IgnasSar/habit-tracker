import { useLoginForm } from "../hooks/useLoginForm";
import "../styles/Register.css";

export default function LoginForm() {
  const {
    formData,
    fieldErrors,
    serverError,
    success,
    loading,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="register-form">
      <h2>Log In</h2>

      {success && <p className="success">Login successful!</p>}
      {serverError && <p className="error">{serverError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input
            name="username"
            type="text"
            placeholder="Email"
            value={formData.username}
            onChange={handleChange}
          />
          {fieldErrors.username && (
            <p className="error">{fieldErrors.username}</p>
          )}
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="error">{fieldErrors.password}</p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
