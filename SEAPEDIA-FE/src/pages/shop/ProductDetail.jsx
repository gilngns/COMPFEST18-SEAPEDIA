import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import Swal from "sweetalert2";
import {
    Search, Bell, ShoppingCart, User, Star, Check,
    Truck, Minus, Plus
} from "lucide-react";
import Footer from "../../components/Footer";
import LoginModal from "../../components/LoginModal";
import PublicNavbar from "../../components/PublicNavbar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/usecases/useCart";
import { useCatalog } from "../../hooks/usecases/useCatalog";
import { getImageUrl } from "../../utils/image";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}


const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=90",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80"
];

export default function ProductDetail() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [activeColor, setActiveColor] = useState("Default");
    const [activeTab, setActiveTab] = useState("Detail Produk");
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { getProductDetail } = useCatalog();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductDetail(id);
                setProduct(data);
            } catch (error) {
                console.error("Gagal memuat detail produk:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, getProductDetail]);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">Memuat produk...</div>;
    }

    const handleAddToCart = async (isBuyNow = false) => {
        setIsAdding(true);
        try {
            const result = await addToCart(product.id, quantity);
            
            if (!result.success) {
                throw { response: { status: result.status || (result.code === "DIFFERENT_STORE" ? 409 : 400), data: { message: result.error, error: result.error } } };
            }
            if (!isBuyNow) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Produk ditambahkan ke keranjang",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            return true;
        } catch (err) {
            if (err.response?.status === 409) {
                
                const confirm = await Swal.fire({
                    title: "Beda Toko",
                    text: err.response.data.message,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Ya, kosongkan",
                    cancelButtonText: "Batal"
                });

                if (confirm.isConfirmed) {
                    try {
                        const replaceResult = await addToCart(product.id, quantity, true);
                        if (!replaceResult.success) {
                            throw new Error(replaceResult.error);
                        }
                        if (!isBuyNow) {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil",
                                text: "Produk ditambahkan ke keranjang",
                                timer: 1500,
                                showConfirmButton: false
                            });
                        }
                        return true;
                    } catch (e) {
                        Swal.fire("Gagal", e.response?.data?.error || "Terjadi kesalahan", "error");
                        return false;
                    }
                }
                return false;
            } else if (err.response?.status === 401) {
                setShowLoginModal(true);
                return false;
            } else if (err.response?.status === 403) {
                Swal.fire({
                    icon: "warning",
                    title: "Akses Ditolak",
                    text: "Hanya role Pembeli (BUYER) yang bisa menggunakan fitur belanja. Silakan login kembali sebagai Pembeli.",
                    confirmButtonColor: "#006B7A"
                });
                return false;
            } else {
                Swal.fire("Gagal", err.response?.data?.error || "Gagal memproses permintaan", "error");
                return false;
            }
        } finally {
            setIsAdding(false);
        }
    };

    if (!product) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">Produk tidak ditemukan</div>;
    }

    const displayImages = [
        getImageUrl(product.images?.[0], FALLBACK_IMAGES[0]),
        getImageUrl(product.images?.[1], FALLBACK_IMAGES[1]),
        getImageUrl(product.images?.[2], FALLBACK_IMAGES[2])
    ];
    const isMall = product.store?.name?.toLowerCase()?.includes("official");
    const sellerInitial = product.store?.name?.charAt(0) || "S";
    const defaultFeatures = [
        "100% Produk Original",
        "Pengiriman Cepat & Aman",
        "Garansi Toko 7 Hari"
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <PublicNavbar />

            {}
            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {}
                    <div className="w-full lg:w-[65%] space-y-6">
                        {}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-3 gap-3">
                                {}
                                <div className="col-span-2 aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                    <img src={displayImages[0]} alt="Main" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                                {}
                                <div className="col-span-1 flex flex-col gap-3">
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative group cursor-pointer">
                                        <img src={displayImages[1]} alt="Detail 1" className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/5"></div>
                                    </div>
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative group cursor-pointer">
                                        <img src={displayImages[2]} alt="Detail 2" className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex gap-8 border-b border-gray-200 mb-6">
                                {["Detail Produk", `Ulasan (${product.reviews?.length || 0})`].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                                            activeTab === tab 
                                                ? "text-[#006B7A] border-[#006B7A]" 
                                                : "text-gray-500 border-transparent hover:text-gray-700"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {activeTab === "Detail Produk" && (
                                <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                                    <p className="whitespace-pre-wrap">{product.description || "Deskripsi tidak tersedia."}</p>
                                    <ul className="list-disc pl-5 space-y-1.5">
                                        {defaultFeatures.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {activeTab.startsWith("Ulasan") && (
                                <div className="text-gray-700 text-sm py-4 space-y-4">
                                    {(!product.reviews || product.reviews.length === 0) ? (
                                        <p className="text-gray-500 text-center py-8">Belum ada ulasan untuk produk ini.</p>
                                    ) : (
                                        product.reviews.map(review => (
                                            <div key={review.id} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs uppercase">
                                                        {review.buyer?.username?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-xs">{review.buyer?.username}</p>
                                                        <p className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`w-3.5 h-3.5 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                {review.comment && <p className="text-gray-600 text-xs leading-relaxed">{review.comment}</p>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="w-full lg:w-[35%] space-y-6">
                        
                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-3">
                                {isMall && (
                                    <span className="bg-blue-100 text-[#006B7A] text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                                        MALL
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-700">{
                                        product.reviews?.length > 0 
                                        ? (product.reviews.reduce((a, c) => a + c.rating, 0) / product.reviews.length).toFixed(1)
                                        : "0.0"
                                    }</span>
                                    <span>• Terjual {product.reviews?.length || 0}</span>
                                    <span>• Stok {product.stock}</span>
                                </div>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                                {product.name}
                            </h1>
                            
                            <p className="text-3xl font-black text-[#ff8c00] mb-6">
                                {rupiah(product.price)}
                            </p>

                            <div className="mb-6">
                                <p className="text-sm font-bold text-gray-800 mb-3">
                                    Varian Tersedia: <span className="font-normal text-gray-600">{activeColor}</span>
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveColor("Default")}
                                        className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${
                                            activeColor === "Default" ? "border-[#006B7A]" : "border-gray-200"
                                        }`}
                                    >
                                        <img src={displayImages[0]} alt="Default Variant" className="w-full h-full object-cover" />
                                        {activeColor === "Default" && (
                                            <div className="absolute -bottom-1 -right-1 bg-[#006B7A] rounded-full w-4 h-4 flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 flex gap-3 items-start">
                                <Truck className="w-5 h-5 text-[#006B7A] shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 mb-1">Pengiriman</p>
                                    <p className="text-xs text-gray-600 mb-2">Dikirim dari <span className="font-bold">Jakarta Pusat</span></p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Ongkir Reguler Rp 10.000</span>
                                        <span className="text-[#006B7A] font-medium">Estimasi 1-2 hari</span>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center border border-gray-300 rounded-lg h-11 px-2 shrink-0">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            const itemInCart = cart?.items?.find(item => item.product.id === product?.id);
                                            const qtyInCart = itemInCart ? itemInCart.quantity : 0;
                                            const maxAvail = product.stock - qtyInCart;
                                            setQuantity(Math.min(Math.max(1, val), Math.max(1, maxAvail)));
                                        }}
                                        className="w-12 text-center text-sm font-bold text-gray-800 outline-none hide-arrows" 
                                    />
                                    <button 
                                        onClick={() => {
                                            const itemInCart = cart?.items?.find(item => item.product.id === product?.id);
                                            const qtyInCart = itemInCart ? itemInCart.quantity : 0;
                                            const maxAvail = product.stock - qtyInCart;
                                            if (quantity < maxAvail) setQuantity(quantity + 1);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {cart?.items?.find(item => item.product.id === product?.id) && (
                                    <span className="text-xs text-gray-500 font-medium">
                                        (Ada {cart.items.find(item => item.product.id === product.id).quantity} di keranjang)
                                    </span>
                                )}
                            </div>
                            {(!user || user.activeRole === "BUYER") && (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleAddToCart(false)}
                                        disabled={isAdding || product.stock === 0}
                                        className="flex-1 h-11 border border-[#006B7A] text-[#006B7A] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#006B7A]/5 transition-colors disabled:opacity-50"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> {isAdding ? "Menambahkan..." : "Keranjang"}
                                    </button>
                                    <button 
                                        disabled={isAdding || product.stock === 0}
                                        className="flex-1 h-11 bg-[#ff8c00] hover:bg-[#e67e00] text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                        onClick={async () => {
                                            const success = await handleAddToCart(true);
                                            if (success) {
                                                navigate('/checkout');
                                            }
                                        }}
                                    >
                                        Beli Sekarang
                                    </button>
                                </div>
                            )}
                        </div>

                        {}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#006B7A]/10 text-[#006B7A] font-bold text-xl flex items-center justify-center border border-gray-100">
                                    {sellerInitial}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {isMall && <Check className="w-3.5 h-3.5 text-white bg-[#006B7A] rounded-full p-0.5" />}
                                        <p className="text-sm font-bold text-gray-900">{product.store?.name || "Toko Bebas"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
