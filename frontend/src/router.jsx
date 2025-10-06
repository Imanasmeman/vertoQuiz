import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import QuizStart from "./pages/Quizstart";
import QuizResult from "./pages/Result";
import QuizAttemptsList from "./pages/attemtsquizz";

import Profile from "./pages/Profile";
import About from "./pages/about";
import Contact from "./pages/contact";
import OrgDashboard from "./pages/org/OrgDashboard";
import AddQuestions from "./pages/org/AddQuestions";
import LaunchQuiz from "./pages/org/orgLaunchQuizz";
//import ProtectedRoute from "./ProtectedRoute";
import QuizAttempts from "./pages/org/OrgQuizAttempts";
import AttemptDetails from "./pages/AttemtsDetails";
import UploadQuestions from "./pages/org/UploadQuestions";

//import OrgDashboard from "./pages/OrgDashboard"; // 👈 your organization page

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👇 Student/User routes */}
   < Route    
  path="/dashboard"
  element={
    
      <Dashboard />
    
  }
/>
          

        <Route
          path="/quiz/:id/start"
          element={
          
              <QuizStart />
           
          }
        />

        <Route
          path="/quiz-attempts"
          element={
           
              <QuizAttemptsList />
     
          }
        />


        <Route
          path="/org-dashboard"
          element={
          
              <OrgDashboard/>
            
          }
        />

  <Route
          path="/org/add-que"
          element={
         
             <AddQuestions/>
          
          }
        />
        <Route
          path="/org/launch-quiz"
          element={
            
             <LaunchQuiz/>
            
          }
        />
        <Route
          path="/quiz-attempts/:quizId"
          element={ 
            <QuizAttempts/>
          }
        />
        
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/attempt-details/:id" element={<AttemptDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-user" element={<Profile />} />
        

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
