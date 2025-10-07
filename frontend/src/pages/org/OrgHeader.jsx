import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PlusCircle, Rocket, LogOut, User, Home } from "lucide-react";

export default function OrgHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🔷 Brand */}
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <span className="bg-white text-blue-600 px-2 py-1 rounded-md text-sm font-semibold">
            VertoQuiz
          </span>
          <span className="hidden sm:inline">Organization Panel</span>
        </h1>

        {/* 🌐 Navigation */}
        <nav className="flex items-center gap-4">
         <Link
            to="/org-dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">dashboard</span>
          </Link>

          <Link
            to="/org/add-que"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <PlusCircle size={18} /> 
            <span className="hidden sm:inline">Add Questions</span>
          </Link>
           <Link
            to="/org-profile"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <Link
            to="/org/launch-quiz"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Rocket size={18} /> 
            <span className="hidden sm:inline">Launch Quiz</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
