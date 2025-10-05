import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router";
import Header from "./header";
import Footer from "./footer";

const QuizAttemptsList = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/app/quiz-attempts")
      .then(res => {
        setAttempts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

 
    if (loading) {
    return (
        <>
        <Header/>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
      </>
    );
  }
  

  // ...existing code...
return (
  <>
    <Header/>
<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
    <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
    <h2 className="text-2xl font-bold mb-6">Your Quiz Attempts</h2>
    {attempts.length === 0 ? (
      <div>No attempts found.</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attempts.map(attempt => {
          console.log(attempt)
          const percent = (attempt.score*100)/attempt.answers.length || 0
          const isLowScore = percent < 35;
          return (
            <div
              key={attempt._id}
              className={`rounded-xl shadow border p-6 transition-all duration-200 ${
                isLowScore ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{attempt.quizId?.title || "Quiz"}</h3>
              <p className="mb-1">Score: <span className={isLowScore ? "text-red-600 font-bold" : "font-bold"}>{percent}%</span></p>
              <p className="mb-2">Status: {attempt.status}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
                onClick={() => navigate(`/attempt-details/${attempt._id}`)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    )}
    </main>
  </div>

  <Footer/>
  </>
);
// ...existing code...
};
export default QuizAttemptsList;