import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function UploadQuestions() {
  const { accessToken } = useAuth();
  const [questions, setQuestions] = useState([
    { text: "", subject: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", subject: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    try {
      const res = await axios.post(
        "http://localhost:5000/org/bulk-add-que",
        { questions },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMsg(res.data.msg);
      setQuestions([{ text: "", subject: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload Quiz Questions</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
              placeholder="Enter question text"
              className="w-full border p-2 rounded mb-3"
              required
            />

            <input
              type="text"
              value={q.subject}
              onChange={(e) => handleQuestionChange(qIndex, "subject", e.target.value)}
              placeholder="Subject"
              className="w-full border p-2 rounded mb-3"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  className="border p-2 rounded"
                  required
                />
              ))}
            </div>

            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(qIndex, "correctAnswer", e.target.value)
              }
              placeholder="Correct Answer"
              className="w-full border p-2 rounded mt-3"
              required
            />
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            + Add Another
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload All"}
          </button>
        </div>
      </form>

      {msg && <p className="text-center mt-4 text-green-600 font-medium">{msg}</p>}
    </div>
  );
}
