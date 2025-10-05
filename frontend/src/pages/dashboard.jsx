import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useNavigate } from 'react-router';
import { BookOpen, Clock, Calendar, Building2 } from 'lucide-react';
import Header from './header';
import Footer from './footer';

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        // fetch all quizzes
        const quizRes = await api.get('app/all-quiz', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // fetch attempts
        const attemptRes = await api.get('app/quiz-attempts', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setQuizzes(quizRes.data);
        setAttempts(attemptRes.data);
      } catch (err) {
        setError('Failed to load quizzes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Separate attempts by status
  const inProgressAttempts = attempts.filter((a) => a.status === 'in-progress');
  const attemptedQuizIds = attempts.map((a) => a.quizId?._id || a.quizId);

  // Quizzes not attempted or in progress
  const availableQuizzes = quizzes.filter(
    (q) => !attemptedQuizIds.includes(q.id || q._id)
  );

  // Quizzes that are in progress from attempts
  const inProgressQuizzes = inProgressAttempts
    .map((attempt) => quizzes.find((q) => q.id === attempt.quizId || q._id === attempt.quizId))
    .filter(Boolean);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/start`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header Navbar */}
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* In Progress Quizzes Section */}
        {inProgressQuizzes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">In Progress Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressQuizzes.map((quiz) => {
                const attemptInfo = attempts.find(
                  (a) => a.quizId?._id === quiz.id || a.quizId === quiz._id
                );
                const statusLabel = attemptInfo?.status || 'In Progress';

                return (
                  <div
                    key={quiz.id || quiz._id}
                    className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                    <p className="text-gray-700 mb-4">{quiz.description}</p>
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                        {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz.id || quiz._id)}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Quizzes Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Quizzes</h2>
          <p className="text-gray-600 mb-6">Only quizzes not yet attempted are shown here.</p>

          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : availableQuizzes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No New Quizzes</h3>
              <p className="text-gray-600">You have attempted all available quizzes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuizzes.map((quiz) => (
                <div
                  key={quiz.id || quiz._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Due: {formatDate(quiz.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>{quiz.organization}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz.id || quiz._id)}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
