import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// 🧭 Pages (User)
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import QuizStart from "./pages/Quizstart";
import QuizResult from "./pages/Result";
import QuizAttemptsList from "./pages/attemtsquizz";
import AttemptDetails from "./pages/AttemtsDetails";
import Profile from "./pages/Profile";
import About from "./pages/about";
import Contact from "./pages/contact";

// 🏢 Pages (Organization)
import OrgDashboard from "./pages/org/OrgDashboard";
import AddQuestions from "./pages/org/AddQuestions";
import UploadQuestions from "./pages/org/UploadQuestions";
import LaunchQuiz from "./pages/org/orgLaunchQuizz";
import QuizAttempts from "./pages/org/OrgQuizAttempts";
import OrgProfile from "./pages/org/OrgProfile";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "organization" ? "/org-dashboard" : "/dashboard"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
       <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to={user.role === "organization" ? "/org-dashboard" : "/dashboard"}
                replace
              />
            ) : (
              <Register />
            )
          }
        />


        {/* 👩‍🎓 STUDENT ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/start"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-result"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-attempts"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizAttemptsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attempt-details/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AttemptDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about-user"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🏢 ORGANIZATION ROUTES */}
        <Route
          path="/org-dashboard"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/add-que"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <AddQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/upload-que"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <UploadQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/launch-quiz"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <LaunchQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org-profile"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <OrgProfile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/quiz-attempts/:quizId"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <QuizAttempts />
            </ProtectedRoute>
          }
        />

        {/* ℹ️ Common public pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* 🚪 Default Redirect */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "organization"
                    ? "/org-dashboard"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
