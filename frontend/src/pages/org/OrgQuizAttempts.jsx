import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UserCircle2, Trophy } from "lucide-react";
import API from "../../api/api";

export default function QuizAttempts() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await API.get('/org/questions', {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  }
});

        setAttempts(res.data); // ✅ data is an array of attempts
        console.log("Fetched Attempts:", res.data);
      } catch (err) {
        console.error("Error fetching attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <ArrowLeft
          className="w-5 h-5 mb-3 cursor-pointer text-blue-600"
          onClick={() => navigate(-1)}
        />
        <p>No attempts found for this quiz.</p>
      </div>
    );
  }

  // Get quiz info from first attempt
  const quizTitle = attempts[0]?.quizId?.title || "Unknown Quiz";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </button>

        {/* 🧩 Quiz Info */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            {quizTitle}
          </h2>
          <p className="text-gray-500 text-sm">
            Total Attempts: <strong>{attempts.length}</strong>
          </p>
        </div>

        {/* 📊 Attempts Table */}
        <h3 className="text-xl font-semibold mb-3">All Attempts</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">End Time</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr
                  key={attempt._id || index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-gray-500" />
                    {attempt.userId?.name || "Unknown"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {attempt.userId?.email || "-"}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    {attempt.score ?? "N/A"}
                  </td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        attempt.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : attempt.status === "blocked"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {attempt.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(attempt.startTime).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(attempt.endTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
