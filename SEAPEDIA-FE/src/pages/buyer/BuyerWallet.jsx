import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, Plus } from "lucide-react";
import Swal from "sweetalert2";

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

  const loadWallet = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get("/buyer/wallet"),
        api.get("/buyer/wallet/transactions")
      ]);
      setBalance(walletRes.data.data?.balance || 0);
      setTransactions(txRes.data.data || []);
    } catch (err) {
      console.error("Gagal memuat wallet", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || Number(topUpAmount) <= 0) {
      return Swal.fire({ icon: "warning", text: "Masukkan nominal yang valid" });
    }
    
    setIsToppingUp(true);
    try {
      await api.post("/buyer/wallet/topup", { amount: Number(topUpAmount) });
      Swal.fire({
        icon: "success",
        title: "Top Up Berhasil",
        text: `Saldo sebesar ${rupiah(topUpAmount)} telah ditambahkan`,
        timer: 1500,
        showConfirmButton: false
      });
      setTopUpAmount("");
      loadWallet();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.error || "Top up gagal" });
    } finally {
      setIsToppingUp(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 font-medium">Memuat data wallet...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dompet Digital</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-[#006B7A] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden md:col-span-1 flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 font-medium mb-1">
              <Wallet className="w-5 h-5" />
              <span>Saldo Tersedia</span>
            </div>
            <h3 className="text-3xl font-black mb-4">{rupiah(balance)}</h3>
          </div>
          <div className="relative z-10 text-sm text-white/80">
            Gunakan saldo ini untuk checkout pesanan
          </div>
        </div>

        {/* Top Up Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2 flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#006B7A]" />
            Top Up Saldo (Dummy)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Masukkan nominal untuk mensimulasikan top-up saldo wallet.</p>
          
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
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] transition-colors"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isToppingUp}
              className="px-6 py-3 bg-[#ff8c00] text-white font-bold rounded-xl hover:bg-[#e67e00] transition-colors disabled:opacity-50 whitespace-nowrap"
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
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {rupiah(amt)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-900">Riwayat Transaksi</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada riwayat transaksi.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map(tx => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                    <p className="font-semibold text-gray-900">{formatDescription(tx.description) || tx.type}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className={`font-bold ${
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
    </div>
  );
}
