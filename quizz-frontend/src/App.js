import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Admin from "./components/Admin";
import LiquidEther from "./components/LiquidEther";
import "./App.css";

function BackgroundWrapper({ children }) {
  return (
    <div className="app-container">
      <LiquidEther
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
      <div className="app-content">{children}</div>
    </div>
  );
}

function ProtectedRoute({ condition, redirectPath = "/", children }) {
  return condition ? children : <Navigate to={redirectPath} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAuth = (userData, adminStatus) => {
    setUser(userData);
    setIsAdmin(adminStatus);
  };

  return (
    <Router>
      <BackgroundWrapper>
        <Routes>
          <Route path="/" element={<Login onAuth={handleAuth} />} />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute condition={user && !isAdmin}>
                <Quiz user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute condition={isAdmin}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BackgroundWrapper>
    </Router>
  );
}

export default App;