import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, total = 0, percent = 0 } = location.state || {};

  const playAgain = () => {
    navigate("/quiz", { replace: true });
  };

  return (
    <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-white/10 bg-[#0F1520] p-6 text-center shadow-xl">
      <h1 className="mb-4 text-2xl font-semibold text-teal-300">Your Results</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-gray-400">Score</div>
          <div className="text-2xl font-bold text-white">{score}/{total}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-gray-400">Percentage</div>
          <div className="text-2xl font-bold text-cyan-300">{percent}%</div>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-gray-400">Status</div>
          <div className="text-2xl font-bold text-white">{percent >= 50 ? "Pass" : "Try Again"}</div>
        </div>
      </div>

      <button
        onClick={playAgain}
        className="rounded-md bg-teal-600 px-5 py-2 text-[#0D1117] transition hover:bg-teal-500"
      >
        Play Again
      </button>
    </div>
  );
}
