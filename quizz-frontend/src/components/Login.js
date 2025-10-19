import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError("Please enter both username and email.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ✅ Changed from /login to /register to match backend
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Authenticate user
      onAuth({ username: data.username, email: data.email }, data.isAdmin);

      // Redirect based on admin status
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/quiz");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Make sure the backend is running on port 8080.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="hero-section">
        <h1 className="hero-title">The web, made fluid at your fingertips.</h1>
        <p className="hero-subtitle">Experience interactive learning with our dynamic quiz platform</p>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="form-input"
          />
        </div>
        
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="form-input"
          />
        </div>

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? "Entering..." : "Get Started"}
        </button>

        {error && <div className="error-message">{error}</div>}
        
        <div className="login-hint">
          <p>💡 Create your account by entering username and email</p>
        </div>
      </form>
    </div>
  );
}

export default Login;