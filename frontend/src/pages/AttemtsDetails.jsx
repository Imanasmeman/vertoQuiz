import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/api";

const AttemptDetails = () => {
  const { id } = useParams(); 
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/app/${id}/quiz-attempt-detailed`)
      .then(res => {
        setAttempt(Array.isArray(res.data) ? res.data[0] : res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!attempt) return <div>Attempt not found.</div>;
  
  const percent = attempt.score || 0;
  const isLowScore = percent < 35;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <div className={`rounded-xl shadow border p-6 ${isLowScore ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}>
        <h2 className="text-2xl font-bold mb-2">{attempt.quizId?.title || "Quiz"}</h2>
        <p className="mb-1">Score: <span className={isLowScore ? "text-red-600 font-bold" : "font-bold"}>{percent}</span></p>
        <p className="mb-2">Status: {attempt.status}</p>
        <p className="mb-4">{attempt.quizId?.description}</p>

        <h3 className="text-lg font-semibold mb-2">Questions & Answers</h3>

        <ul className="space-y-6">
          {attempt.answers.map((ans, idx) => {
            const question = ans.questionId;
            const selected = ans.selectedOption;
            const correct = question?.correctAnswer;

            return (
              <li key={idx} className="p-4 rounded-xl border bg-gray-50 shadow-sm">
                <div className="mb-2 font-medium">
                  Q{idx + 1}. {question?.text || "Question"}
                </div>

                <div className="space-y-2">
                  {question?.options?.map((opt, i) => {
                    let style = "border rounded-lg p-2";

                    if (!selected) {
                      // Unattempted
                      style += " border-gray-300 bg-white";
                    } else if (opt === correct) {
                      // Correct Answer
                      style += " border-green-500 bg-green-100";
                    } else if (opt === selected && opt !== correct) {
                      // Wrong selected answer
                      style += " border-red-500 bg-red-100";
                    } else {
                      // Neutral
                      style += " border-gray-200 bg-white";
                    }

                    return (
                      <div key={i} className={style}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2">
                  {!selected ? (
                    <span className="text-gray-500 font-semibold">Unattempted</span>
                  ) : ans.isCorrect ? (
                    <span className="text-green-600 font-semibold">Correct</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Incorrect</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AttemptDetails;
