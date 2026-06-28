import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../../components/ui";
import Swal from "sweetalert2";
import { ArrowRight, UserPlus, Lock, Mail, User, ShieldCheck } from "lucide-react";

const ROLES = [
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller" },
  { value: "DRIVER", label: "Driver" },
];

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6, "Confirm password must be at least 6 characters"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roles: [],
    }
  });

  if (user) {
    if (!user.activeRole) return <Navigate to="/select-role" replace />;
    if (user.activeRole === "SELLER") return <Navigate to="/seller" replace />;
    if (user.activeRole === "BUYER") return <Navigate to="/buyer" replace />;
    if (user.activeRole === "DRIVER") return <Navigate to="/driver" replace />;
    if (user.activeRole === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data) {
    setLoading(true);
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
      });
      
      await Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        text: "Akun Anda berhasil dibuat. Silakan login.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response 
        ? (err.response.data?.error || "Pendaftaran gagal")
        : "Tidak dapat terhubung ke server. Pastikan backend berjalan.";
        
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-sans">
      {}
      <div className="absolute inset-0 bg-[#060c17]">
        <img 
          src="/loginbg.jpg" 
          alt="Register Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        {}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08303b]/90 via-transparent to-[#060c17]/50 mix-blend-multiply"></div>
      </div>

      {}
      <div className="w-full max-w-[540px] relative z-10 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/40">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#147287] tracking-tight mb-1.5 drop-shadow-sm">SEAPEDIA</h2>
          <p className="text-gray-500 text-sm font-medium">Create a new account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Username"
              placeholder="Username"
              {...register("username")}
              error={errors.username?.message}
              iconLeft={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              }
            />
            <Input
              label="Email"
              type="email"
              placeholder="Email address"
              {...register("email")}
              error={errors.email?.message}
              iconLeft={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 8.667V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 8.667V6.75" />
                </svg>
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
              iconLeft={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              }
              iconRight={
                <div onClick={() => setShowPassword(!showPassword)} className="hover:text-[#147287] transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  )}
                </div>
              }
            />
            <Input
              label="Confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirm")}
              error={errors.confirm?.message}
              iconLeft={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              }
              iconRight={
                <div onClick={() => setShowConfirm(!showConfirm)} className="hover:text-[#147287] transition-colors cursor-pointer">
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-[1.15rem] h-[1.15rem]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  )}
                </div>
              }
            />
          </div>

          <div className="mt-4 mb-5">
            <p className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Your Role</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 cursor-pointer hover:border-[#147287]/50 hover:bg-[#147287]/5 transition-all focus-within:ring-1 focus-within:ring-[#147287]/20"
                >
                  <input
                    type="checkbox"
                    value={r.value}
                    {...register("roles")}
                    className="w-3.5 h-3.5 accent-[#147287]"
                  />
                  <span className="text-gray-700 text-sm font-semibold">{r.label}</span>
                </label>
              ))}
            </div>
            {errors.roles && <p className="text-red-500 text-xs mt-1 font-medium">{errors.roles.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="py-3 text-[15px] font-bold rounded-xl tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full mb-4">
            {loading ? "Processing..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#147287] font-bold hover:underline hover:text-[#0b3e4a] transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}