import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Wallet, Truck, FileText, CheckCircle } from "lucide-react";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { useOrders } from "../../hooks/usecases/useOrders";
import { useBuyer } from "../../hooks/usecases/useBuyer";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function Checkout() {
    const [preview, setPreview] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [wallet, setWallet] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState("REGULAR");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [discountInput, setDiscountInput] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState("");
    const [discountError, setDiscountError] = useState("");
    const navigate = useNavigate();

    const { previewCheckout, checkout } = useOrders();
    const { getAddresses, getWallet } = useBuyer();

    const DELIVERY_FEES = {
        INSTANT: 25000,
        NEXT_DAY: 15000,
        REGULAR: 10000,
    };

    const loadPreview = useCallback(async (code = "") => {
        try {
            const data = await previewCheckout(code);
            if (data) {
                setPreview(data);
                if (code) {
                    setAppliedDiscount(code);
                    setDiscountError("");
                } else {
                    setAppliedDiscount("");
                    setDiscountError("");
                    setDiscountInput("");
                }
            }
        } catch (err) {
            if (code) {
                setDiscountError(err.response?.data?.message || "Kode diskon tidak valid");
                setAppliedDiscount("");
                setDiscountInput("");
                const data = await previewCheckout("");
                if (data) setPreview(data);
            } else {
                Swal.fire("Gagal", err.response?.data?.message || err.message, "error");
                navigate('/cart');
            }
        }
    }, [previewCheckout, navigate]);

    useEffect(() => {
        const loadCheckoutData = async () => {
            try {
                const [addrRes, walletRes] = await Promise.all([
                    getAddresses(),
                    getWallet()
                ]);
                
                await loadPreview();
                const addrs = addrRes || [];
                setAddresses(addrs);
                
                const defaultAddr = addrs.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddress(defaultAddr.id);
                else if (addrs.length > 0) setSelectedAddress(addrs[0].id);

                setWallet(walletRes?.balance || 0);
            } catch (err) {
                console.error(err);
                if (err?.response?.status === 400 || err?.status === 400) {
                    navigate('/cart');
                } else {
                    Swal.fire("Error", "Gagal memuat data checkout", "error");
                }
            } finally {
                setLoading(false);
            }
        };

        loadCheckoutData();
    }, [navigate, loadPreview, getAddresses, getWallet]);

    const handleCheckout = async () => {
        if (!selectedAddress) {
            return Swal.fire({ icon: "warning", text: "Silakan pilih alamat pengiriman" });
        }

        const deliveryFee = DELIVERY_FEES[deliveryMethod];
        const discountAmount = preview.discount || 0;
        const total = preview.subtotal - discountAmount + preview.ppn + deliveryFee;

        if (Number(wallet) < total) {
            return Swal.fire({ 
                icon: "error", 
                title: "Saldo Kurang", 
                text: "Saldo wallet tidak mencukupi. Silakan top up terlebih dahulu." 
            });
        }

        const confirm = await Swal.fire({
            title: 'Konfirmasi Pembayaran',
            html: `Saldo Wallet Anda: <b>${rupiah(wallet)}</b><br/>Akan dipotong sebesar: <b>${rupiah(total)}</b>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Bayar Sekarang',
            cancelButtonText: 'Batal'
        });

        if (confirm.isConfirmed) {
            setProcessing(true);
            try {
                await checkout({
                    addressId: selectedAddress,
                    deliveryMethod,
                    discountCode: appliedDiscount
                });
                await Swal.fire({
                    icon: "success",
                    title: "Pesanan Berhasil!",
                    text: "Pesanan Anda telah dibuat dan sedang diproses.",
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate("/buyer/orders");
            } catch (err) {
                Swal.fire("Gagal", err.response?.data?.message || err.message || "Checkout gagal", "error");
                setProcessing(false);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicNavbar />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-gray-500 font-medium">Memuat rincian checkout...</div>
            </main>
        </div>
    );

    const deliveryFee = DELIVERY_FEES[deliveryMethod];
    const discountAmount = preview.discount || 0;
    const total = preview.subtotal - discountAmount + preview.ppn + deliveryFee;

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
            <PublicNavbar />

            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 w-full flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-[#006B7A]" /> Checkout
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        
                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Alamat Pengiriman</h2>
                            </div>
                            <div className="p-5">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500 mb-3">Anda belum memiliki alamat pengiriman.</p>
                                        <Link to="/buyer/address" className="text-[#006B7A] font-bold hover:underline">Tambah Alamat Baru</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map(addr => (
                                            <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-[#006B7A] bg-[#006B7A]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="address" 
                                                    className="mt-1 accent-[#006B7A]" 
                                                    checked={selectedAddress === addr.id}
                                                    onChange={() => setSelectedAddress(addr.id)}
                                                />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{addr.label}</h4>
                                                    <p className="text-sm font-semibold text-gray-700">{addr.recipient} ({addr.phone})</p>
                                                    <p className="text-sm text-gray-600 mt-1">{addr.detail}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Pesanan ({preview.items.length} item)</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {preview.items.map(item => (
                                    <div key={item.productId} className="p-5 flex justify-between items-center">
                                        <div className="flex-1 pr-4">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x {rupiah(item.price)}</p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {rupiah(item.subtotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Metode Pengiriman</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(DELIVERY_FEES).map(([method, fee]) => (
                                    <label key={method} className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer text-center transition-colors ${deliveryMethod === method ? 'border-[#006B7A] bg-[#006B7A]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input 
                                            type="radio" 
                                            name="delivery" 
                                            className="hidden" 
                                            checked={deliveryMethod === method}
                                            onChange={() => setDeliveryMethod(method)}
                                        />
                                        <span className="font-bold text-gray-900 text-sm">{method.replace('_', ' ')}</span>
                                        <span className="text-[#ff8c00] font-black">{rupiah(fee)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Voucher / Promo Section */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                <h2 className="font-bold text-gray-900">Voucher & Promo</h2>
                            </div>
                            <div className="p-5">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan kode voucher / promo" 
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B7A]/20 focus:border-[#006B7A] uppercase"
                                        value={discountInput}
                                        onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                                        disabled={!!appliedDiscount}
                                    />
                                    {appliedDiscount ? (
                                        <button 
                                            onClick={() => loadPreview("")} 
                                            className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => loadPreview(discountInput)} 
                                            disabled={!discountInput || loading}
                                            className="px-4 py-2 bg-[#006B7A] text-white font-bold rounded-lg hover:bg-[#005a66] disabled:opacity-50 transition-colors"
                                        >
                                            Pakai
                                        </button>
                                    )}
                                </div>
                                {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                                {appliedDiscount && <p className="text-emerald-600 text-sm mt-2 font-medium">Diskon {appliedDiscount} berhasil diterapkan!</p>}
                            </div>
                        </div>

                    </div>

                    {}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                        
                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#006B7A]/10 flex items-center justify-center text-[#006B7A]">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Saldo Wallet</p>
                                    <p className="font-black text-gray-900">{rupiah(wallet)}</p>
                                </div>
                            </div>
                            {Number(wallet) < total && (
                                <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 mt-2">
                                    Saldo tidak cukup. Silakan top up di menu <Link to="/buyer/wallet" className="font-bold underline">Wallet</Link>.
                                </div>
                            )}
                        </div>

                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
                            
                            <div className="space-y-3 text-sm mb-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Subtotal Produk</span>
                                    <span>{rupiah(preview.subtotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-red-500 font-medium">
                                        <span>Diskon</span>
                                        <span>-{rupiah(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Biaya Pengiriman</span>
                                    <span>{rupiah(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>PPN (12%)</span>
                                    <span>{rupiah(preview.ppn)}</span>
                                </div>
                            </div>
                            
                            <div className="h-px bg-gray-100 my-4"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900">Total Tagihan</span>
                                <span className="text-xl font-black text-[#ff8c00]">{rupiah(total)}</span>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={processing || !selectedAddress || Number(wallet) < total}
                                className="w-full bg-[#ff8c00] hover:bg-[#e67e00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold h-12 rounded-lg transition-colors mb-3"
                            >
                                {processing ? "Memproses..." : "Bayar Sekarang"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
