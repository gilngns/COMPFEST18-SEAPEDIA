import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import { MapPin, Plus, Trash2, CheckCircle, Map } from "lucide-react";
import Swal from "sweetalert2";
import { useBuyer } from "../../hooks/usecases/useBuyer";

export default function BuyerAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "",
    recipient: "",
    phone: "",
    detail: "",
    isDefault: false
  });

  const { getAddresses, addAddress, deleteAddress, setDefaultAddress } = useBuyer();

  const loadAddresses = useCallback(async () => {
    try {
      const addrs = await getAddresses();
      setAddresses(addrs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAddresses]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress(form);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Alamat ditambahkan", timer: 1500, showConfirmButton: false });
      setShowForm(false);
      setForm({ label: "", recipient: "", phone: "", detail: "", isDefault: false });
      loadAddresses();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message || err.message || "Gagal menambah alamat" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus alamat?',
      text: "Alamat ini tidak akan bisa digunakan lagi.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      try {
        await deleteAddress(id);
        Swal.fire('Terhapus!', 'Alamat telah dihapus.', 'success');
        loadAddresses();
      } catch (err) {
        Swal.fire('Gagal', err.response?.data?.message || err.message || 'Gagal menghapus alamat', 'error');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Alamat utama diperbarui", timer: 1500, showConfirmButton: false });
      loadAddresses();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message || err.message || "Gagal mengubah alamat utama" });
    }
  };

  if (loading) return <div className="text-gray-500 font-medium">Memuat alamat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Buku Alamat</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#ff8c00] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e67e00] transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Alamat Baru
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Tambah Alamat Baru</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Label (cth: Rumah, Kantor)</label>
                <input required type="text" name="label" value={form.label} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Penerima</label>
                <input required type="text" name="recipient" value={form.recipient} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. Telepon</label>
                <input required type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Lengkap</label>
                <textarea required rows="3" name="detail" value={form.detail} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] resize-none" placeholder="Nama jalan, gedung, no rumah, RT/RW, dsb..."></textarea>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="isDefault" name="isDefault" checked={form.isDefault} onChange={handleChange} className="w-4 h-4 text-[#006B7A] rounded border-gray-300 focus:ring-[#006B7A]" />
                <label htmlFor="isDefault" className="text-sm text-gray-700 font-medium cursor-pointer">Jadikan sebagai alamat utama</label>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button disabled={saving} type="submit" className="px-6 py-2 bg-[#006B7A] text-white font-bold rounded-lg hover:bg-[#005a66] transition-colors disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan Alamat"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
          <Map className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Anda belum menambahkan alamat pengiriman.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white rounded-xl p-5 border shadow-sm relative group transition-colors ${addr.isDefault ? 'border-[#006B7A] bg-[#006B7A]/5' : 'border-gray-200 hover:border-[#006B7A]/30'}`}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-[#006B7A] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Utama
                </span>
              )}
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-0.5">{addr.label}</h4>
                  <p className="text-sm font-semibold text-gray-700">{addr.recipient} <span className="font-normal text-gray-500">({addr.phone})</span></p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed pl-11 line-clamp-2">{addr.detail}</p>
              
              <div className="mt-4 pl-11 flex items-center gap-3">
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-sm font-bold text-[#006B7A] hover:underline">
                    Jadikan Utama
                  </button>
                )}
                {!addr.isDefault && <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
                <button onClick={() => handleDelete(addr.id)} className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
