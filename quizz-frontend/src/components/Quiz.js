import React, { useState, useEffect, useCallback } from "react";

function Quiz({ user }) {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8080/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
        // Fallback sample questions if backend fails
        setQuestions([
          {
            id: 1,
            question: "Which country is famous for the Eiffel Tower?",
            option1: "Italy",
            option2: "France", 
            option3: "Germany",
            option4: "Spain",
            answer: "France"
          },
          {
            id: 2,
            question: "What is the capital of Japan?",
            option1: "Beijing",
            option2: "Seoul",
            option3: "Tokyo",
            option4: "Bangkok",
            answer: "Tokyo"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleNext = useCallback(() => {
    if (questions.length === 0) return;
    
    const currentQ = questions[currentQIndex];
    if (selectedOption === currentQ.answer) {
      setScore(prev => prev + 1);
    }
    setSelectedOption("");

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setTimeLeft(15);
    } else {
      setQuizFinished(true);
    }
  }, [currentQIndex, questions, selectedOption]);

  // Timer effect
  useEffect(() => {
    if (loading || quizFinished || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQIndex, questions.length, loading, quizFinished, handleNext]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(15);
  }, [currentQIndex]);

  if (loading) return <div className="message info">Loading quiz questions...</div>;
  if (questions.length === 0 && !loading) return <div className="message error">No questions available.</div>;
  
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="score-container">
        <h2>Quiz Completed! 🎉</h2>
        <p>Great job, {user?.username}!</p>
        <div className="score-value">{score}/{questions.length}</div>
        <p>{percentage}% Correct</p>
        <button onClick={() => window.location.reload()} className="restart-button">
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];
  const options = [
    currentQuestion.option1,
    currentQuestion.option2, 
    currentQuestion.option3,
    currentQuestion.option4
  ];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="user-welcome">Welcome, {user?.username || "User"}</div>
        <div className="quiz-meta">
          <span className="question-counter">Question {currentQIndex + 1} of {questions.length}</span>
          <div className={`timer ${timeLeft <= 5 ? "warning" : ""}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="question-section">
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-list">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`option-item ${selectedOption === option ? "selected" : ""}`}
              onClick={() => setSelectedOption(option)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + idx)} {/* A, B, C, D */}
              </span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-section">
        <button 
          onClick={handleNext} 
          disabled={!selectedOption} 
          className="next-button"
        >
          {currentQIndex + 1 === questions.length ? "Complete Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;