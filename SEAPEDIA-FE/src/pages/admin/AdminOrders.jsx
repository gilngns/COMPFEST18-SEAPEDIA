import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Package, Clock, ShoppingBag, Eye, X } from "lucide-react";

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
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function StatusBadge({ status }) {
    const colors = {
        "MENUNGGU_PEMBAYARAN": "bg-yellow-100 text-yellow-700",
        "SEDANG_DIKEMAS": "bg-blue-100 text-blue-700",
        "MENUNGGU_PENGIRIM": "bg-purple-100 text-purple-700",
        "SEDANG_DIKIRIM": "bg-indigo-100 text-indigo-700",
        "PESANAN_SELESAI": "bg-green-100 text-green-700",
        "DIBATALKAN": "bg-gray-100 text-gray-700",
        "DIKEMBALIKAN": "bg-red-100 text-red-700"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${colors[status] || "bg-gray-100 text-gray-700"}`}>
            {status.replace(/_/g, " ")}
        </span>
    );
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/admin/orders");
                setOrders(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil data pesanan", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Monitor Transaksi</h2>
                <p className="text-gray-500 mt-1 text-sm">Pemantauan seluruh transaksi pesanan di platform Seapedia.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[11px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Info Pesanan</th>
                                <th className="p-4">Pembeli</th>
                                <th className="p-4">Toko</th>
                                <th className="p-4">Tagihan & Logistik</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Memuat data transaksi...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <ShoppingBag className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="font-medium">Belum ada transaksi di platform.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.map((order) => {
                                const firstItem = order.items[0];
                                const extraCount = order.items.length - 1;
                                
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <p className="font-bold text-gray-900 text-sm max-w-[200px] truncate">
                                                {firstItem?.product?.name || "Produk Dihapus"}
                                            </p>
                                            {extraCount > 0 && (
                                                <p className="text-[11px] font-medium text-indigo-600 mt-0.5">
                                                    + {extraCount} produk lainnya
                                                </p>
                                            )}
                                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 font-medium tracking-wide">
                                                <Clock className="w-3 h-3" />
                                                #{order.id.slice(0, 8)} • {formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900 text-sm">{order.buyer.username}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900 text-sm">{order.store.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-[#006B7A] block">{formatRupiah(order.total)}</span>
                                            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-gray-500">
                                                <Package className="w-3.5 h-3.5 text-gray-400" />
                                                {order.deliveryMethod}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Detail Pesanan</h3>
                                <p className="text-sm text-gray-500 mt-1">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-6">
                            {}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <StatusBadge status={selectedOrder.status} />
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pengiriman</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.deliveryMethod}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pembeli</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.buyer.username}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Toko</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.store.name}</p>
                                </div>
                            </div>

                            {}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Daftar Produk</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-[#006B7A] transition-colors">
                                            {item.product?.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.product?.name || "Produk Dihapus"}</p>
                                                <p className="text-xs text-gray-500 mt-1">{item.quantity} x {formatRupiah(item.price)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#006B7A]">{formatRupiah(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {}
                            <div className="bg-[#006B7A]/5 rounded-xl p-4 border border-[#006B7A]/10">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-2">
                                    <span>Total Harga ({selectedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} Barang)</span>
                                    <span>{formatRupiah(selectedOrder.items.reduce((acc, i) => acc + (i.price * i.quantity), 0))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4 pb-4 border-b border-gray-200/60">
                                    <span>Ongkos Kirim ({selectedOrder.deliveryMethod})</span>
                                    <span>{formatRupiah(selectedOrder.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-black text-[#006B7A]">
                                    <span>Total Belanja</span>
                                    <span>{formatRupiah(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
