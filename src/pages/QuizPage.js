import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { useNavigate } from "react-router-dom";

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const total = 20;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:8080/questions");
        const all = res.data || [];
        const randomized = shuffle(all).slice(0, Math.min(total, all.length));
        if (mounted) setQuestions(randomized);
      } catch (e) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / Math.max(questions.length, 1)) * 100);
  }, [answers, questions.length]);

  const onSelect = (index, choiceKey) => {
    setAnswers((prev) => ({ ...prev, [index]: choiceKey }));
  };

  const onSubmit = () => {
    let score = 0;
    questions.forEach((q, i) => {
      const chosen = answers[i];
      const correctKey = ["option1", "option2", "option3", "option4"].find(
        (k) => q[k] === q.answer
      );
      if (chosen && correctKey && chosen === correctKey) score += 1;
    });

    const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;

    navigate("/result", {
      state: { score, total: questions.length, percent },
      replace: true,
    });
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-300">Loading questions...</div>;
  }
  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-lg rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-300">
        {error}
      </div>
    );
  }
  if (!questions.length) {
    return <div className="py-24 text-center text-gray-300">No questions available.</div>;
  }

  const q = questions[current];

  return (
    <div className="space-y-6">
      <div className="h-2 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400" style={{ width: `${progress}%` }} />
      </div>

      <QuestionCard
        index={current}
        total={questions.length}
        question={q}
        selected={answers[current]}
        onSelect={(key) => onSelect(current, key)}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="rounded-md border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-[#0D1117] transition hover:bg-teal-500"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-[#0D1117] transition hover:bg-cyan-400"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
