import React from "react";
import Header from "./header";
import { BookOpen, Users, Target, CheckCircle } from "lucide-react";
import Footer from "./footer";

export default function About() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center px-6 py-12">
        <div className="max-w-4xl text-center">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            About Our Quiz Platform
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Our Quiz App is designed to make learning interactive, engaging, and effective.
            Whether you are a student testing your knowledge or an organization assessing
            candidates, our platform provides a smooth and user-friendly experience.
          </p>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex items-start gap-4">
              <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Interactive Quizzes</h3>
                <p className="text-gray-600">
                  Attempt quizzes with multiple-choice questions, instant results, and
                  detailed feedback for continuous improvement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-pink-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">For Students & Organizations</h3>
                <p className="text-gray-600">
                  Students can test their skills, while organizations can assign and track
                  assessments easily.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Track Your Progress</h3>
                <p className="text-gray-600">
                  Monitor your quiz attempts, analyze scores, and identify areas of
                  improvement over time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Easy to Use</h3>
                <p className="text-gray-600">
                  A clean interface designed to help you focus on learning without
                  distractions.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12">
            <p className="text-gray-500">
              🚀 Start your journey today and make learning fun with our Quiz App.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
