import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User, ListChecks, Home, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMobileOpen(false); // Close mobile menu on logout
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

          {/* Desktop Links */}
          <div className="hidden sm:flex gap-6 items-center">
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

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)} // Close menu on link click
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
      )}
    </nav>
  );
};

export default Header;
