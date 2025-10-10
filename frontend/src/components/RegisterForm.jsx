import { useRegisterForm } from "../hooks/useRegisterForm";
import "../styles/Register.css";

export default function RegisterForm() {
  const {
    formData,
    fieldErrors,
    serverError,
    success,
    loading,
    handleChange,
    handleSubmit
  } = useRegisterForm();

  return (
    <div className="register-form">
      <h2>Create Account</h2>

      {success && <p className="success">Registration successful!</p>}
      {serverError && <p className="error">{serverError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />
          {fieldErrors.username && <p className="error">{fieldErrors.username}</p>}
        </div>

        <div className="input-group">
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
        </div>

        <div className="input-group">
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {fieldErrors.password && <p className="error">{fieldErrors.password}</p>}
        </div>

        <button type="submit" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
      </form>
    </div>
  );
}
