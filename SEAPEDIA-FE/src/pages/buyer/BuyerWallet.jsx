import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useBuyer } from "../../hooks/usecases/useBuyer";

function rupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function formatDescription(desc) {
  if (!desc) return "";
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = desc.match(uuidRegex);
  if (match) {
    const uuid = match[0];
    const shortId = uuid.substring(0, 8).toUpperCase();
    return desc.replace(uuid, shortId);
  }
  return desc;
}

export default function BuyerWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { getWallet, getWalletTransactions, topUpWallet } = useBuyer();

  const loadWallet = useCallback(async () => {
    try {
      const [walletData, txData] = await Promise.all([
        getWallet(),
        getWalletTransactions()
      ]);
      setBalance(walletData?.balance || 0);
      setTransactions(txData || []);
    } catch (err) {
      console.error("Gagal memuat wallet", err);
    } finally {
      setLoading(false);
    }
  }, [getWallet, getWalletTransactions]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || Number(topUpAmount) <= 0) {
      return Swal.fire({ icon: "warning", text: "Masukkan nominal yang valid" });
    }
    
    setIsToppingUp(true);
    try {
      await topUpWallet(Number(topUpAmount));
      Swal.fire({
        icon: "success",
        title: "Top Up Berhasil",
        text: `Saldo sebesar ${rupiah(topUpAmount)} telah ditambahkan`,
        timer: 1500,
        showConfirmButton: false
      });
      setTopUpAmount("");
      loadWallet();
      setCurrentPage(1);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message || err.message || "Top up gagal" });
    } finally {
      setIsToppingUp(false);
    }
  };

  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#006B7A] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Memuat data wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-10">
      <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Dompet Digital</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {}
        <div className="bg-[#006B7A] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden md:col-span-1 flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 font-medium mb-1">
              <Wallet className="w-5 h-5" />
              <span>Saldo Tersedia</span>
            </div>
            <h3 className="text-3xl font-black mb-2">{rupiah(balance)}</h3>
          </div>
          <div className="relative z-10 text-sm text-white font-bold bg-white/20 p-2 rounded-lg mt-2">
            Total Pengeluaran: {rupiah(transactions.filter(t => t.type === 'PAYMENT').reduce((sum, t) => sum + Number(t.amount), 0))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm md:col-span-2 flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#006B7A]" />
            Top Up Saldo
          </h3>
          <p className="text-xs text-gray-500 mb-3">Masukkan nominal untuk mensimulasikan top-up saldo wallet.</p>
          
          <form onSubmit={handleTopUp} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">Rp</span>
              <input 
                type="number" 
                value={topUpAmount}
                onChange={e => setTopUpAmount(e.target.value)}
                placeholder="0"
                min="10000"
                step="10000"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors text-sm font-semibold"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isToppingUp}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ff8c00] to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap text-sm"
            >
              {isToppingUp ? "Proses..." : "Top Up"}
            </button>
          </form>

          <div className="flex gap-2 mt-3">
            {[50000, 100000, 500000].map(amt => (
              <button 
                key={amt} 
                type="button"
                onClick={() => setTopUpAmount(amt.toString())}
                className="px-3 py-1.5 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-[#006B7A] hover:border-teal-200 transition-all"
              >
                {rupiah(amt)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
            <History className="w-4 h-4 text-[#006B7A]" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Riwayat Transaksi</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada riwayat transaksi.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentTransactions.map(tx => (
              <div key={tx.id} className="py-2.5 px-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    tx.type === 'TOPUP' || tx.type === 'REFUND' || tx.type === 'EARNING' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'TOPUP' || tx.type === 'REFUND' || tx.type === 'EARNING' 
                      ? <ArrowDownCircle className="w-5 h-5" />
                      : <ArrowUpCircle className="w-5 h-5" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#006B7A] transition-colors">{formatDescription(tx.description) || tx.type}</p>
                    <p className="text-[11px] text-gray-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className={`font-black text-sm ${
                  tx.type === 'TOPUP' || tx.type === 'REFUND' || tx.type === 'EARNING' 
                  ? 'text-green-600' 
                  : 'text-red-600'
                }`}>
                  {tx.type === 'TOPUP' || tx.type === 'REFUND' || tx.type === 'EARNING' ? '+' : '-'}{rupiah(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
