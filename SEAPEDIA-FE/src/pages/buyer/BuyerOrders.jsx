import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Search, Clock, Tag, Package, CheckCircle2, Truck, Star, X } from "lucide-react";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { useOrders } from "../../hooks/usecases/useOrders";
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

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [reviewsForm, setReviewsForm] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const itemsPerPage = 5;

  const { getMyOrders, submitReviews } = useOrders();

  const loadOrders = useCallback(async () => {
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMyOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const invoiceMatch = order.id.toLowerCase().includes(query);
    const productMatch = order.items.some((item) =>
      item.product.name.toLowerCase().includes(query)
    );
    return invoiceMatch || productMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenReviewModal = (order) => {
    setReviewModalOrder(order);
    setReviewsForm(order.items.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      image: item.product.images?.[0],
      rating: 0,
      comment: ""
    })));
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewsForm(prev => prev.map(r => r.productId === productId ? { ...r, [field]: value } : r));
  };

  const handleSubmitReviews = async () => {
    const incomplete = reviewsForm.some(r => r.rating === 0);
    if (incomplete) {
      return Swal.fire("Oops", "Mohon berikan bintang untuk semua produk", "warning");
    }

    setSubmittingReview(true);
    try {
      const payload = reviewsForm.map(r => ({ productId: r.productId, rating: r.rating, comment: r.comment }));
      await submitReviews(reviewModalOrder.id, payload);
      Swal.fire("Berhasil", "Ulasan berhasil disimpan!", "success");
      setReviewModalOrder(null);
      loadOrders(); 
    } catch (err) {
      
    } finally {
      setSubmittingReview(false);
    }
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Memuat pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? "Pesanan tidak ditemukan." : "Anda belum memiliki pesanan."}
            </p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-bold text-gray-900 text-[13px]">{formatDate(order.createdAt)}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                  <span className="text-gray-500 text-[13px] ml-1">{order.store?.name}</span>
                </div>
                <span className="font-semibold text-gray-600 text-[11px]">INV/{order.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <div className="p-3 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-md object-cover bg-gray-50 border border-gray-100"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{item.product.name}</h4>
                        <p className="text-gray-600 text-[13px] font-medium">{item.quantity} x {formatRupiah(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                  <div className="space-y-1 text-[11px] text-gray-500 mb-3 w-full bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-700">{formatRupiah(order.subtotal)}</span></div>
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between text-red-500 font-bold"><span>Diskon</span><span>-{formatRupiah(order.discount)}</span></div>
                    )}
                    <div className="flex justify-between"><span>Ongkir</span><span className="font-medium text-gray-700">{formatRupiah(order.deliveryFee)}</span></div>
                    <div className="flex justify-between"><span>PPN 12%</span><span className="font-medium text-gray-700">{formatRupiah(order.ppn)}</span></div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-xs text-gray-600 font-bold">Total Pembayaran</p>
                    <p className="font-black text-lg text-[#006B7A]">{formatRupiah(order.total)}</p>
                  </div>

                  {order.status === "SEDANG_DIKIRIM" && (
                    <button className="w-full bg-[#ff8c00] text-white px-3 py-1.5 rounded-md font-bold text-[13px] hover:bg-[#e67e00] transition-colors mt-1">
                      Selesaikan
                    </button>
                  )}
                  {order.status === "PESANAN_SELESAI" && (
                    <button 
                      onClick={() => handleOpenReviewModal(order)}
                      className="w-full border border-[#006B7A] text-[#006B7A] px-3 py-1.5 rounded-md font-bold text-[13px] hover:bg-teal-50 transition-colors mt-1"
                    >
                      Beri Ulasan
                    </button>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                <button 
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="text-[#006B7A] text-sm font-bold hover:underline transition-all"
                >
                  {expandedOrderId === order.id ? "Tutup Detail Pesanan" : "Lihat Detail & Riwayat Status"}
                </button>
              </div>

              {expandedOrderId === order.id && (
                <div className="px-5 py-6 bg-white border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wide">Status Pesanan</h4>
                  
                  <div className="flex items-center justify-between sm:justify-start w-full gap-4 md:gap-12 relative mb-8">
                    <div className="absolute top-3 left-4 right-4 sm:right-auto sm:w-[280px] h-0.5 bg-gray-200 -z-0"></div>
                    {[
                      { step: 1, label: "Dikemas", icon: Package },
                      { step: 2, label: "Kurir", icon: Clock },
                      { step: 3, label: "Kirim", icon: Truck },
                      { step: 4, label: "Selesai", icon: CheckCircle2 }
                    ].map((item) => (
                      <div key={item.step} className="flex flex-col items-center gap-1.5 relative z-10 bg-white px-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-bold text-gray-800 text-xs mb-4 tracking-wider">RIWAYAT STATUS</h5>
                      <div className="space-y-4 pl-3 border-l-2 border-gray-100">
                        {order.statusHistory?.map((history, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#006B7A] border-2 border-white ring-1 ring-gray-100 shadow-sm"></div>
                            <p className="text-xs font-bold text-gray-900 mb-0.5">{STATUS_LABEL[history.status] || history.status}</p>
                            <p className="text-[11px] text-gray-500 mb-1.5">{formatDate(history.createdAt)}</p>
                            {history.note && <p className="text-[11px] text-gray-600 bg-gray-50 px-2 py-1.5 rounded inline-block border border-gray-100">{history.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-bold text-gray-800 text-xs mb-4 tracking-wider">INFO PENGIRIMAN</h5>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                        <p className="font-bold text-gray-900 mb-1">{order.address?.recipient || "Pembeli"} <span className="text-gray-500 font-normal">({order.address?.phone || "-"})</span></p>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4">{order.address?.detail || "Alamat pengiriman tidak tersedia"}</p>
                        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">Metode Pengiriman</span>
                          <span className="text-xs font-black text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">{order.deliveryMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))
        )}
      </div>

      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Beri Ulasan Produk</h3>
                <p className="text-sm text-gray-500 mt-1">Pesanan #{reviewModalOrder.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={() => setReviewModalOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {reviewsForm.map((review, idx) => (
                <div key={review.productId} className={`p-4 border rounded-xl ${review.rating === 0 ? 'border-gray-200' : 'border-[#006B7A]/30 bg-teal-50/20'}`}>
                  <div className="flex gap-4 items-center mb-4">
                    <img src={getImageUrl(review.image)} alt={review.productName} className="w-16 h-16 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                    <h4 className="font-bold text-gray-900 text-sm flex-1">{review.productName}</h4>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-700 mb-2">Bintang *</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => handleReviewChange(review.productId, 'rating', star)}
                          className="p-1 focus:outline-none transform transition-transform hover:scale-110"
                        >
                          <Star className={`w-8 h-8 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-2">Ulasan (Opsional)</p>
                    <textarea 
                      placeholder="Ceritakan pengalamanmu dengan produk ini..."
                      rows="3"
                      value={review.comment}
                      onChange={(e) => handleReviewChange(review.productId, 'comment', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10 flex justify-end gap-3">
              <button 
                onClick={() => setReviewModalOrder(null)}
                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmitReviews}
                disabled={submittingReview}
                className="px-6 py-2.5 rounded-lg font-bold text-white bg-[#006B7A] hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {submittingReview ? "Menyimpan..." : "Kirim Ulasan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#006B7A] hover:border-teal-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Kembali
          </button>
          
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                  currentPage === page 
                    ? "bg-gradient-to-br from-[#006B7A] to-teal-700 text-white shadow-md transform scale-105" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#006B7A]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#006B7A] hover:border-teal-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Lanjut
          </button>
        </div>
      )}
    </div>
  );
}
