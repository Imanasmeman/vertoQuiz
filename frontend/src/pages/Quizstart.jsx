import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "../api/api";
import { BookOpen } from "lucide-react";

// Shuffle function
function shuffle(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

const LEGEND = [
  { label: "Answered", color: "bg-green-300", shape: "rounded-full" },
  { label: "Marked for Review & Answered", color: "bg-orange-300", shape: "rounded-full" },
  { label: "Marked for Review (No Answer)", color: "bg-yellow-300", shape: "rounded-full" },
  { label: "Unanswered", color: "bg-gray-200", shape: "rounded" },
];

export default function QuizStart() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(`quiz-${id}-answers`) || "{}"));
  const [reviewLater, setReviewLater] = useState(() => JSON.parse(localStorage.getItem(`quiz-${id}-reviewLater`) || "[]"));
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/app/quiz/${id}/start`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuiz(res.data);
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

  useEffect(() => {
    if (!endTime || submitted) return;
    const updateTimeLeft = () => {
      const now = new Date();
      const left = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(left);
      if (left <= 0 && !submitted) handleSubmit();
    };
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, submitted]);

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
      setSubmitted(false);
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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
        <div className="bg-white p-6 rounded shadow text-center w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Submit Quiz?</h2>
          <p className="mb-4">Are you sure you want to submit your quiz?</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
              Yes, Submit
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

  const getBtnStyle = (idx, qid) => {
    if (currentIdx === idx) return "bg-blue-600 text-white rounded-full";
    if (reviewLater.includes(qid) && answers[qid]) return "bg-orange-300 text-black rounded-full";
    if (reviewLater.includes(qid)) return "bg-yellow-300 text-black rounded-full";
    if (answers[qid]) return "bg-green-300 text-black rounded-full";
    return "bg-gray-200 text-black rounded";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navbar */}
      <header className="bg-white shadow px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg sm:text-xl font-bold text-blue-700">Quiz Platform</h1>
        </div>
        <div className="text-base sm:text-lg font-mono bg-blue-100 px-3 py-1 rounded text-blue-700">
          Time Left: {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col md:flex-row flex-1 w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-3 sm:px-4 gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-blue-50 p-4 rounded-xl shadow h-fit order-2 md:order-1">
          <h3 className="font-bold mb-2">Questions</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-4 gap-2 mb-6">
            {shuffledQuestions.map((question, idx) => (
              <button
                key={question._id}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${getBtnStyle(
                  idx,
                  question._id
                )}`}
                onClick={() => setCurrentIdx(idx)}
                disabled={submitted}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-2 mb-2">
            <h4 className="font-semibold mb-2 text-gray-900">Legend</h4>
            <div className="flex flex-col gap-2 text-sm">
              {LEGEND.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`inline-block w-4 h-4 ${item.color} ${item.shape} border border-gray-300`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow w-full order-1 md:order-2">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">{quiz.title}</h2>
          <p className="mb-4 text-gray-700 text-sm sm:text-base">{quiz.description}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!submitted) setShowConfirm(true);
            }}
          >
            <div className="mb-6">
              <div className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
                {currentIdx + 1}. {q.text}
              </div>
              {q.image && <img src={q.image} alt="Question" className="mb-2 max-w-full sm:max-w-xs rounded" />}
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
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
                className={`mt-3 px-3 py-1 rounded text-sm sm:text-base ${
                  reviewLater.includes(q._id)
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                onClick={() => handleReviewLater(q._id)}
                disabled={submitted}
              >
                {reviewLater.includes(q._id) ? "Unmark Review" : "Mark for Review"}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap justify-between gap-2 sm:gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded text-sm sm:text-base"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0 || submitted}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded text-sm sm:text-base"
                onClick={() => setCurrentIdx((i) => Math.min(shuffledQuestions.length - 1, i + 1))}
                disabled={currentIdx === shuffledQuestions.length - 1 || submitted}
              >
                Next
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
