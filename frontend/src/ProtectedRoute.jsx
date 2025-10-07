import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
    console.log("Auth Loading:", user);

     // 🕐 While checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Checking session...
      </div>
    );
  }

  // 🚫 If not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log("User Role:", user.role);
  // 🔒 If role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "organization" ? "/org-dashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Allowed access
  return children;
}
