import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/api";

function shuffle(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

export default function QuizStart() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewLater, setReviewLater] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/app/quiz/${id}/start`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuiz(res.data);
        const shuffled = shuffle(res.data.questions);
        setShuffledQuestions(shuffled);
        setEndTime(new Date(res.data.endTime));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load quiz");
      }
    };
    fetchQuiz();
  }, [id, accessToken]);

  // Timer
  useEffect(() => {
    if (!endTime || submitted) return;
    const updateTimeLeft = () => {
      const now = new Date();
      const left = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(left);
      if (left <= 10 && !submitted) {
        handleSubmit();
      }
    };
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, submitted]);

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleReviewLater = (questionId) => {
    setReviewLater((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setShowConfirm(false);
    if (!quiz) return;
    setSubmitted(true);
    try {
      const res = await axios.post(
        `/app/quiz/${id}/submit`,
        {
          answers: shuffledQuestions.map((q) => ({
            questionId: q._id,
            selectedOption: answers[q._id] || "",
          })),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      navigate("/quiz-result", {
        state: {
          score: res.data.score,
          total: shuffledQuestions.length,
          message: res.data.message,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit quiz");
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow">Loading quiz...</div>
      </div>
    );
  }

  // Sidebar tracking
  const sidebar = (
    <div className="w-48 bg-blue-50 p-4 rounded-xl shadow mr-8">
      <h3 className="font-bold mb-2">Questions</h3>
      <ul>
        {shuffledQuestions.map((q, idx) => (
          <li key={q._id} className="mb-2 flex items-center">
            <button
              className={`px-2 py-1 rounded text-xs ${
                currentIdx === idx
                  ? "bg-blue-600 text-white"
                  : answers[q._id]
                  ? "bg-green-200"
                  : reviewLater.includes(q._id)
                  ? "bg-yellow-200"
                  : "bg-gray-200"
              }`}
              onClick={() => setCurrentIdx(idx)}
              disabled={submitted}
            >
              Q{idx + 1}
            </button>
            {reviewLater.includes(q._id) && (
              <span className="ml-2 text-yellow-600">★</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  // Confirmation modal
  const confirmModal = showConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Submit Quiz?</h2>
        <p className="mb-4">Are you sure you want to submit your quiz?</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          onClick={handleSubmit}
        >
          Yes, Submit
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Main quiz view
  const q = shuffledQuestions[currentIdx];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      {confirmModal}
      <div className="flex w-full max-w-3xl">
        {sidebar}
        <div className="bg-white p-8 rounded-xl shadow w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">{quiz.title}</h2>
            <div className="text-lg font-mono bg-blue-100 px-3 py-1 rounded text-blue-700">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          <p className="mb-4 text-gray-700">{quiz.description}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
          >
            <div className="mb-6">
              <div className="font-semibold mb-2">
                {currentIdx + 1}. {q.text}
              </div>
              {q.image && (
                <img
                  src={q.image}
                  alt="Question"
                  className="mb-2 max-w-xs rounded"
                />
              )}
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleOptionChange(q._id, opt)}
                      className="form-radio text-blue-600"
                      disabled={submitted}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className={`mt-2 px-3 py-1 rounded ${
                  reviewLater.includes(q._id)
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                onClick={() => handleReviewLater(q._id)}
                disabled={submitted}
              >
                {reviewLater.includes(q._id)
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0 || submitted}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() =>
                  setCurrentIdx((i) =>
                    Math.min(shuffledQuestions.length - 1, i + 1)
                  )
                }
                disabled={currentIdx === shuffledQuestions.length - 1 || submitted}
              >
                Next
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={submitted}
              >
                Finish & Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
// ...existing code...