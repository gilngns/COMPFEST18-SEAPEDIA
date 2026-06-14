import { useState, useEffect } from "react";
import api from "../../lib/api";
import SellerLayout from "../../components/seller/SellerLayout";
import { 
  Download, 
  Search, 
  Calendar, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Package, 
  Clock, 
  Tag
} from "lucide-react";

// Mock Data
const MOCK_ORDERS = [
  {
    id: "INV/20231024/MPL/3540291",
    date: "24 Okt 2023, 09:45 WIB",
    status: "Sedang Dikemas",
    statusColor: "bg-orange-100 text-orange-700",
    product: {
      name: "Ikan Tuna Yellowfin Premium",
      variant: "Grade A, 1kg",
      qty: 1,
      price: 150000,
      image: null
    },
    buyer: {
      name: "Ahmad Jaelani",
      initial: "AJ",
      address: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan, 12190"
    },
    shipping: {
      courier: "JNE - Reguler",
      cost: 15000,
      receipt: null
    },
    total: 165000,
    progress: 2 // 1: Dipesan, 2: Dikemas, 3: Kirim, 4: Selesai
  },
  {
    id: "INV/20231023/MPL/3540112",
    date: "23 Okt 2023, 14:20 WIB",
    status: "Menunggu Kurir",
    statusColor: "bg-[#006B7A] text-white",
    product: {
      name: "Udang Windu Size 20",
      variant: "Fresh, 2kg",
      qty: 2,
      price: 220000,
      image: null
    },
    buyer: {
      name: "Budi Kusuma",
      initial: "BK",
      address: "Perumahan Indah Asri Blok C2, Bandung, 40112"
    },
    shipping: {
      courier: "GoSend - Instant",
      cost: 25000,
      receipt: "GK-9982312"
    },
    total: 465000,
    progress: 3
  }
];

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

export default function SellerOrders() {
  const [storeName, setStoreName] = useState("Toko Saya");
  const [storeLogo, setStoreLogo] = useState(null);
  const [activeTab, setActiveTab] = useState("Perlu Diproses");

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await api.get("/seller/store/me");
        if (res.data.data) {
          setStoreName(res.data.data.name);
          setStoreLogo(res.data.data.logoUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStore();
  }, []);

  const tabs = [
    { name: "Semua Pesanan", count: 0 },
    { name: "Perlu Diproses", count: 12, alert: true },
    { name: "Menunggu Kurir", count: 4, alert: false },
    { name: "Dalam Pengiriman", count: 0 },
    { name: "Selesai", count: 0 }
  ];

  return (
    <SellerLayout storeName={storeName} storeLogo={storeLogo}>
      {/* Header */}
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

      {/* Tabs */}
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
                tab.alert ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-white border-b border-x border-gray-200 p-4 rounded-b-xl mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari No. Invoice..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> Hari Ini
            </div>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" /> Semua Kurir
            </div>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-sm tracking-wide">{order.id}</span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {order.date}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${order.statusColor}`}>
                {order.status}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Vertical divider on md screens */}
              <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-gray-100"></div>

              {/* Left Col: Product Info */}
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="font-bold text-gray-900 text-[15px] mb-1">{order.product.name}</h4>
                  <p className="text-gray-500 text-xs mb-2">Varian: {order.product.variant}</p>
                  <p className="text-gray-600 text-sm mb-3 font-medium">{order.product.qty} x {formatRupiah(order.product.price)}</p>
                  <div className="mt-auto flex items-center gap-1 text-[#006B7A] font-bold text-sm bg-teal-50 w-fit px-2.5 py-1 rounded-md">
                    <Tag className="w-3.5 h-3.5" /> Total: {formatRupiah(order.total)}
                  </div>
                </div>
              </div>

              {/* Right Col: Buyer & Shipping Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">INFORMASI PEMBELI</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#006B7A] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {order.buyer.initial}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{order.buyer.name}</p>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 text-xs mb-4">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <p className="leading-relaxed pr-4">{order.buyer.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {order.shipping.courier} ({formatRupiah(order.shipping.cost)})
                    </span>
                  </div>
                  {order.shipping.receipt ? (
                    <span className="text-sm font-bold text-gray-900">Resi: {order.shipping.receipt}</span>
                  ) : (
                    <button className="text-[#006B7A] font-bold text-sm hover:underline">Cetak Label</button>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer: Progress & Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4 md:gap-12 relative">
                {/* Connecting Line background */}
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-gray-200 -z-0"></div>
                
                {[
                  { step: 1, label: "Dipesan", icon: CheckCircle2 },
                  { step: 2, label: "Dikemas", icon: Package },
                  { step: 3, label: "Kirim", icon: Truck },
                  { step: 4, label: "Selesai", icon: CheckCircle2 }
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center gap-1.5 relative z-10 bg-gray-50 px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      order.progress >= item.step ? "bg-[#006B7A] text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[10px] font-bold ${
                      order.progress >= item.step ? "text-[#006B7A]" : "text-gray-400"
                    }`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {order.status === "Sedang Dikemas" ? (
                <button className="w-full sm:w-auto bg-[#ff8c00] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" /> Proses Pesanan
                </button>
              ) : (
                <button className="w-full sm:w-auto bg-white border-2 border-[#006B7A] text-[#006B7A] hover:bg-teal-50 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  Lacak Kurir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </SellerLayout>
  );
}
