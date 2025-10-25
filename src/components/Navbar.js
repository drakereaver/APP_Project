import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("prashnottari_user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0D1117]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to={user ? "/quiz" : "/"} className="text-xl font-semibold tracking-wide">
          <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">Prashnottari</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="rounded-full border border-teal-500/40 px-3 py-1 text-teal-300/90">
                {user.username}
                {user.isAdmin ? (
                  <span className="ml-2 rounded bg-teal-600/20 px-2 py-0.5 text-xs text-teal-300">Admin</span>
                ) : null}
              </span>
              {user.isAdmin ? (
                <Link
                  to="/admin"
                  className="rounded-md border border-teal-500/40 px-3 py-1.5 text-teal-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  Admin
                </Link>
              ) : null}
              <button
                onClick={handleLogout}
                className="rounded-md bg-teal-600 px-3 py-1.5 text-[#0D1117] transition hover:bg-teal-500"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="rounded-md px-3 py-1.5 text-teal-300 hover:text-cyan-300" to="/login">
                Login
              </Link>
              <Link
                className="rounded-md bg-teal-600 px-3 py-1.5 text-[#0D1117] transition hover:bg-teal-500"
                to="/signup"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
