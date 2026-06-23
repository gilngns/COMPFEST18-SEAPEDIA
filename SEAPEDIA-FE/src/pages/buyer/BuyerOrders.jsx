import { useState, useEffect } from "react";
import { ShoppingBag, Search, Clock, Tag, Package, CheckCircle2, Truck } from "lucide-react";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { getImageUrl } from "../../utils/image";

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

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/me");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pesanan Saya</h2>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari No. Invoice atau Nama Produk..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Memuat pesanan...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Anda belum memiliki pesanan.</p>
          </div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-gray-900 text-sm">{formatDate(order.createdAt)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
                <span className="text-gray-500 text-sm ml-2">{order.store?.name}</span>
              </div>
              <span className="font-semibold text-gray-600 text-xs">INV/{order.id.slice(0,8).toUpperCase()}</span>
            </div>

            <div className="p-5 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-4 flex-1">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={getImageUrl(item.product.images?.[0])} 
                      alt={item.product.name} 
                      className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100" 
                    />
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm font-medium">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                <p className="font-black text-xl text-gray-900 mb-3">{formatRupiah(order.total)}</p>
                
                {order.status === "SEDANG_DIKIRIM" && (
                    <button className="w-full bg-[#ff8c00] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e67e00] transition-colors">
                        Selesaikan Pesanan
                    </button>
                )}
                {order.status === "PESANAN_SELESAI" && (
                    <button className="w-full border border-[#006B7A] text-[#006B7A] px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors">
                        Beri Ulasan
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
