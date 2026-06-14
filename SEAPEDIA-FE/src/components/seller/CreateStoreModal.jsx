import { useState } from "react";
import api from "../../lib/api";
import { Store } from "lucide-react";
import Swal from "sweetalert2";

export default function CreateStoreModal({ onCreated }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      return Swal.fire({ icon: "warning", title: "Peringatan", text: "Nama toko wajib diisi!" });
    }

    setLoading(true);
    try {
      const res = await api.post("/seller/store", form);
      Swal.fire({
        icon: "success",
        title: "Toko Dibuat!",
        text: "Selamat, toko Anda berhasil dibuat.",
        timer: 1500,
        showConfirmButton: false,
      });
      onCreated(res.data.data); // kasih tau parent toko udah jadi
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.error || "Gagal membuat toko",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    // overlay - gak bisa diklik tutup (wajib bikin toko)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        {/* header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-seapedia-light flex items-center justify-center mb-3">
            <Store className="w-7 h-7 text-seapedia" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Buat Toko Kamu</h2>
          <p className="text-gray-500 text-sm mt-1">
            Sebelum berjualan, buat profil toko kamu dulu.
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama Toko
            </label>
            <input
              type="text"
              placeholder="cth: Bahari Jaya Store"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seapedia"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Nama toko harus unik dan tidak bisa sama dengan toko lain.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Deskripsi (opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Ceritakan tentang toko kamu..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-seapedia resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seapedia text-white py-2.5 rounded-lg font-semibold hover:bg-seapedia-dark disabled:opacity-50"
          >
            {loading ? "Membuat..." : "Buat Toko"}
          </button>
        </form>
      </div>
    </div>
  );
}