import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminTable from "../components/AdminTable";
import Modal from "../components/Modal";

const emptyForm = { question: "", option1: "", option2: "", option3: "", option4: "", answer: "" };

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8080/questions");
      setQuestions(res.data || []);
    } catch (e) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setForm({
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      answer: q.answer,
    });
    setModalOpen(true);
  };

  const onDelete = async (q) => {
    if (!window.confirm("Delete this question?")) return;
    setBusy(true);
    try {
      await axios.delete(`http://localhost:8080/questions/${q.id}`);
      await fetchQuestions();
    } catch (e) {
      alert("Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await axios.put(`http://localhost:8080/questions/${editing.id}`, form);
      } else {
        await axios.post("http://localhost:8080/questions", form);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditing(null);
      await fetchQuestions();
    } catch (e) {
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-300">Manage Questions</h1>
        <button onClick={openAdd} className="rounded-md bg-teal-600 px-4 py-2 text-[#0D1117] transition hover:bg-teal-500">
          Add Question
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-300">Loading...</div>
      ) : error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>
      ) : (
        <AdminTable questions={questions} onEdit={openEdit} onDelete={onDelete} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => !busy && setModalOpen(false)}
        title={editing ? "Edit Question" : "Add Question"}
        footer={
          <>
            <button
              onClick={() => !busy && setModalOpen(false)}
              className="rounded-md border border-white/10 px-4 py-2 text-gray-300 hover:border-cyan-400/40 hover:text-cyan-300"
              disabled={busy}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="rounded-md bg-teal-600 px-4 py-2 text-[#0D1117] transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Question</label>
            <input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/40"
              placeholder="Enter question"
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["option1", "option2", "option3", "option4"]).map((key) => (
              <div key={key}>
                <label className="mb-1 block text-sm capitalize text-gray-300">{key}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/40"
                  placeholder={`Enter ${key}`}
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Correct Answer (must match an option)</label>
            <input
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/40"
              placeholder="Exact correct answer"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
