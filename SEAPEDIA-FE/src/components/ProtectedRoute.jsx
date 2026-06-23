import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Memuat...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.activeRole) return <Navigate to="/select-role" replace />;

  if (allowedRoles && !allowedRoles.includes(user.activeRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}