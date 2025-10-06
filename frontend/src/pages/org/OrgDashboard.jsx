import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Loader2, ClipboardList } from "lucide-react";
import OrgHeader from "./OrgHeader";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function OrgDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get("/org/quizzes", {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <OrgHeader />
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="text-blue-600 w-6 h-6" />
          <h2 className="text-2xl font-semibold text-gray-800">My Quizzes</h2>
        </div>

        {quizzes.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            No quizzes created yet. <br />
            <span className="text-sm">Start by adding your first quiz!</span>
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => navigate(`/quiz-attempts/${quiz._id}`)}
                className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition p-5 border border-gray-100 hover:border-blue-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {quiz.title}
                  </h3>
                  <FileQuestion className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {quiz.description || "No description provided."}
                </p>
                <p className="text-sm text-gray-500">
                  Questions:{" "}
                  <span className="font-medium">{quiz.questions.length}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
