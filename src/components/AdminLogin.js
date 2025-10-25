import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin, admin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username === admin.username && email === admin.email) {
      setIsAdmin(true);
      navigate("/admin");
    } else {
      alert("Incorrect admin credentials");
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br/>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <button onClick={handleSubmit}>Login as Admin</button>
    </div>
  );
}

export default AdminLogin;
