import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Card } from "../components/ui";
import Swal from "sweetalert2";

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
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data) {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
      });
      // success -> to login
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
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-seapedia">SEAPEDIA</h1>
          <p className="text-gray-500 text-sm">Create a new account to start shopping.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Username"
              placeholder="Enter username"
              {...register("username")}
              error={errors.username?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="alamat@email.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirm")}
              error={errors.confirm?.message}
            />

            <p className="font-semibold text-gray-700 mb-2 mt-2 text-sm">Select Your Role</p>
            <div className="space-y-2 mb-1">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={r.value}
                    {...register("roles")}
                    className="w-4 h-4 accent-seapedia"
                  />
                  <span className="text-gray-700 text-sm font-medium">{r.label}</span>
                </label>
              ))}
            </div>
            {errors.roles && <p className="text-red-500 text-xs mt-1.5 mb-4 font-medium">{errors.roles.message}</p>}

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Processing..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-seapedia font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}