import { useState, useEffect, useCallback } from "react";
import DashboardOverview from "../../components/DashboardOverview";
import { Package, MapPin, Store, ArrowRight, Wallet, Truck } from "lucide-react";
import { useDriver } from "../../hooks/usecases/useDriver";
import { useNavigate } from "react-router-dom";

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

export default function DriverJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAvailableJobs, takeJob } = useDriver();

  const loadJobs = useCallback(async () => {
    try {
      const data = await getAvailableJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAvailableJobs]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const navigate = useNavigate();

  return (
    <div className="min-h-full pb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Cari Job</h2>
        <p className="text-gray-500 text-sm">Temukan pesanan yang siap untuk dikirim hari ini.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Mencari job...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada job tersedia saat ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {jobs.map(job => (
            <div key={job.id} className="relative bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row gap-4 sm:gap-6">
              
              {/* Dekorasi Glow di Belakang */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl -z-10 group-hover:bg-teal-500/10 transition-colors"></div>

              {/* Rute Visual (Kiri) */}
              <div className="hidden sm:flex flex-col items-center justify-between py-1 shrink-0 relative">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center z-10 border-2 border-white shadow-sm">
                  <Store className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <div className="absolute top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-200 via-gray-200 to-teal-200 border-dashed"></div>
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center z-10 border-2 border-white shadow-sm mt-8">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                </div>
              </div>

              {/* Detail Info (Tengah) */}
              <div className="flex-1 flex flex-col justify-center gap-3">
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gray-900 text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase shadow-sm">
                    ORDER #{job.id.substring(0,6)}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Package className="w-3 h-3 text-gray-400" />
                    {job.items.reduce((acc, curr) => acc + curr.quantity, 0)} Item Bawaan
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="sm:hidden w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Store className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pengirim</p>
                    <h3 className="font-bold text-gray-900 text-sm truncate">{job.store?.name}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="sm:hidden w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Tujuan</p>
                    <p className="font-black text-gray-900 text-base leading-tight">{job.address?.recipient}</p>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm truncate">{job.address?.detail}</p>
                  </div>
                </div>
                
              </div>

              {/* Penghasilan & Aksi (Kanan) */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5 sm:ml-2 sm:w-40 shrink-0 relative">
                
                <div className="text-left sm:text-right mb-0 sm:mb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Upah Kirim</p>
                  <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                    {formatRupiah(job.deliveryFee)}
                  </p>
                </div>

                <button 
                  onClick={() => navigate(`/driver/jobs/${job.id}`)}
                  className="px-4 py-2 sm:py-2.5 sm:w-full bg-[#006B7A] text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-teal-500/30 flex items-center justify-center gap-1.5 text-sm"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
