import { useState, useEffect, useCallback } from "react";
import { Truck, CheckCircle2, MapPin, Package } from "lucide-react";
import Swal from "sweetalert2";
import { useDriver } from "../../hooks/usecases/useDriver";
import { getImageUrl } from "../../utils/image";
import { generateCoordsFromId } from "../../utils/geo";
import MapRoute from "../../components/driver/MapRoute";

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

export default function DriverDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getMyDeliveries, completeJob } = useDriver();

  const loadDeliveries = useCallback(async () => {
    try {
      const data = await getMyDeliveries();
      setDeliveries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMyDeliveries]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const handleCompleteJob = async (orderId) => {
    try {
      await completeJob(orderId);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Pengiriman diselesaikan! Saldo ongkir telah masuk ke dompet Anda.", timer: 2000, showConfirmButton: false });
      loadDeliveries();
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || err.message, "error");
    }
  };

  const activeDeliveries = deliveries.filter(d => !d.completedAt);
  const completedDeliveries = deliveries.filter(d => !!d.completedAt);

  return (
    <div className="min-h-full pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Riwayat Pengiriman</h2>
        <p className="text-gray-500 text-sm">Kelola pesanan aktif dan riwayat pendapatan Anda.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-sm font-medium">Memuat data pengiriman...</div>
      ) : deliveries.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center w-full">
          <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Belum ada riwayat pengiriman.</p>
        </div>
      ) : (
        <div className="w-full">
          {}
          {activeDeliveries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                Sedang Diantar ({activeDeliveries.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                {activeDeliveries.map(d => {
                  const order = d.order;
                  return (
                    <div key={d.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                      <div className="w-full h-40 relative border-b border-gray-100 bg-gray-50">
                        <MapRoute 
                          startCoords={generateCoordsFromId(order.store?.id)} 
                          endCoords={generateCoordsFromId(order.address?.id)} 
                          isAnimating={true}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">ORDER #{order.id.substring(0,8)}</span>
                            <h3 className="font-bold text-gray-900 mt-1 text-sm">{order.store?.name}</h3>
                          </div>
                          <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                            Aktif
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600 mb-4 bg-gray-50/50 p-2.5 rounded-lg border border-gray-50">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-800">{order.address?.recipient}</p>
                            <p className="mt-0.5 text-gray-500 line-clamp-1">{order.address?.detail}</p>
                          </div>
                        </div>
                        <div className="mt-auto border-t border-gray-100 pt-3">
                          <div className="flex justify-between items-end mb-3">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Pendapatan</p>
                              <p className="font-black text-lg text-teal-600">{formatRupiah(d.earning)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCompleteJob(order.id)}
                            className="w-full py-2 bg-[#006B7A] hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Selesaikan Pengiriman
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}
          {completedDeliveries.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Riwayat Selesai ({completedDeliveries.length})
              </h3>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
                {completedDeliveries.map((d, index) => {
                  const order = d.order;
                  return (
                    <div key={d.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors ${index !== completedDeliveries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-gray-900 text-sm">{order.store?.name}</h4>
                            <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-widest">#{order.id.substring(0,8)}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                            {order.address?.recipient} - {order.address?.detail}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                        <p className="font-black text-sm text-teal-600">{formatRupiah(d.earning)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{formatDate(d.completedAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
