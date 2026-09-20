import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  const location=useLocation();
  // ✅ Allow login page always
  if (location.pathname === "/login") {
    return children;
  }

  // ❌ Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Expired
  if (expiry && Date.now() > Number(expiry)) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // ✅ allow access
  return children;
}