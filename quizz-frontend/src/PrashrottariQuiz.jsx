import React, { useMemo, useState } from "react";

// Constants
const API_BASE = "http://localhost:8080";
const MAX_QUIZ_QUESTIONS = 20;

// Helper: shuffle array immutably
function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shared Card component with frosted glass effect
function Card({ className = "", children }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

// Liquid Ether Background
function LiquidEtherBackground() {
  // Using pure CSS keyframes with three animated circles
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <style>{`
        @keyframes floatAnim1 { 0% { transform: translate(0,0); } 50% { transform: translate(20px,-30px) scale(1.05);} 100% { transform: translate(0,0);} }
        @keyframes floatAnim2 { 0% { transform: translate(0,0); } 50% { transform: translate(-30px,20px) scale(0.95);} 100% { transform: translate(0,0);} }
        @keyframes floatAnim3 { 0% { transform: translate(0,0); } 50% { transform: translate(25px,25px) scale(1.08);} 100% { transform: translate(0,0);} }
      `}</style>
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-50"
           style={{ background: "radial-gradient(circle at 30% 30%, #5227FF 0%, transparent 60%)", animation: "floatAnim1 10s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-50"
           style={{ background: "radial-gradient(circle at 70% 30%, #FF9FFC 0%, transparent 60%)", animation: "floatAnim2 12s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-50"
           style={{ background: "radial-gradient(circle at 50% 50%, #B19EEF 0%, transparent 60%)", animation: "floatAnim3 14s ease-in-out infinite" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06),_rgba(0,0,0,0))]" />
    </div>
  );
}

// Error Screen
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="mt-3 text-gray-700">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Retry
        </button>
      </Card>
    </div>
  );
}

// Login Screen
function LoginScreen({ onLoginSuccess, setGlobalError }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) throw new Error(`Register failed (${res.status})`);
      const data = await res.json();
      if (!data.success) throw new Error("Registration failed");

      const qRes = await fetch(`${API_BASE}/questions`);
      if (!qRes.ok) throw new Error(`Questions fetch failed (${qRes.status})`);
      const questions = await qRes.json();
      const shuffled = shuffleArray(questions);
      const selected = shuffled.slice(0, Math.min(MAX_QUIZ_QUESTIONS, shuffled.length));
      onLoginSuccess({ username, email }, selected);
    } catch (err) {
      setGlobalError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Prashrottari Quiz
            </h1>
            <p className="mt-3 text-gray-700">
              Sign in to begin a 20-question quiz. Your answers will be evaluated
              instantly upon submission.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Start Quiz"}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

// Quiz Screen
function QuizScreen({ user, questions, onComplete }) {
  const [index, setIndex] = useState(0);
  const [tempAnswers, setTempAnswers] = useState({}); // id -> option text

  const current = questions[index];
  const total = questions.length;

  const options = useMemo(() => (
    [current.option1, current.option2, current.option3, current.option4].filter(Boolean)
  ), [current]);

  const selectAnswer = (text) => {
    setTempAnswers((prev) => ({ ...prev, [current.id]: text }));
  };

  const next = () => setIndex((i) => Math.min(i + 1, total - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const submit = () => {
    // Calculate score: backend stores full answer text in `answer`
    let score = 0;
    const detail = questions.map((q) => {
      const userAnswer = tempAnswers[q.id] || null;
      const correct = (userAnswer || "").trim() === (q.answer || "").trim();
      if (correct) score += 1;
      return { id: q.id, question: q.question, options: [q.option1, q.option2, q.option3, q.option4], correctAnswer: q.answer, userAnswer, isCorrect: correct };
    });
    onComplete({ score, total, detail });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{user?.username}</div>
          <div className="text-sm font-semibold text-indigo-600">
            Question {index + 1} / {total}
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{current.question}</h2>
        <div className="mt-4 grid gap-3">
          {options.map((opt) => {
            const selected = tempAnswers[current.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => selectAnswer(opt)}
                className={`text-left rounded-xl border p-3 transition-colors ${selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/70 border-gray-300 hover:border-indigo-400"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={prev} disabled={index === 0} className="rounded-lg border px-4 py-2 text-gray-700 disabled:opacity-50">Previous</button>
          {index < total - 1 ? (
            <button onClick={next} className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold">Next</button>
          ) : (
            <button onClick={submit} className="rounded-lg bg-green-600 px-4 py-2 text-white font-semibold">Submit</button>
          )}
        </div>
      </Card>
    </div>
  );
}

// Result Screen
function ResultScreen({ result, onRestart }) {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900">Your Results</h2>
            <div className="text-lg font-semibold text-indigo-600">Score: {result.score} / {result.total}</div>
          </div>
        </Card>
        <div className="mt-6 grid gap-4">
          {result.detail.map((row, idx) => (
            <Card key={row.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Q{idx + 1}</div>
                  <div className="mt-1 font-semibold text-gray-900">{row.question}</div>
                </div>
                <div className={`text-sm font-semibold ${row.isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {row.isCorrect ? "Correct" : "Incorrect"}
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                {row.options.filter(Boolean).map((opt) => (
                  <div key={opt} className={`rounded-lg border p-2 ${opt === row.correctAnswer ? "border-green-500 bg-green-50" : opt === row.userAnswer ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}>
                    {opt}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <span className="font-medium text-gray-700">Your answer:</span>{" "}
                <span className={row.isCorrect ? 'text-green-700' : 'text-red-700'}>{row.userAnswer ?? "Not answered"}</span>
              </div>
              {!row.isCorrect && (
                <div className="mt-1 text-sm">
                  <span className="font-medium text-gray-700">Correct answer:</span>{" "}
                  <span className="text-green-700">{row.correctAnswer}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button onClick={onRestart} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-semibold">Restart</button>
        </div>
      </div>
    </div>
  );
}

// Root Single-File App
export default function PrashrottariQuiz() {
  const [view, setView] = useState("login"); // login | quiz | result | error
  const [globalError, setGlobalError] = useState("");
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);

  const handleLoginSuccess = (userData, selectedQuestions) => {
    setUser(userData);
    setQuestions(selectedQuestions);
    setView("quiz");
  };

  const handleComplete = (res) => {
    setResult(res);
    setView("result");
  };

  const retry = () => {
    setGlobalError("");
    setUser(null);
    setQuestions([]);
    setResult(null);
    setView("login");
  };

  return (
    <div className="min-h-screen">
      <LiquidEtherBackground />
      {view === "error" && (
        <ErrorScreen message={globalError} onRetry={retry} />
      )}
      {view === "login" && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} setGlobalError={(m) => { setGlobalError(m); setView("error"); }} />
      )}
      {view === "quiz" && (
        <QuizScreen user={user} questions={questions} onComplete={handleComplete} />
      )}
      {view === "result" && (
        <ResultScreen result={result} onRestart={retry} />
      )}
    </div>
  );
}
