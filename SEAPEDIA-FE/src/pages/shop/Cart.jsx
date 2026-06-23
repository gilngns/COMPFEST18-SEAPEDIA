import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ShieldCheck, AlertCircle } from "lucide-react";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { getImageUrl } from "../../utils/image";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadCart = async () => {
        try {
            const res = await api.get("/cart");
            setCart(res.data.data);
        } catch (err) {
            console.error("Gagal memuat keranjang", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = async (itemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        
        try {
            await api.put(`/cart/${itemId}`, { quantity: newQty });
            loadCart();
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.error || err.response?.data?.message || "Stok tidak cukup" });
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            loadCart();
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal", text: "Gagal menghapus item" });
        }
    };

    const handleClearCart = async () => {
        const confirm = await Swal.fire({
            title: 'Kosongkan keranjang?',
            text: "Semua barang akan dihapus dari keranjang.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, kosongkan'
        });

        if (confirm.isConfirmed) {
            try {
                await api.delete("/cart");
                loadCart();
            } catch (err) {
                Swal.fire('Gagal', 'Gagal mengosongkan keranjang', 'error');
            }
        }
    };

    const cartItems = cart?.items || [];
    const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
            <PublicNavbar />

            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 w-full flex-1">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
                    {cartItems.length > 0 && (
                        <button onClick={handleClearCart} className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Kosongkan Keranjang
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* CART ITEMS LIST */}
                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500 font-medium">Memuat keranjang...</div>
                        ) : cartItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
                                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-lg font-bold text-gray-800 mb-2">Keranjang belanjamu kosong</h2>
                                <p className="text-gray-500 mb-6 text-sm">Yuk, cari barang impianmu sekarang!</p>
                                <Link to="/" className="bg-[#006B7A] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#005a66] transition-colors">
                                    Mulai Belanja
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-bold mb-0.5">Aturan Single-Store</p>
                                        <p>Keranjang ini hanya berisi produk dari toko <strong>{cartItems[0].product.store.name}</strong>. Anda tidak dapat checkout barang dari toko berbeda secara bersamaan.</p>
                                    </div>
                                </div>
                                {cartItems.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                            <img src={getImageUrl(item.product.images?.[0])} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />
                                            <div className="flex-1">
                                                <Link to={`/product/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-[#006B7A] line-clamp-2 mb-1">{item.product.name}</Link>
                                                <p className="text-base font-black text-[#ff8c00]">{rupiah(item.product.price)}</p>
                                                <p className="text-xs text-gray-500 mt-1">Sisa stok: {item.product.stock}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-end w-full sm:w-auto gap-6 sm:pl-4">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            
                                            <div className="flex items-center border border-gray-300 rounded-lg h-9 px-1">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* SUMMARY CART */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4">Ringkasan Belanja</h2>
                            
                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-gray-600">Total Harga ({totalItems} barang)</span>
                                <span className="text-gray-800">{rupiah(totalPrice)}</span>
                            </div>
                            
                            <div className="h-px bg-gray-100 my-4"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900">Total Belanja</span>
                                <span className="text-lg font-black text-[#ff8c00]">{rupiah(totalPrice)}</span>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                disabled={cartItems.length === 0}
                                className="w-full bg-[#ff8c00] hover:bg-[#e67e00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold h-11 rounded-lg transition-colors mb-3"
                            >
                                Checkout
                            </button>

                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 p-2 rounded text-green-700">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Transaksi aman & terlindungi.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
