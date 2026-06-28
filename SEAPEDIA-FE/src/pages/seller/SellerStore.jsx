import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import Swal from "sweetalert2";
import { Store, Save, UploadCloud } from "lucide-react";
import { useSeller } from "../../hooks/usecases/useSeller";

export default function SellerStore() {
  const [storeName, setStoreName] = useState("Toko Saya");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeLogo, setStoreLogo] = useState(null);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    slogan: "",
    description: "",
    city: "Jakarta",
    address: "",
    isOpen: true,
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  const { getMyStore, upsertStore } = useSeller();

  const loadStore = useCallback(async () => {
    try {
      const store = await getMyStore();
      if (store) {
        setStoreName(store.name);
        setStoreLogo(store.logoUrl);
        setForm({
          name: store.name || "",
          domain: store.domain || "",
          slogan: store.slogan || "",
          description: store.description || "",
          city: store.city || "Jakarta",
          address: store.address || "",
          isOpen: store.isOpen !== false,
        });
        if (store.logoUrl) {
          setLogoPreview(`http://localhost:5000${store.logoUrl}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMyStore]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggleStatus = () => {
    setForm({ ...form, isOpen: !form.isOpen });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Terlalu Besar",
        text: "Maksimal ukuran gambar adalah 2MB.",
      });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire({ icon: "warning", title: "Peringatan", text: "Nama toko wajib diisi." });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("domain", form.domain);
      formData.append("slogan", form.slogan);
      formData.append("description", form.description);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("isOpen", form.isOpen);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await upsertStore(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      await Swal.fire({
        icon: "success",
        title: "Tersimpan",
        text: "Profil toko berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
      
      loadStore(); 
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: err.response?.data?.message || err.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout storeName={storeName} storeLogo={storeLogo}>
        <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Memuat data toko...</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout storeName={storeName} storeLogo={storeLogo}>
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Profil Toko</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Kelola informasi publik toko Anda agar mudah ditemukan oleh pembeli.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative flex-1 flex flex-col">
        {}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-50/50 to-transparent pointer-events-none rounded-bl-[100px]"></div>
        
        <form onSubmit={handleSubmit} className="p-6 relative z-10 flex flex-col lg:flex-row gap-8 flex-1">
          
          {}
          <div className="w-full lg:w-[240px] flex-shrink-0 flex flex-col gap-5">
            <div>
              <div 
                className="w-full aspect-square bg-[#060c17] rounded-xl overflow-hidden relative group cursor-pointer border border-gray-200 shadow-sm flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Toko" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Store className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Pilih Logo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-[13px] font-semibold">Ubah Logo</span>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/gif" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <p className="text-[12px] text-gray-500 mt-2.5 leading-relaxed">
                Format: JPG, PNG, GIF.<br/>Maks. ukuran 2MB.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 text-[13px] mb-3">Status Toko</h4>
              
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${form.isOpen ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  <span className="text-[13px] font-medium text-gray-700">
                    {form.isOpen ? "Buka (Menerima Pesanan)" : "Tutup Sementara"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3.5">
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${form.isOpen ? 'bg-[#147287]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.isOpen ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <span className="text-[12px] text-gray-500">
                  {form.isOpen ? "Tutup Sementara" : "Buka Toko"}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="flex-1 flex flex-col">
            
            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama Toko Anda"
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all"
                required
              />
              <p className="text-[12px] text-[#147287] mt-1.5 font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Nama toko harus unik dan belum digunakan.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                Domain Toko <span className="text-red-500">*</span>
              </label>
              <div className="flex w-full">
                <span className="inline-flex items-center px-4 py-2 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-[14px]">
                  seapedia.com/
                </span>
                <input
                  type="text"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  placeholder="domain-toko"
                  className="flex-1 min-w-0 px-4 py-2 bg-white border border-gray-200 rounded-none rounded-r-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                Slogan Toko
              </label>
              <input
                type="text"
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
                placeholder="Misal: Kesegaran Laut di Depan Pintu Anda"
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                  Kota / Wilayah <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all"
                  required
                >
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bogor">Bogor</option>
                  <option value="Depok">Depok</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Bandung Raya">Bandung Raya</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Sidoarjo">Sidoarjo</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                  Alamat Lengkap (Untuk Penjemputan) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Misal: Jl. Mawar No. 15, RT 02/RW 03"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all"
                  required
                />
              </div>
            </div>

            <div className="mb-2 flex-1 flex flex-col">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                Deskripsi Toko
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ceritakan tentang toko Anda, produk yang dijual, dan keunggulan pelayanan..."
                className="w-full flex-1 min-h-[100px] px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#147287]/20 focus:border-[#147287] transition-all resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1.5 text-[12px] text-gray-500">
                <p>Pastikan deskripsi informatif untuk pembeli.</p>
                <p>{form.description.length} / 500</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-auto">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-lg font-bold text-[14px] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
