import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "../api/api";
import { BookOpen } from "lucide-react";
//updated
function shuffle(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

const LEGEND = [
  {
    label: "Answered",
    color: "bg-green-300",
    shape: "rounded-full", // circle
  },
  {
    label: "Marked for Review & Answered",
    color: "bg-orange-300",
    shape: "rounded-full", // circle
  },
  {
    label: "Marked for Review (No Answer)",
    color: "bg-yellow-300",
    shape: "rounded-full", // circle
  },
  {
    label: "Unanswered",
    color: "bg-gray-200",
    shape: "rounded", // square
  },
];

export default function QuizStart() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem(`quiz-${id}-answers`) || "{}")
  );
  const [reviewLater, setReviewLater] = useState(
    () => JSON.parse(localStorage.getItem(`quiz-${id}-reviewLater`) || "[]")
  );

  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/app/quiz/${id}/start`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuiz(res.data);

        // Keep shuffled order consistent
        const stored = JSON.parse(localStorage.getItem(`quiz-${id}-questions`));
        if (stored) {
          setShuffledQuestions(stored);
        } else {
          const shuffled = shuffle(res.data.questions);
          setShuffledQuestions(shuffled);
          localStorage.setItem(`quiz-${id}-questions`, JSON.stringify(shuffled));
        }

        setEndTime(new Date(res.data.endTime));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load quiz");
      }
    };
    fetchQuiz();
  }, [id, accessToken]);

  // Timer - submit only if time runs out and quiz not submitted yet
  useEffect(() => {
    if (!endTime || submitted) return;
    const updateTimeLeft = () => {
      const now = new Date();
      const left = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(left);
      if (left <= 0 && !submitted) {
        // Only auto submit on timeout
        handleSubmit();
      }
    };
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, submitted]);

  // Warn user before unload (back/navigation/close) if quiz incomplete
  useEffect(() => {
    const beforeUnloadHandler = (e) => {
      if (!submitted && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => window.removeEventListener("beforeunload", beforeUnloadHandler);
  }, [submitted, timeLeft]);

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleOptionChange = (questionId, selectedOption) => {
    const updated = { ...answers, [questionId]: selectedOption };
    setAnswers(updated);
    localStorage.setItem(`quiz-${id}-answers`, JSON.stringify(updated));
  };

  const handleReviewLater = (questionId) => {
    setReviewLater((prev) => {
      let updated;
      if (prev.includes(questionId)) {
        updated = prev.filter((qid) => qid !== questionId);
      } else {
        updated = [...prev, questionId];
      }
      localStorage.setItem(`quiz-${id}-reviewLater`, JSON.stringify(updated));
      return updated;
    });
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

      // Clear storage after submission
      localStorage.removeItem(`quiz-${id}-answers`);
      localStorage.removeItem(`quiz-${id}-questions`);
      localStorage.removeItem(`quiz-${id}-reviewLater`);

      navigate("/quiz-result", {
        state: {
          score: res.data.score,
          total: shuffledQuestions.length,
          message: res.data.message,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit quiz");
      setSubmitted(false); // Allow retry on error
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow">Quiz no more available for attempt</div>
      </div>
    );
  }

  const q = shuffledQuestions[currentIdx];

  const confirmModal =
    showConfirm && (
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

  const getBtnStyle = (idx, qid) => {
    if (currentIdx === idx) return "bg-blue-600 text-white rounded-full"; // current
    if (reviewLater.includes(qid) && answers[qid])
      return "bg-orange-300 text-black rounded-full"; // review + answered
    if (reviewLater.includes(qid)) return "bg-yellow-300 text-black rounded-full"; // only review
    if (answers[qid]) return "bg-green-300 text-black rounded-full"; // answered
    return "bg-gray-200 text-black rounded"; // untouched
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navbar */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-blue-700">Quiz Platform</h1>
        </div>
        <div className="text-lg font-mono bg-blue-100 px-3 py-1 rounded text-blue-700">
          Time Left: {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 w-full max-w-6xl mx-auto mt-6 px-4">
        {/* Sidebar */}
        <div className="w-64 bg-blue-50 p-4 rounded-xl shadow mr-8 h-fit">
          <h3 className="font-bold mb-2">Questions</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {shuffledQuestions.map((question, idx) => (
              <button
                key={question._id}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${getBtnStyle(
                  idx,
                  question._id
                )}`}
                onClick={() => setCurrentIdx(idx)}
                disabled={submitted}
                title={
                  reviewLater.includes(question._id) && answers[question._id]
                    ? "Review & Answered"
                    : reviewLater.includes(question._id)
                    ? "Marked for Review"
                    : answers[question._id]
                    ? "Answered"
                    : "Unanswered"
                }
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 mb-2">
            <h4 className="font-semibold mb-2 text-gray-900">Legend</h4>
            <div className="flex flex-col gap-2">
              {LEGEND.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className={`inline-block w-4 h-4 ${item.color} ${item.shape} border border-gray-300`}
                  />
                  <span className="text-sm text-gray-800">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              • <span className="font-bold">Circle</span>: Answered or Marked for Review
              <br /> • <span className="font-bold">Square</span>: Untouched
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow w-full mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">{quiz.title}</h2>
          <p className="mb-4 text-gray-700">{quiz.description}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!submitted) {
                setShowConfirm(true);
              }
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
                  <label
                    key={i}
                    className="flex items-center gap-2 cursor-pointer"
                  >
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

            {/* Navigation */}
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
                  setCurrentIdx((i) => Math.min(shuffledQuestions.length - 1, i + 1))
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
      </main>

      {confirmModal}
    </div>
  );
}
