import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import "../styles/Register.css";

export default function RegisterPage() {
  const [isLoginMode, setIsLoginMode] = useState(false);

  return (
    <div className="register-page">
      <div className="left-panel">
        {isLoginMode ? (
          <>
            <h1>Welcome Back</h1>
            <p>Don’t have an account?</p>
            <button className="login-btn" onClick={() => setIsLoginMode(false)}>
              Register
            </button>
          </>
        ) : (
          <>
            <h1>Get Started</h1>
            <p>Already have an account?</p>
            <button className="login-btn" onClick={() => setIsLoginMode(true)}>
              Log in
            </button>
          </>
        )}
      </div>

      <div className="right-panel">
        {isLoginMode ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
