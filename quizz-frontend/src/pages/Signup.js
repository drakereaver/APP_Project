import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Assuming signup is same as register for now (backend exposes /register)
      const res = await axios.post("http://localhost:8080/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data?.success) {
        setSuccess("Account exists. Logged in successfully.");
        localStorage.setItem(
          "prashnottari_user",
          JSON.stringify({
            username: res.data.username,
            email: res.data.email,
            isAdmin: !!res.data.isAdmin,
          })
        );
        navigate("/quiz", { replace: true });
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md">
      <div className="rounded-2xl border border-white/10 bg-[#0F1520] p-6 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold text-teal-300">Signup</h1>

        {error ? (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>
        ) : null}
        {success ? (
          <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{success}</div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 transition placeholder:text-gray-400 focus:border-cyan-400/40"
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 transition placeholder:text-gray-400 focus:border-cyan-400/40"
              placeholder="Enter email"
              autoComplete="email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-teal-600 px-4 py-2 font-medium text-[#0D1117] transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-teal-300 hover:text-cyan-300">Log in</Link>
        </p>
      </div>
    </div>
  );
}
