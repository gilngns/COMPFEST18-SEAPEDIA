import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Card } from "../components/ui";

const ROLES = [
  { value: "BUYER", label: "Pembeli (Buyer)" },
  { value: "SELLER", label: "Penjual (Seller)" },
  { value: "DRIVER", label: "Mitra Kurir (Driver)" },
];

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirm: z.string().min(6, "Konfirmasi sandi minimal 6 karakter"),
  roles: z.array(z.string()).min(1, "Pilih minimal satu peran"),
}).refine((data) => data.password === data.confirm, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirm"],
});

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    if (!user.activeRole) return <Navigate to="/select-role" replace />;
    return <Navigate to="/dashboard" replace />;
  }

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

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
      });
      // sukses → ke login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-seapedia">SEAPEDIA</h1>
          <p className="text-gray-500 text-sm">Daftar akun baru untuk mulai berbelanja.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nama Pengguna"
              placeholder="Masukkan nama pengguna"
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
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              placeholder="••••••••"
              {...register("confirm")}
              error={errors.confirm?.message}
            />

            <p className="font-semibold text-gray-700 mb-2 mt-2 text-sm">Pilih Peran Anda</p>
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

            {error && <p className="text-red-500 text-sm mb-3 mt-4">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="text-seapedia font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}