import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Memuat...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.activeRole) return <Navigate to="/select-role" replace />;

  if (role && user.activeRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}