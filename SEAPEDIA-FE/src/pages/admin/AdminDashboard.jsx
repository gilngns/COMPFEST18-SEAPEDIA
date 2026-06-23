import DashboardOverview from "../../components/DashboardOverview";
import { Users, Store, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
    return (
        <DashboardOverview 
            title="Admin Dashboard"
            subtitle="Ringkasan platform Seapedia hari ini."
            mainCard={{
                title: "Total Revenue Platform",
                value: 450000000,
                subValueLabel: "Bulan ini:",
                subValue: "Rp 120.000.000",
                actionText: "Lihat Laporan",
                actionPath: "/admin"
            }}
            secondaryCard={{
                title: "Total Pengguna",
                value: "14,592",
                isCurrency: false,
                subtext: "vs bulan lalu",
                trend: "+12%",
                icon: Users,
                iconColor: "text-blue-500"
            }}
            actionCards={[
                {
                    title: "Verifikasi Toko",
                    value: 24,
                    icon: Store,
                    iconColor: "text-orange-600",
                    bgColor: "bg-orange-100",
                    badge: "Pending",
                    badgeColor: "text-orange-500",
                    path: "/admin"
                },
                {
                    title: "Laporan Masalah",
                    value: 5,
                    icon: AlertCircle,
                    iconColor: "text-red-600",
                    bgColor: "bg-red-100",
                    badge: "Urgent",
                    badgeColor: "text-red-500",
                    path: "/admin"
                }
            ]}
        />
    );
}
