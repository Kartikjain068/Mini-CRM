import React from "react";
import "./LoginPage.css"; // Assuming you have the CSS from earlier

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h1 className="login-title">Welcome to Mini CRM</h1>
        <p className="login-desc">Please log in to continue</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <span className="emoji-icon" role="img" aria-label="Google">🔵</span>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
