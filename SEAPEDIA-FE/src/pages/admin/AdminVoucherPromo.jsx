import { useState, useEffect } from "react";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { Ticket, Tag, Plus, Calendar, Percent, DollarSign } from "lucide-react";

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

export default function AdminVoucherPromo() {
    const [activeTab, setActiveTab] = useState("VOUCHER"); 
    const [vouchers, setVouchers] = useState([]);
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        amount: "",
        isPercent: false,
        expiryDate: "",
        remainingUsage: ""
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [vRes, pRes] = await Promise.all([
                api.get("/admin/vouchers"),
                api.get("/admin/promos")
            ]);
            setVouchers(vRes.data.data);
            setPromos(pRes.data.data);
        } catch (error) {
            console.error("Failed to load discount data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === "VOUCHER" ? "/admin/vouchers" : "/admin/promos";
            
            
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                isPercent: Boolean(formData.isPercent),
            };
            
            if (activeTab === "VOUCHER") {
                payload.remainingUsage = Number(formData.remainingUsage);
            }

            await api.post(endpoint, payload);
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: `${activeTab} berhasil dibuat!`
            });
            
            setIsFormOpen(false);
            setFormData({ code: "", description: "", amount: "", isPercent: false, expiryDate: "", remainingUsage: "" });
            loadData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error?.response?.data?.message || 'Terjadi kesalahan'
            });
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Diskon</h2>
                    <p className="text-gray-500 mt-1 text-sm">Kelola kode Voucher dan Promo untuk sistem Seapedia.</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-[#006B7A] hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Buat {activeTab === "VOUCHER" ? "Voucher" : "Promo"} Baru
                </button>
            </div>

            {}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl w-fit mb-6">
                <button 
                    onClick={() => setActiveTab("VOUCHER")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        activeTab === "VOUCHER" ? "bg-white text-[#006B7A] shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Ticket className="w-4 h-4" />
                    Data Voucher
                </button>
                <button 
                    onClick={() => setActiveTab("PROMO")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        activeTab === "PROMO" ? "bg-white text-[#006B7A] shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Tag className="w-4 h-4" />
                    Data Promo
                </button>
            </div>

            {}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Buat {activeTab} Baru</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kode Unik</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    placeholder="Contoh: DISKON100"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A] uppercase"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A]"
                                    rows="2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Nilai</label>
                                    <select 
                                        value={formData.isPercent} 
                                        onChange={e => setFormData({...formData, isPercent: e.target.value === "true"})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A]"
                                    >
                                        <option value="false">Nominal (Rp)</option>
                                        <option value="true">Persentase (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Besaran Potongan</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="1"
                                        value={formData.amount} 
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Kedaluwarsa</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={formData.expiryDate} 
                                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A]"
                                />
                            </div>

                            {activeTab === "VOUCHER" && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Batas Penggunaan (Kuota)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="1"
                                        value={formData.remainingUsage} 
                                        onChange={e => setFormData({...formData, remainingUsage: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#006B7A]"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-[#006B7A] hover:bg-teal-700 rounded-xl transition-colors shadow-sm">Simpan {activeTab}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[11px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Kode & Info</th>
                                <th className="p-4">Potongan</th>
                                <th className="p-4">Kedaluwarsa</th>
                                {activeTab === "VOUCHER" && <th className="p-4">Sisa Kuota</th>}
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">Memuat data...</td>
                                </tr>
                            ) : (activeTab === "VOUCHER" ? vouchers : promos).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            {activeTab === "VOUCHER" ? <Ticket className="w-12 h-12 mb-3 opacity-50" /> : <Tag className="w-12 h-12 mb-3 opacity-50" />}
                                            <p className="font-medium">Belum ada {activeTab} yang dibuat.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (activeTab === "VOUCHER" ? vouchers : promos).map((item) => {
                                const isExpired = new Date(item.expiryDate) < new Date();
                                const isDepleted = activeTab === "VOUCHER" && item.remainingUsage <= 0;
                                const isActive = !isExpired && !isDepleted;

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <p className="font-black text-gray-900 text-sm tracking-wide">{item.code}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description || "-"}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-50 text-[#006B7A] font-bold text-xs border border-teal-100">
                                                {item.isPercent ? <Percent className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                                                {item.isPercent ? `${item.amount}%` : formatRupiah(item.amount)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(item.expiryDate)}
                                            </div>
                                        </td>
                                        {activeTab === "VOUCHER" && (
                                            <td className="p-4">
                                                <span className={`font-bold text-xs ${item.remainingUsage > 0 ? "text-gray-900" : "text-red-500"}`}>
                                                    {item.remainingUsage}x
                                                </span>
                                            </td>
                                        )}
                                        <td className="p-4">
                                            {isActive ? (
                                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-[11px] font-bold uppercase tracking-wide">Aktif</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-[11px] font-bold uppercase tracking-wide">
                                                    {isExpired ? "Kedaluwarsa" : "Habis"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
