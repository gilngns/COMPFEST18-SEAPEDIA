import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import { useSeller } from "../../hooks/usecases/useSeller";
import { useOrders } from "../../hooks/usecases/useOrders";
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
    const [todayIncome, setTodayIncome] = useState(0);
    const [loading, setLoading] = useState(true);

    const { getMyStore, listMyProducts, getWallet, getWalletTransactions } = useSeller();
    const { getStoreOrders } = useOrders();

    const loadData = useCallback(async () => {
        try {
            const storeData = await getMyStore();
            setStore(storeData);
            if (storeData) {
                const products = await listMyProducts();
                setProductCount((products || []).filter((p) => p.isActive).length);

                const orders = await getStoreOrders();
                setOrderCount((orders || []).filter(o => o.status === "SEDANG_DIKEMAS").length);

                const wallet = await getWallet();
                if (wallet) setBalance(Number(wallet.balance) || 0);

                const txs = await getWalletTransactions();
                if (txs) {
                    const today = new Date().toDateString();
                    const income = txs.filter(t => t.amount > 0 && new Date(t.createdAt).toDateString() === today).reduce((sum, t) => sum + Number(t.amount), 0);
                    setTodayIncome(income);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getMyStore, listMyProducts, getStoreOrders]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
                    subValue: `Rp ${Number(balance).toLocaleString("id-ID")}`
                }}
                secondaryCard={{
                    title: "Pendapatan Hari Ini",
                    value: todayIncome,
                    isCurrency: true,
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