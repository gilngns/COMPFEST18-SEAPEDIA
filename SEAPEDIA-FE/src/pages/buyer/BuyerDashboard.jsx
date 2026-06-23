import { useState, useEffect } from "react";
import api from "../../lib/api";
import DashboardOverview from "../../components/DashboardOverview";
import { Wallet, ShoppingBag, Truck, Package } from "lucide-react";

export default function BuyerDashboard() {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [walletRes, orderRes] = await Promise.all([
                    api.get("/buyer/wallet"),
                    api.get("/orders/me")
                ]);
                setBalance(walletRes.data.data?.balance || 0);
                setOrders(orderRes.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Memuat...</div>;
    }

    const activeOrdersCount = orders.filter(o => 
        o.status !== "PESANAN_SELESAI" && o.status !== "DIKEMBALIKAN"
    ).length;
    
    const completedOrdersCount = orders.filter(o => o.status === "PESANAN_SELESAI").length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

    return (
        <DashboardOverview 
            title="Dashboard Pembeli"
            subtitle="Selamat datang kembali! Pantau belanja dan pesanan Anda di sini."
            mainCard={{
                title: "Saldo Wallet",
                value: balance,
                subValueLabel: "Tersedia:",
                subValue: `Rp ${Number(balance).toLocaleString("id-ID")}`,
                actionText: "Top Up",
                actionPath: "/buyer/wallet"
            }}
            secondaryCard={{
                title: "Total Pengeluaran",
                value: totalSpent,
                isCurrency: true,
                subtext: "dari seluruh transaksi",
                trend: "Aktif",
                icon: Wallet,
                iconColor: "text-[#006B7A]"
            }}
            actionCards={[
                {
                    title: "Pesanan Aktif",
                    value: activeOrdersCount,
                    icon: Truck,
                    iconColor: "text-orange-600",
                    bgColor: "bg-orange-100",
                    badge: "Lacak",
                    badgeColor: "text-orange-500",
                    path: "/buyer/orders"
                },
                {
                    title: "Pesanan Selesai",
                    value: completedOrdersCount,
                    icon: Package,
                    iconColor: "text-green-600",
                    bgColor: "bg-green-100",
                    path: "/buyer/orders"
                }
            ]}
        />
    );
}
