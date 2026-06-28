import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
        setShowLoginPrompt(true);
        return;
    }

    if (!user.activeRole) {
      navigate("/select-role", { replace: true });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.activeRole)) {
      navigate("/", { replace: true });
      return;
    }

  }, [user, loading, allowedRoles, navigate]);

  if (loading) return <div className="p-8 text-center min-h-screen">Memuat...</div>;

  if (showLoginPrompt) {
      return (
          <>
              <LoginModal 
                  isOpen={true} 
                  onClose={() => {
                      setShowLoginPrompt(false);
                      navigate('/', { replace: true });
                  }} 
              />
              <div className="min-h-screen bg-gray-50/50"></div>
          </>
      );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.activeRole))) {
      return null;
  }

  return children;
}