import { useState, useEffect } from "react";
import {
  Rocket,
  Search,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  Square,
  Mail,
  Plus,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2
} from "lucide-react";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import OrgHeader from "./OrgHeader";

export default function LaunchQuiz() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
    const {accessToken} = useAuth()

  // Quiz details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [subjects, setSubjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...questions];
    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSubject !== "all") {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    setFilteredQuestions(filtered);
  }, [searchTerm, selectedSubject, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await API.get('/org/questions', {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      const data = response.data || [];
      setQuestions(data);
      const uniqueSubjects = [...new Set(data.map(q => q.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredQuestions.map(q => q._id);
    setSelectedQuestions([...new Set([...selectedQuestions, ...filteredIds])]);
  };

  const deselectAll = () => {
    setSelectedQuestions([]);
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentEmail && emailRegex.test(currentEmail)) {
      if (!allowedUsers.includes(currentEmail)) {
        setAllowedUsers([...allowedUsers, currentEmail]);
        setCurrentEmail("");
      } else {
        alert("Email already added");
      }
    } else {
      alert("Please enter a valid email address");
    }
  };

  const removeEmail = (email) => {
    setAllowedUsers(allowedUsers.filter(e => e !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }
    if (!duration || duration <= 0) {
      alert("Please enter a valid duration");
      return;
    }
    if (!deadline) {
      alert("Please select a deadline");
      return;
    }
    if (allowedUsers.length === 0) {
      alert("Please add at least one participant email");
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/org/create-quiz', {
        title,
        description,
        questions: selectedQuestions,
        duration: parseInt(duration),
        deadline,
        allowedUsers
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert("Quiz launched successfully!");
      setTitle("");
      setDescription("");
      setDuration("");
      setDeadline("");
      setAllowedUsers([]);
      setSelectedQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <OrgHeader/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Rocket className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Launch Quiz</h1>
          </div>
          <p className="text-gray-600">Create and launch a quiz for your participants</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Quiz Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter quiz title..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter quiz description..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g., 60"
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Participants ({allowedUsers.length})
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={e => setCurrentEmail(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                    placeholder="Enter participant email..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addEmail}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
              {allowedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                  {allowedUsers.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{email}</span>
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Questions Selection Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                Select Questions ({selectedQuestions.length} selected)
              </h2>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Subject:</label>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors text-sm"
              >
                Select All Filtered
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Deselect All
              </button>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No questions found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQuestions.map(question => (
                  <div
                    key={question._id}
                    onClick={() => toggleQuestionSelection(question._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedQuestions.includes(question._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {selectedQuestions.includes(question._id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">{question.text}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                            {question.subject}
                          </span>
                          <span className="text-gray-500">
                            {question.options.length} options
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={submitting || selectedQuestions.length === 0}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Launching Quiz...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6" />
                  Launch Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
