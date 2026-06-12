// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";

import { useAuth } from "./context/AuthContext";
import { Button } from "./components/ui";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-[#147287] mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">Halo, <span className="font-semibold text-gray-700">{user?.username}</span>! Kamu berhasil masuk sebagai <span className="font-semibold text-gray-700">{user?.activeRole}</span> 🎉</p>
        
        <Button onClick={logout} variant="outline" className="w-full">
          Keluar (Logout)
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<SelectRole />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}