// src/components/seller/ProductModal.jsx
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

export default function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    unit: "",
  });
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // kalau edit, isi form dengan data produk
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        unit: product.unit || "",
      });
      if (product.imageUrl) {
        setPreview(`http://localhost:5000${product.imageUrl}`);
      }
    }
  }, [product]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      return Swal.fire({ icon: "warning", title: "Peringatan", text: "Nama produk wajib diisi" });
    }
    if (form.price === "" || Number(form.price) < 0) {
      return Swal.fire({ icon: "warning", title: "Peringatan", text: "Harga harus angka >= 0" });
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      return Swal.fire({ icon: "warning", title: "Peringatan", text: "Stok harus angka >= 0" });
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));
      formData.append("unit", form.unit);
      if (image) {
        formData.append("image", image);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        await api.put(`/seller/products/${product.id}`, formData, config);
      } else {
        await api.post("/seller/products", formData, config);
      }
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Produk berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`,
        timer: 1500,
        showConfirmButton: false,
      });
      onSaved();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.error || "Gagal menyimpan produk",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gambar Produk
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer hover:bg-gray-100 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-xs text-gray-500">
                <p>Format: JPG, PNG, WEBP.</p>
                <p>Maksimal ukuran 2MB.</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Ikan Tuna Segar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan detail produk..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Jumlah Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Satuan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="pcs, kg, dsb"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-[#006B7A] text-white font-medium hover:bg-[#005a66] disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}