import DashboardOverview from "../../components/DashboardOverview";
import { Truck, MapPin, CheckCircle } from "lucide-react";

export default function DriverDashboard() {
    return (
        <DashboardOverview 
            title="Dashboard Driver"
            subtitle="Pantau pengiriman dan penghasilan Anda hari ini."
            mainCard={{
                title: "Saldo Penghasilan",
                value: 1250000,
                subValueLabel: "Tersedia:",
                subValue: "Rp 1.250.000",
                actionText: "Tarik Dana",
                actionPath: "/driver"
            }}
            secondaryCard={{
                title: "Total Jarak Tempuh",
                value: "142 km",
                isCurrency: false,
                subtext: "minggu ini",
                trend: "Aktif",
                icon: MapPin,
                iconColor: "text-blue-500"
            }}
            actionCards={[
                {
                    title: "Perlu Dikirim",
                    value: 5,
                    icon: Truck,
                    iconColor: "text-orange-600",
                    bgColor: "bg-orange-100",
                    badge: "Pickup",
                    badgeColor: "text-orange-500",
                    path: "/driver"
                },
                {
                    title: "Pengiriman Selesai",
                    value: 124,
                    icon: CheckCircle,
                    iconColor: "text-green-600",
                    bgColor: "bg-green-100",
                    path: "/driver"
                }
            ]}
        />
    );
}
