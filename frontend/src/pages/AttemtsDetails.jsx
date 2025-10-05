import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/api";
import Header from "./header";
import Footer from "./footer";

const AttemptDetails = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/app/${id}/quiz-attempt-detailed`)
      .then((res) => {
        setAttempt(Array.isArray(res.data) ? res.data[0] : res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  if (!attempt)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Attempt not found.</p>
      </div>
    );

  const percent = (attempt.score*100)/attempt.answers.length || 0;
  const isLowScore = percent < 35;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <button
          className="mb-8 px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>

        <div
          className={`rounded-2xl shadow-lg border p-8 ${
            isLowScore ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
          }`}
        >
          <h2 className="text-3xl font-extrabold mb-3 text-gray-900">
            {attempt.quizId?.title || "Quiz"}
          </h2>
          <p className="mb-1 text-lg">
            Score:{" "}
            <span
              className={`font-semibold ${
                isLowScore ? "text-red-700" : "text-green-700"
              }`}
            >
              {percent}%
            </span>
          </p>
          <p className="mb-4 font-medium text-gray-700">
            Status:{" "}
            <span className="capitalize">{attempt.status}</span>
          </p>
          <p className="mb-8 text-gray-600">{attempt.quizId?.description}</p>

          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            Questions & Answers
          </h3>

          <ul className="space-y-8">
            {attempt.answers.map((ans, idx) => {
              const question = ans.questionId || {};
              const selected = ans.selectedOption;
              const correct = question.correctAnswer;

              return (
                <li
                  key={idx}
                  className="p-6 rounded-xl border bg-gray-50 shadow-sm"
                >
                  <div className="mb-3 font-semibold text-gray-900 text-lg">
                    Q{idx + 1}. {question.text || "Question text unavailable"}
                  </div>

                  <div className="space-y-3">
                    {question.options?.map((opt, i) => {
                      let style =
                        "border rounded-lg p-3 font-medium select-none";

                      if (opt === correct) {
                        // Correct answer highlighted in green bg and border
                        style += " border-green-600 bg-green-100";
                      } else if (opt === selected && opt !== correct) {
                        // Wrong selected answer highlighted in red
                        style += " border-red-600 bg-red-100 line-through";
                      } else {
                        // Neutral style
                        style += " border-gray-300 bg-white";
                      }

                      // Dim unselected incorrect options for clarity
                      if (
                        selected &&
                        opt !== selected &&
                        opt !== correct
                      ) {
                        style += " text-gray-500";
                      }

                      return (
                        <div key={i} className={style}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 font-semibold text-lg">
                    {!selected ? (
                      <span className="text-gray-500 italic">
                        Unattempted — Correct answer shown in green
                      </span>
                    ) : ans.isCorrect ? (
                      <span className="text-green-700">Correct</span>
                    ) : (
                      <span className="text-red-700">Incorrect</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AttemptDetails;
