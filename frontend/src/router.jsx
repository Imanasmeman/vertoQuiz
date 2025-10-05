import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/register";
import QuizStart from "./pages/QuizStart";
import QuizResult from "./pages/Result";
import QuizAttemptsList from "./pages/attemtsquizz";
import AttemptDetails from "./pages/AttemtsDetails";
import Profile from "./pages/Profile";
import About from "./pages/about";
import Contact from "./pages/contact";

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();
 if (loading) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }
  return accessToken ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
      <Route
          path="/quiz/:id/start"
          element={
            <ProtectedRoute>
              <QuizStart/>
            </ProtectedRoute>
          }
        />
        <Route path="/about-user" element={<Profile/>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz-attempts" element={
      <ProtectedRoute>
        <QuizAttemptsList/>
      </ProtectedRoute>}
       />
         <Route path="/quiz-result" element={<QuizResult />} />
         <Route path="/attempt-details/:id"  element={<AttemptDetails/>}/> 
         <Route path="/about"  element={<About/>}/>
         <Route path="/contact"  element={<Contact/>}/>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}