import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

export default function Login() {
  const navigate = useNavigate();
  const { setSession, user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    if (!user.activeRole) return <Navigate to="/select-role" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { user, roles, activeRole, needRoleSelection } = res.data;

      if (needRoleSelection) {
        setSession({ ...user, roles, activeRole: null });
        navigate("/select-role");
      } else {
        setSession({ ...user, roles, activeRole });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-sans">
      {/* Gambar Background Penuh */}
      <div className="absolute inset-0 bg-[#060c17]">
        <img 
          src="/loginbg.jpg" 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        {/* Overlay gradient untuk memastikan teks form tetap terbaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08303b]/90 via-transparent to-[#060c17]/50 mix-blend-multiply"></div>
      </div>

      {/* Form Card di Tengah dengan efek Glassmorphism */}
      <div className="w-full max-w-[420px] relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/40">
        <div className="text-center mb-8">
          <h2 className="text-[2.25rem] font-extrabold text-[#147287] tracking-tight mb-2 drop-shadow-sm">SEAPEDIA</h2>
          <p className="text-gray-500 text-[15px] font-medium">Welcome back</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
            iconLeft={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
          />
          
          <div className="mb-7">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              error={errors.password?.message}
              iconLeft={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              }
              iconRight={
                <div onClick={() => setShowPassword(!showPassword)} className="hover:text-seapedia transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </div>
              }
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-5 text-center font-medium bg-red-50/90 py-3 px-4 rounded-xl border border-red-200">{error}</p>}
          
          <Button type="submit" variant="primary" disabled={loading} className="py-3.5 text-[15px] font-bold rounded-xl tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full mb-8">
            {loading ? "Processing..." : "Sign In Now"}
          </Button>
        </form>

        <p className="text-center text-[14.5px] text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#147287] font-bold hover:underline hover:text-[#0b3e4a] transition-colors">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}