// src/pages/seller/SellerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import CreateStoreModal from "../../components/seller/CreateStoreModal";
import {
    Wallet,
    TrendingUp,
    Truck,
    Package,
    ChevronRight,
    CalendarDays,
    Store,
} from "lucide-react";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function SellerDashboard() {
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            const storeRes = await api.get("/seller/store/me");
            setStore(storeRes.data.data);
            if (storeRes.data.data) {
                const prodRes = await api.get("/seller/products");
                const products = prodRes.data.data || [];
                setProductCount(products.filter((p) => p.isActive).length);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <SellerLayout>
                <p className="text-gray-400">Memuat...</p>
            </SellerLayout>
        );
    }

    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <SellerLayout storeName={store?.name || "Toko Saya"}>
            {/* MODAL otomatis kalau belum punya toko */}
            {!store && (
                <CreateStoreModal
                    onCreated={(newStore) => {
                        setStore(newStore);
                        setProductCount(0);
                    }}
                />
            )}

            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                <div>
                    <h2 className="text-[26px] font-semibold text-gray-900 tracking-tight mb-1">Tinjauan Toko</h2>
                    <p className="text-sm text-gray-600">
                        Pantau performa dan pesanan harian Anda.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-4 sm:mt-0 font-medium">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Hari Ini, {today}
                </div>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="bg-[#006B7A] text-white rounded-xl p-6 flex flex-col justify-between shadow-sm border border-[#005a67]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                        <Wallet className="w-5 h-5" />
                        Total Saldo
                    </div>
                    <div className="mb-6">
                        <p className="text-4xl font-bold tracking-tight">{rupiah(0)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="text-[13px] text-white/90">
                            Siap ditarik: <span className="font-semibold text-white">Rp 0</span>
                        </div>
                        <button onClick={() => navigate("/seller/finance")} className="bg-white text-[#006B7A] px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                            Tarik Dana
                        </button>
                    </div>
                </div>

                {/* Daily Income */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Pendapatan Hari Ini
                    </div>
                    <div className="mb-6">
                        <p className="text-4xl font-bold text-gray-900 tracking-tight">{rupiah(0)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                        <span className="bg-[#bceae5] text-[#006B7A] text-[13px] font-bold px-2 py-1 rounded flex items-center gap-1">
                            ↑ 0%
                        </span>
                        <span className="text-sm font-medium text-gray-500">vs kemarin</span>
                    </div>
                </div>

                {/* Small Action Stats */}
                <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
                    <button onClick={() => navigate("/seller/orders")} className="w-full h-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 hover:shadow-md transition-all shadow-sm text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6 text-red-700" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-gray-600 mb-0.5">Pesanan Perlu Diproses</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 leading-none">0</p>
                                    <span className="text-xs font-medium text-red-500">Urgent</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0 ml-1" />
                    </button>

                    <button
                        onClick={() => navigate("/seller/products")}
                        className="w-full h-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 hover:shadow-md transition-all shadow-sm text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <Package className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-gray-600 mb-0.5">Total Produk Aktif</p>
                                <p className="text-2xl font-bold text-gray-900 leading-none">{productCount}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0 ml-1" />
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
}