import RegisterForm from "../components/RegisterForm";
import "../styles/Register.css";

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="left-panel">
        <h1>Get Started</h1>
        <p>Already have an account?</p>
        <button className="login-btn">Log in</button>
      </div>

      <div className="right-panel">
        <RegisterForm />
      </div>
    </div>
  );
}
