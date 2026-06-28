import { useEffect, useState, useCallback } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useSeller } from "../../hooks/usecases/useSeller";
import { 
  Wallet, 
  Building2, 
  CalendarDays, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowDownRight
} from "lucide-react";



function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

export default function SellerFinance() {
  const [storeName, setStoreName] = useState("Toko Saya");
  const [storeLogo, setStoreLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("7 Hari Terakhir");
  const [selectedType, setSelectedType] = useState("Semua Tipe");

  const { getMyStore, getWallet, getWalletTransactions } = useSeller();

  const loadData = useCallback(async () => {
    try {
      const store = await getMyStore();
      if (store) {
        setStoreName(store.name);
        setStoreLogo(store.logoUrl);
      }
      const wallet = await getWallet();
      if (wallet) {
        setWalletBalance(Number(wallet.balance) || 0);
      }
      const txs = await getWalletTransactions();
      if (txs) {
        setTransactions(txs);
        
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const w = txs.filter(t => 
          t.amount < 0 && 
          new Date(t.createdAt).getMonth() === currentMonth &&
          new Date(t.createdAt).getFullYear() === currentYear
        ).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        setMonthlyWithdrawal(w);

        const income = txs.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
        setTotalIncome(income);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMyStore, getWallet, getWalletTransactions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <SellerLayout storeName={storeName} storeLogo={storeLogo}>
        <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Memuat data keuangan...</div>
      </SellerLayout>
    );
  }

  const filteredTransactions = transactions.filter(tx => {
    const amountNum = Number(tx.amount);
    if (selectedType === 'Uang Masuk' && amountNum <= 0) return false;
    if (selectedType === 'Uang Keluar' && amountNum >= 0) return false;

    const txDate = new Date(tx.createdAt);
    const now = new Date();
    
    if (selectedDate === 'Hari Ini') {
      if (txDate.toDateString() !== now.toDateString()) return false;
    } else if (selectedDate === '7 Hari Terakhir') {
      const diffTime = Math.abs(now - txDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 7) return false;
    } else if (selectedDate === '30 Hari Terakhir') {
      const diffTime = Math.abs(now - txDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 30) return false;
    } else if (selectedDate === 'Bulan Ini') {
      if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
    }

    return true;
  });

  return (
    <SellerLayout storeName={storeName} storeLogo={storeLogo}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Keuangan</h2>
        <p className="text-gray-500 mt-0.5 text-sm">
          Kelola saldo dan riwayat transaksi toko Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#006B7A] to-[#004d58] rounded-xl shadow-md px-6 py-4 relative overflow-hidden text-white flex flex-col justify-center">
          {}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/80 font-medium text-[13px] mb-1">
                <Wallet className="w-4 h-4 text-white" />
                Total Saldo Aktif
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-0.5">
                {formatRupiah(walletBalance)}
              </h3>
              <p className="text-[12px] text-white/70 font-medium">
                Total saldo yang Anda miliki saat ini
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {}
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col gap-3">
          {}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-2.5 hover:border-gray-300 transition-colors flex items-center justify-between flex-1">
            <div>
              <p className="text-gray-500 font-medium text-[11px] mb-0.5">Total Pemasukan</p>
              <p className="text-lg font-bold text-gray-900 tracking-tight">{formatRupiah(totalIncome)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-2.5 hover:border-gray-300 transition-colors flex items-center justify-between flex-1">
            <div>
              <p className="text-gray-500 font-medium text-[11px] mb-0.5">Penarikan (Bulan Ini)</p>
              <p className="text-lg font-bold text-gray-900 tracking-tight">{formatRupiah(monthlyWithdrawal)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex-1 flex flex-col min-h-0">
        {}
        <div className="bg-[#006B7A] p-4 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Riwayat Transaksi</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowTypeDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium text-white hover:bg-white/20 transition-colors shadow-sm w-full sm:w-auto justify-between backdrop-blur-sm min-w-[145px]"
              >
                {selectedDate}
                <CalendarDays className="w-3.5 h-3.5 text-white/80" />
              </button>
              
              {showDateDropdown && (
                <>
                  {}
                  <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)}></div>
                  <div className="absolute right-0 sm:left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden transform origin-top-right transition-all">
                    {['Hari Ini', '7 Hari Terakhir', '30 Hari Terakhir', 'Bulan Ini'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedDate(opt); setShowDateDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${selectedDate === opt ? 'bg-teal-50 text-[#006B7A] font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#006B7A]'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowDateDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium text-white hover:bg-white/20 transition-colors shadow-sm w-full sm:w-auto justify-between backdrop-blur-sm min-w-[130px]"
              >
                {selectedType}
                <Filter className="w-3.5 h-3.5 text-white/80" />
              </button>
              
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden transform origin-top-right transition-all">
                    {['Semua Tipe', 'Uang Masuk', 'Uang Keluar'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedType(opt); setShowTypeDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${selectedType === opt ? 'bg-teal-50 text-[#006B7A] font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#006B7A]'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 border-b border-teal-100 text-[#006B7A] text-[11px] font-bold tracking-wider uppercase">
                <th className="py-2.5 px-5 whitespace-nowrap w-1/2">Detail Transaksi</th>
                <th className="py-2.5 px-5 whitespace-nowrap">ID Referensi</th>
                <th className="py-2.5 px-5 text-right whitespace-nowrap">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500 text-sm">Belum ada transaksi</td>
                </tr>
              ) : filteredTransactions.map((tx, idx) => {
                const amountNum = Number(tx.amount);
                return (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-2 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${amountNum > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                          {amountNum > 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-600"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-orange-600"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-[13px]">
                            {tx.description ? tx.description.replace(/([a-f0-9]{8})-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/ig, (match, p1) => p1.toUpperCase()) : tx.type}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {new Date(tx.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-mono group-hover:bg-white transition-colors">
                        {tx.id.split('-')[0] + '-' + tx.id.slice(-4)}
                      </span>
                    </td>
                    <td className="py-2 px-5 text-right">
                      <p className={`font-bold text-[13px] ${amountNum > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {amountNum > 0 ? '+' : '-'} {formatRupiah(Math.abs(amountNum)).replace('Rp', 'Rp ')}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wide">
                        Berhasil
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {}
        <div className="p-3 px-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-500">
            Menampilkan transaksi terbaru
          </span>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
