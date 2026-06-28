import { useState, useEffect } from "react";
import DashboardOverview from "../../components/DashboardOverview";
import { Truck, MapPin, CheckCircle } from "lucide-react";
import { useDriver } from "../../hooks/usecases/useDriver";

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

export default function DriverDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getDashboard } = useDriver();

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await getDashboard();
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, [getDashboard]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 font-medium animate-pulse">Memuat data dashboard...</div>
            </div>
        );
    }

    const d = data || {
        totalEarnings: 0,
        walletBalance: 0,
        totalDistance: 0,
        activeDeliveries: 0,
        completedDeliveries: 0
    };
    return (
        <DashboardOverview 
            title="Dashboard Driver"
            subtitle="Pantau pengiriman dan penghasilan Anda hari ini."
            mainCard={{
                title: "Saldo Penghasilan",
                value: d.walletBalance,
                subValueLabel: "Tersedia:",
                subValue: formatRupiah(d.walletBalance)
            }}
            secondaryCard={{
                title: "Total Pendapatan",
                value: d.totalEarnings,
                isCurrency: true,
                subtext: "dari semua pengiriman",
                trend: "Selesai",
                icon: CheckCircle,
                iconColor: "text-green-500"
            }}
            actionCards={[
                {
                    title: "Sedang Dikirim",
                    value: d.activeDeliveries,
                    icon: Truck,
                    iconColor: "text-orange-600",
                    bgColor: "bg-orange-100",
                    badge: d.activeDeliveries > 0 ? "Pickup" : null,
                    badgeColor: "text-orange-500",
                    path: "/driver/deliveries"
                },
                {
                    title: "Pengiriman Selesai",
                    value: d.completedDeliveries,
                    icon: CheckCircle,
                    iconColor: "text-green-600",
                    bgColor: "bg-green-100",
                    path: "/driver/deliveries"
                }
            ]}
        />
    );
}
