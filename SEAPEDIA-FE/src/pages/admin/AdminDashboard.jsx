import DashboardOverview from "../../components/DashboardOverview";
import { Users, Store, AlertCircle, Clock, Package, Ticket, ShoppingBag, Truck } from "lucide-react";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [isSimulating, setIsSimulating] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleSimulateDay = async () => {
        try {
            setIsSimulating(true);
            const res = await api.post("/admin/simulate-day");
            const data = res.data.data;
            Swal.fire({
                icon: "success",
                title: "Waktu Dimajukan!",
                html: `Simulasi hari +${data.dayOffset} berhasil.<br/>Pesanan overdue direfund: <b>${data.refundedCount}</b> pesanan.`
            });
            // Refresh stats after simulation
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.response?.data?.message || "Gagal melakukan simulasi waktu."
            });
        } finally {
            setIsSimulating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat dashboard...</div>;

    return (
        <div className="relative pb-24">
        <DashboardOverview 
            title="Admin Dashboard"
            subtitle="Ringkasan monitoring platform Seapedia hari ini."
            mainCard={{
                title: "Total Revenue Platform",
                value: stats?.totalRevenue || 0,
                subValueLabel: "Total Transaksi:",
                subValue: stats?.orders || 0,
                actionText: "Monitor Transaksi",
                actionPath: "/admin/orders"
            }}
            secondaryCard={{
                title: "Total Pengguna",
                value: stats?.users || 0,
                isCurrency: false,
                subtext: "Terdaftar di sistem",
                icon: Users,
                iconColor: "text-blue-500"
            }}
            actionCards={[]} // Kosongkan actionCards agar DashboardOverview hanya menampilkan 2 card utama yang lebih seimbang
        />

        {/* Custom Grid for Additional Stats */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Metrik Operasional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    {
                        title: "Total Toko",
                        value: stats?.stores || 0,
                        icon: Store,
                        iconColor: "text-orange-600",
                        bgColor: "bg-orange-100",
                        path: "/admin"
                    },
                    {
                        title: "Total Produk",
                        value: stats?.products || 0,
                        icon: Package,
                        iconColor: "text-teal-600",
                        bgColor: "bg-teal-100",
                        path: "/admin"
                    },
                    {
                        title: "Total Pengiriman",
                        value: stats?.deliveries || 0,
                        icon: Truck,
                        iconColor: "text-blue-600",
                        bgColor: "bg-blue-100",
                        path: "/admin"
                    },
                    {
                        title: "Voucher & Promo",
                        value: (stats?.vouchers || 0) + (stats?.promos || 0),
                        icon: Ticket,
                        iconColor: "text-purple-600",
                        bgColor: "bg-purple-100",
                        path: "/admin/promos"
                    },
                    {
                        title: "Overdue SLA",
                        value: stats?.overdueOrders || 0,
                        icon: AlertCircle,
                        iconColor: "text-red-600",
                        bgColor: "bg-red-100",
                        path: "/admin"
                    }
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-32">
                            <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                {stat.title === "Overdue SLA" && stat.value > 0 && (
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded uppercase tracking-wider">
                                        Refunded
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-0.5">{stat.title}</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        System Time Machine (Simulasi Waktu)
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Maju ke hari berikutnya untuk mengetes fitur SLA Overdue dan Auto-Refund.</p>
                </div>
                <button 
                    onClick={handleSimulateDay} 
                    disabled={isSimulating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap disabled:opacity-50"
                >
                    {isSimulating ? "Memproses..." : "Simulasikan +1 Hari"}
                </button>
            </div>
        </div>
        </div>
    );
}
