import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, message } = location.state || {};

  if (score === undefined) {
    // If no result, redirect to dashboard
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Quiz Result</h2>
        <p className="text-lg mb-2">
          Your Score: <span className="font-bold text-blue-600">{score}</span>
          {total && <span> / {total}</span>}
        </p>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}