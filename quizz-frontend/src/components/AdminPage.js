import React, { useState, useEffect } from "react";

function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:8080/questions");
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      alert("Error loading questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  // ✅ Update handler for input changes
  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // ✅ Fixed: Use PUT method with correct URL format
  const handleUpdate = async (q) => {
    try {
      const res = await fetch(`http://localhost:8080/questions/${q.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          answer: q.answer
        })
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }
      
      alert("✅ Question updated successfully");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update question: " + err.message);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/questions/${id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Delete failed");
      }
      
      alert("✅ Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete question: " + err.message);
    }
  };

  if (loading) return <div className="message info">Loading questions...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage quiz questions</p>
      </div>

      {questions.length === 0 ? (
        <div className="message">No questions available</div>
      ) : (
        questions.map((q, idx) => (
          <div className="admin-form" key={q.id || idx}>
            <h3>Question {idx + 1} (ID: {q.id})</h3>

            <input
              className="admin-input"
              value={q.question}
              onChange={(e) => handleChange(idx, "question", e.target.value)}
              placeholder="Question text"
            />
            <input
              className="admin-input"
              value={q.option1}
              onChange={(e) => handleChange(idx, "option1", e.target.value)}
              placeholder="Option 1"
            />
            <input
              className="admin-input"
              value={q.option2}
              onChange={(e) => handleChange(idx, "option2", e.target.value)}
              placeholder="Option 2"
            />
            <input
              className="admin-input"
              value={q.option3}
              onChange={(e) => handleChange(idx, "option3", e.target.value)}
              placeholder="Option 3"
            />
            <input
              className="admin-input"
              value={q.option4}
              onChange={(e) => handleChange(idx, "option4", e.target.value)}
              placeholder="Option 4"
            />
            <input
              className="admin-input"
              value={q.answer}
              onChange={(e) => handleChange(idx, "answer", e.target.value)}
              placeholder="Correct Answer"
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="admin-button"
                onClick={() => handleUpdate(q)}
              >
                💾 Save Changes
              </button>
              <button
                className="admin-button"
                style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}
                onClick={() => handleDelete(q.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPage;