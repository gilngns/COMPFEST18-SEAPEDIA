import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import { 
  Download, Search, Calendar, Truck, MapPin, 
  CheckCircle2, Package, Clock, Tag
} from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "../../utils/image";
import { useOrders } from "../../hooks/usecases/useOrders";
import { useSeller } from "../../hooks/usecases/useSeller";

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
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

const STATUS_PROGRESS = {
  "SEDANG_DIKEMAS": 1,
  "MENUNGGU_PENGIRIM": 2,
  "SEDANG_DIKIRIM": 3,
  "PESANAN_SELESAI": 4,
  "DIKEMBALIKAN": 0
};

const STATUS_COLOR = {
  "SEDANG_DIKEMAS": "bg-orange-100 text-orange-700",
  "MENUNGGU_PENGIRIM": "bg-blue-100 text-blue-700",
  "SEDANG_DIKIRIM": "bg-[#006B7A] text-white",
  "PESANAN_SELESAI": "bg-green-100 text-green-700",
  "DIKEMBALIKAN": "bg-red-100 text-red-700"
};

const STATUS_LABEL = {
  "SEDANG_DIKEMAS": "Sedang Dikemas",
  "MENUNGGU_PENGIRIM": "Menunggu Kurir",
  "SEDANG_DIKIRIM": "Sedang Dikirim",
  "PESANAN_SELESAI": "Selesai",
  "DIKEMBALIKAN": "Dikembalikan"
};

export default function SellerOrders() {
  const [storeName, setStoreName] = useState("Toko Saya");
  const [storeLogo, setStoreLogo] = useState(null);
  const [activeTab, setActiveTab] = useState("Semua Pesanan");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getStoreOrders, updateOrderStatus } = useOrders();
  const { getMyStore } = useSeller();

  const loadOrders = useCallback(async () => {
    try {
      const ordersData = await getStoreOrders();
      setOrders(ordersData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getStoreOrders]);

  useEffect(() => {
    async function loadStore() {
      try {
        const store = await getMyStore();
        if (store) {
          setStoreName(store.name);
          setStoreLogo(store.logoUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStore();
    loadOrders();
  }, [loadOrders, getMyStore]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Status diperbarui", timer: 1500, showConfirmButton: false });
      loadOrders();
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || err.message || "Gagal update status", "error");
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === "Semua Pesanan") return orders;
    if (activeTab === "Perlu Diproses") return orders.filter(o => o.status === "SEDANG_DIKEMAS");
    if (activeTab === "Menunggu Kurir") return orders.filter(o => o.status === "MENUNGGU_PENGIRIM");
    if (activeTab === "Dalam Pengiriman") return orders.filter(o => o.status === "SEDANG_DIKIRIM");
    if (activeTab === "Selesai") return orders.filter(o => o.status === "PESANAN_SELESAI");
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  const tabs = [
    { name: "Semua Pesanan", count: orders.length },
    { name: "Perlu Diproses", count: orders.filter(o => o.status === "SEDANG_DIKEMAS").length, alert: true },
    { name: "Menunggu Kurir", count: orders.filter(o => o.status === "MENUNGGU_PENGIRIM").length },
    { name: "Dalam Pengiriman", count: orders.filter(o => o.status === "SEDANG_DIKIRIM").length },
    { name: "Selesai", count: orders.filter(o => o.status === "PESANAN_SELESAI").length }
  ];

  return (
    <SellerLayout storeName={storeName} storeLogo={storeLogo}>
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pesanan Masuk</h2>
          <p className="text-gray-500 mt-1 text-[15px]">
            Kelola dan proses pesanan dari pelanggan Anda.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Ekspor Data
        </button>
      </div>

      {}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-2 flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.name 
                ? "border-[#006B7A] text-[#006B7A]" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.name}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                tab.alert && tab.count > 0 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {}
      <div className="bg-white border-b border-x border-gray-200 p-4 rounded-b-xl mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari No. Invoice..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
          />
        </div>
      </div>

      {}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Memuat pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Tidak ada pesanan.</div>
        ) : filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-sm tracking-wide">#{order.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>

            {}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {}
              <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-gray-100"></div>

              {}
              <div className="flex flex-col gap-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                      {item.product.images[0] ? (
                        <img src={getImageUrl(item.product.images?.[0])} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm mb-1 font-medium">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-auto bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="space-y-1.5 text-xs text-gray-600 mb-2">
                    <div className="flex justify-between"><span>Subtotal Produk</span><span>{formatRupiah(order.subtotal)}</span></div>
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between text-red-500 font-medium"><span>Diskon</span><span>-{formatRupiah(order.discount)}</span></div>
                    )}
                    <div className="flex justify-between"><span>Ongkos Kirim</span><span>{formatRupiah(order.deliveryFee)}</span></div>
                    <div className="flex justify-between"><span>PPN 12%</span><span>{formatRupiah(order.ppn)}</span></div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-sm text-gray-900">
                    <span>Total Pembayaran</span>
                    <span className="text-[#006B7A]">{formatRupiah(order.total)}</span>
                  </div>
                </div>
              </div>

              {}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">INFORMASI PEMBELI</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#006B7A] flex items-center justify-center text-white font-bold text-xs shrink-0 uppercase">
                      {order.buyer?.username?.substring(0, 2) || "AN"}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{order.buyer?.username || "Anonim"}</p>
                  </div>
                  {order.address && (
                    <div className="flex items-start gap-2 text-gray-600 text-xs mb-4">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div className="leading-relaxed pr-4">
                        <span className="font-bold block text-gray-800">{order.address.recipient} ({order.address.phone})</span>
                        {order.address.detail}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {order.deliveryMethod} ({formatRupiah(order.deliveryFee)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {}
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4 md:gap-12 relative">
                {}
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-gray-200 -z-0"></div>
                
                {[
                  { step: 1, label: "Dikemas", icon: Package },
                  { step: 2, label: "Kurir", icon: Clock },
                  { step: 3, label: "Kirim", icon: Truck },
                  { step: 4, label: "Selesai", icon: CheckCircle2 }
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center gap-1.5 relative z-10 bg-gray-50 px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      STATUS_PROGRESS[order.status] >= item.step ? "bg-[#006B7A] text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[10px] font-bold ${
                      STATUS_PROGRESS[order.status] >= item.step ? "text-[#006B7A]" : "text-gray-400"
                    }`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {}
              {order.status === "SEDANG_DIKEMAS" && (
                <button 
                  onClick={() => handleUpdateStatus(order.id, "MENUNGGU_PENGIRIM")}
                  className="w-full sm:w-auto bg-[#ff8c00] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" /> Proses & Panggil Kurir
                </button>
              )}
              {order.status === "MENUNGGU_PENGIRIM" && (
                <span className="text-sm font-bold text-blue-600">Menunggu Kurir...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </SellerLayout>
  );
}
