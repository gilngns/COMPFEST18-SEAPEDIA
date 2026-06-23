import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import CreateStoreModal from "../../components/seller/CreateStoreModal";
import DashboardOverview from "../../components/DashboardOverview";
import {
    TrendingUp,
    Truck,
    Package,
} from "lucide-react";

export default function SellerDashboard() {
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            const storeRes = await api.get("/seller/store/me");
            setStore(storeRes.data.data);
            if (storeRes.data.data) {
                const prodRes = await api.get("/seller/products");
                const products = prodRes.data.data || [];
                setProductCount(products.filter((p) => p.isActive).length);

                const ordRes = await api.get("/orders/store");
                const orders = ordRes.data.data || [];
                setOrderCount(orders.filter(o => o.status === "SEDANG_DIKEMAS").length);
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
            <SellerLayout storeName={store?.name} storeLogo={store?.logoUrl}>
                <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Memuat...</div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout storeName={store?.name || "Toko Saya"} storeLogo={store?.logoUrl}>
            {!store && (
                <CreateStoreModal
                    onCreated={(newStore) => {
                        setStore(newStore);
                        setProductCount(0);
                    }}
                />
            )}

            <DashboardOverview 
                title="Tinjauan Toko"
                subtitle="Pantau performa dan pesanan harian Anda."
                mainCard={{
                    title: "Total Saldo",
                    value: balance,
                    subValueLabel: "Siap ditarik:",
                    subValue: `Rp ${Number(balance).toLocaleString("id-ID")}`,
                    actionText: "Tarik Dana",
                    actionPath: "/seller/finance"
                }}
                secondaryCard={{
                    title: "Pendapatan Hari Ini",
                    value: 0,
                    isCurrency: true,
                    subtext: "vs kemarin",
                    trend: "↑ 0%",
                    icon: TrendingUp,
                    iconColor: "text-orange-500"
                }}
                actionCards={[
                    {
                        title: "Pesanan Perlu Diproses",
                        value: orderCount,
                        icon: Truck,
                        iconColor: "text-red-700",
                        bgColor: "bg-red-100",
                        badge: orderCount > 0 ? "Urgent" : null,
                        badgeColor: "text-red-500",
                        path: "/seller/orders"
                    },
                    {
                        title: "Total Produk Aktif",
                        value: productCount,
                        icon: Package,
                        iconColor: "text-gray-700",
                        bgColor: "bg-gray-200",
                        path: "/seller/products"
                    }
                ]}
            />

        </SellerLayout>
    );
}