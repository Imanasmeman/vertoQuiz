import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User, ListChecks, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { to: "/quiz-attempts", label: "Attempted", icon: <ListChecks className="w-4 h-4" /> },
    { to: "/about-user", label: "About User", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">VertoQuiz</h1>
          </div>

          {/* Links */}
          <div className="flex gap-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1 text-sm font-medium ${
                  location.pathname === item.to
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
