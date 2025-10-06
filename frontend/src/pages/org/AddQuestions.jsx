import { useState } from "react";
import { Plus, Upload, Trash2, Send, FileJson, CreditCard as Edit3, BookOpen, CheckCircle2, X } from "lucide-react";
import OrgHeader from "./OrgHeader";

export default function AddQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("manual"); // 'manual' or 'bulk'
  const optionLabels = ["A", "B", "C", "D"];

  // Handle JSON bulk upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (!json.questions || !Array.isArray(json.questions)) {
          alert("Invalid JSON structure. Must have 'questions' array.");
          return;
        }
        const formatted = json.questions.map((q) => ({
          text: q.text || "",
          subject: q.subject || "",
          options: q.options || ["", "", "", ""],
          correctAnswer: q.correctAnswer || "A",
        }));
        setQuestions(formatted);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Add new manual question
  const addManualQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", subject: "", options: ["", "", "", ""], correctAnswer: "A" },
    ]);
  };

  // Remove question
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Edit question
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1]);
      newQuestions[index].options[optionIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  // Submit all questions
  const handleSubmit = async () => {
    if (!questions.length) return;
    setLoading(true);
    try {
      // await API.post("/org/add-questions", { questions });
      // Simulated success for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Questions added successfully!");
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Failed to add questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <OrgHeader/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Question Manager</h1>
          </div>
          <p className="text-gray-600">Create and manage exam questions efficiently</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              mode === "manual"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
            onClick={() => setMode("manual")}
          >
            <Edit3 className="w-5 h-5" />
            Add Manually
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              mode === "bulk"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
            onClick={() => setMode("bulk")}
          >
            <FileJson className="w-5 h-5" />
            Bulk Upload
          </button>
        </div>

        {/* Bulk Upload */}
        {mode === "bulk" && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload JSON File</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Select a JSON file containing your questions. The file should have a 'questions' array with text, subject, options, and correctAnswer fields.
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl">
                  <Upload className="w-5 h-5" />
                  Choose File
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Manual Add */}
        {mode === "manual" && (
          <div className="mb-8 text-center">
            <button
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={addManualQuestion}
            >
              <Plus className="w-5 h-5" />
              Add New Question
            </button>
          </div>
        )}

        {/* Display Questions */}
        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200">
              <p className="text-gray-700 font-medium">
                Total Questions: <span className="text-blue-600 font-bold">{questions.length}</span>
              </p>
            </div>

            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-100 relative"
              >
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                  title="Remove question"
                >
                  <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Question Number Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <BookOpen className="w-4 h-4" />
                  Question {index + 1}
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your question here..."
                      value={q.text}
                      onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mathematics, Science, History..."
                      value={q.subject}
                      onChange={(e) => handleQuestionChange(index, "subject", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                      required
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-semibold rounded-lg flex-shrink-0">
                            {optionLabels[i]}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${optionLabels[i]}`}
                            value={opt}
                            onChange={(e) =>
                              handleQuestionChange(index, `option-${i}`, e.target.value)
                            }
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <label className="font-medium text-gray-700">Correct Answer:</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(index, "correctAnswer", e.target.value)
                      }
                      className="px-4 py-2 border-2 border-green-300 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors outline-none font-medium text-green-700"
                    >
                      {optionLabels.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit All Questions
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {questions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Yet</h3>
            <p className="text-gray-500">
              {mode === "manual"
                ? "Click 'Add New Question' to start creating questions manually"
                : "Upload a JSON file to import multiple questions at once"}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
