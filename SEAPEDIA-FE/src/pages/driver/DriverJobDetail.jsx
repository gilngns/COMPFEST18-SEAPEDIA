import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDriver } from "../../hooks/usecases/useDriver";
import { MapPin, Truck, Store, Package, ArrowLeft, Info } from "lucide-react";
import Swal from "sweetalert2";
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

export default function DriverJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobDetail, takeJob } = useDriver();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const data = await getJobDetail(id);
      setJob(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Tidak dapat memuat detail pesanan.", "error");
      navigate('/driver/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, getJobDetail, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleTakeJob = async () => {
    try {
      await takeJob(id);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Job berhasil diambil!", timer: 1500, showConfirmButton: false });
      navigate('/driver/deliveries');
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || err.message, "error");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500 font-medium">Memuat detail pesanan...</div>;
  }

  if (!job) return null;

  return (
    <div className="w-full pb-10">
      <button 
        onClick={() => navigate('/driver/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-4 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Job
      </button>

      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-100 mb-5">
          <div>
            <span className="bg-gray-900 text-white px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm">
              ORDER #{job.id.substring(0,8)}
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-3">Detail Pekerjaan</h1>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Upah Kirim</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              {formatRupiah(job.deliveryFee)}
            </p>
          </div>
        </div>

        {/* Peta Interaktif */}
        <div className="w-full h-64 md:h-80 mb-6 rounded-2xl overflow-hidden shadow-inner">
          <MapRoute 
            startCoords={generateCoordsFromId(job.store?.id)} 
            endCoords={generateCoordsFromId(job.address?.id)} 
            isAnimating={true}
          />
        </div>

        {/* Alamat Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Titik Jemput */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Store className="w-3 h-3 text-orange-600" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm">Lokasi Pengambilan</h2>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
              <p className="font-bold text-gray-900 text-base mb-1">{job.store?.name}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-1">{job.store?.address || "Alamat toko belum diatur"}</p>
              <p className="text-xs font-bold text-orange-600">{job.store?.city || "Jakarta"}</p>
            </div>
          </div>

          {/* Titik Antar */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3 text-teal-600" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm">Tujuan Pengiriman</h2>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
              <p className="font-bold text-gray-900 text-base mb-1">{job.address?.recipient}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{job.address?.detail}</p>
            </div>
          </div>
        </div>

        {/* Daftar Barang */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Package className="w-3 h-3 text-gray-600" />
            </div>
            <h2 className="font-bold text-gray-800 text-sm">Rincian Barang Bawaan ({job.items.reduce((acc, curr) => acc + curr.quantity, 0)} Item)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {job.items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-gray-300 transition-colors">
                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                  {item.product.images?.[0] ? (
                    <img src={getImageUrl(item.product.images[0])} alt="product" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs line-clamp-2 leading-tight mb-1">{item.product.name}</h3>
                  <p className="text-[10px] font-bold text-teal-600 bg-teal-50 inline-block px-1.5 py-0.5 rounded">Jumlah: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleTakeJob}
          className="w-full py-3 bg-[#006B7A] text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2 text-base"
        >
          <Truck className="w-5 h-5" /> Ambil Pekerjaan Ini
        </button>

        <div className="mt-4 flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-xl text-xs font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Pastikan Anda siap mengirimkan barang ini hari ini. Pekerjaan yang sudah diambil tidak dapat dibatalkan melalui sistem.</p>
        </div>
      </div>
    </div>
  );
}
