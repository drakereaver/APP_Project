import React, { useEffect, useState } from "react";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    id: null,
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
  });

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:8080/questions");
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const url = form.id 
      ? `http://localhost:8080/questions/${form.id}` 
      : "http://localhost:8080/questions";
    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert(form.id ? "Question updated!" : "Question added!");
        setForm({ 
          id: null, 
          question: "", 
          option1: "", 
          option2: "", 
          option3: "", 
          option4: "", 
          answer: "" 
        });
        fetchQuestions();
      } else {
        alert("Error saving question: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleEdit = (q) => {
    setForm(q);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Fixed: Open confirmation modal instead of using window.confirm
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const res = await fetch(`http://localhost:8080/questions/${deleteId}`, { 
        method: "DELETE" 
      });
      const data = await res.json();
      if (data.success) {
        alert("Question deleted!");
        setDeleteId(null);
        fetchQuestions();
      } else {
        alert("Error deleting question.");
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const clearForm = () => {
    setForm({
      id: null,
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    });
  };

  if (loading) return <div className="message info">Loading questions...</div>;

  return (
    <div className="admin-container">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this question?</p>
            <div className="modal-buttons">
              <button className="admin-button primary" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button 
                className="admin-button secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage quiz questions</p>
      </div>

      <div className="admin-content">
        <form onSubmit={handleAddOrUpdate} className="admin-form">
          <h3>{form.id ? "Update Question" : "Add New Question"}</h3>
          
          <div className="form-group">
            <label>Question:</label>
            <input 
              type="text" 
              name="question" 
              placeholder="Enter question text" 
              value={form.question} 
              onChange={handleChange} 
              required 
              className="admin-input"
            />
          </div>

          <div className="options-grid">
            <div className="form-group">
              <label>Option 1:</label>
              <input 
                type="text" 
                name="option1" 
                placeholder="Option 1" 
                value={form.option1} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label>Option 2:</label>
              <input 
                type="text" 
                name="option2" 
                placeholder="Option 2" 
                value={form.option2} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label>Option 3:</label>
              <input 
                type="text" 
                name="option3" 
                placeholder="Option 3" 
                value={form.option3} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label>Option 4:</label>
              <input 
                type="text" 
                name="option4" 
                placeholder="Option 4" 
                value={form.option4} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correct Answer:</label>
            <input 
              type="text" 
              name="answer" 
              placeholder="Enter the correct answer" 
              value={form.answer} 
              onChange={handleChange} 
              required 
              className="admin-input"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-button primary">
              {form.id ? "Update Question" : "Add Question"}
            </button>
            {form.id && (
              <button type="button" onClick={clearForm} className="admin-button secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="questions-section">
          <h3>All Questions ({questions.length})</h3>
          
          {questions.length === 0 ? (
            <div className="message info">No questions found. Add your first question above.</div>
          ) : (
            <div className="questions-table-container">
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Options</th>
                    <th>Answer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.id}>
                      <td className="id-cell">{q.id}</td>
                      <td className="question-cell">{q.question}</td>
                      <td className="options-cell">
                        <div className="options-list">
                          <span>A: {q.option1}</span>
                          <span>B: {q.option2}</span>
                          <span>C: {q.option3}</span>
                          <span>D: {q.option4}</span>
                        </div>
                      </td>
                      <td className="answer-cell">{q.answer}</td>
                      <td className="actions-cell">
                        <button 
                          onClick={() => handleEdit(q)} 
                          className="action-button edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => confirmDelete(q.id)} 
                          className="action-button delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;