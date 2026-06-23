import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import api from "../../lib/api";
import PublicNavbar from "../../components/PublicNavbar";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
    Bell, ShoppingCart, User, Zap, ChevronRight, ChevronLeft,
    Check, Star, Tag, Truck, Smartphone, Monitor,
    Armchair, Baby, Sparkles, Car, Utensils, Gamepad2, Shirt,
    Timer, Flame, Quote, Store, X
} from "lucide-react";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function getImageUrl(url, fallback) {
    if (!url) return fallback;
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
}

const CATEGORIES = [
    { icon: Shirt, name: "Fashion" },
    { icon: Monitor, name: "Elektronik" },
    { icon: Gamepad2, name: "Hobi" },
    { icon: Armchair, name: "Furnitur" },
    { icon: Baby, name: "Anak" },
    { icon: Sparkles, name: "Kecantikan" },
    { icon: Car, name: "Otomotif" },
    { icon: Utensils, name: "Makanan" },
];

// Fallback images for products without images from backend
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80",
];

const HERO_BANNERS = [
    {
        id: 1,
        image: "/banner_bg.png",
        title: "Diskon Mengalir Hingga 70%",
        subtitle: "Penawaran terbaik untuk produk pilihanmu, hari ini.",
        cta: "Belanja Sekarang",
        color: "bg-gradient-to-r from-[#006B7A]/90 to-transparent",
        ctaColor: "bg-[#ff8c00] hover:bg-[#e67e00]"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=90",
        title: "Gratis Ongkir Sepuasnya!",
        subtitle: "Nikmati belanja tanpa pusing mikirin biaya kirim ke seluruh Indonesia.",
        cta: "Klaim Voucher",
        color: "bg-gradient-to-r from-[#ff8c00]/90 to-transparent",
        ctaColor: "bg-[#006B7A] hover:bg-[#005a66]"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=90",
        title: "Koleksi Mall Eksklusif",
        subtitle: "Produk brand ternama dengan jaminan 100% original.",
        cta: "Eksplor Mall",
        color: "bg-gradient-to-r from-[#4a00e0]/90 to-transparent",
        ctaColor: "bg-[#ff2a5f] hover:bg-[#e02655]"
    }
];

const TESTIMONIALS = [
    {
        name: "Santi",
        role: "Seller di Jakarta",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS9WciuhX8COJfgBwC0s1pBxBk_pcUY8z-RsWjru-L3dTG5Ke9PWNQVl9h0c4upHT-L07hBEZzEiEqpJIY5nvXi_bFv3RIIoDkwYUCbynwPQFH9A46jSIayeR56IhlwSCetVdRE2BnGmxmIR2B9T6lt_EDmwq2Fd-6NbPPVvUfjB8OHb4wpU3yz4B_iZ2mmjgji25uNGHx617z39nQBpFW4u2_zt1JMiJvmrG6mrqvyXN80Ak7Sa-xcjguRJMHbrKWYijTsyVj_1Ma",
        text: "Sejak pakai Seapedia, manajemen stok jadi jauh lebih rapi. Fitur chat-nya sangat membantu buat koordinasi sama pembeli. Omzet bulanan saya naik 40%!"
    },
    {
        name: "Budi",
        role: "Pembeli di Surabaya",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApXkfIfarf1EvRDkXplYmE966DoFJ-nXUKUMLE7qdfVFraoi39IsY40VZ09LfShsjGYmZpMMYB-qQOyUJvH_OMcicsJArZowvn6-HPzh7IdJ0BwaMUKzCZ3jU87jKwu-H1vebu_5eO9ONnldLt7nCLNFM55RKKFK8aUHaiVioNvsbmy693QM30hoyeYNxz5BJPFA30-5FvbWf6ombKbyjdY-DlGkc2CarF1qMv1gHMbB2Lxbs_4ZSE40sRDHRxHYAj5GQQVymfbxXr",
        text: "Gak pernah nyangka belanja gadget semudah ini. Keamanannya terjamin, pengiriman juga selalu on-time. Admin Seapedia sangat responsif!",
        highlight: true
    },
    {
        name: "Maria",
        role: "Seller di Bali",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-tkqzZx6R3Y7BIg8YurxaOfNQurNTYG_UZbCWjfi2KufeTOQNX7OiDkSeHI2EaJJ44CiFaqaSvgpuarEmQED4k04Zxm5OXZFhXRFzuhZiKMIMiWXCkpsqzmU8BOwrLicupsNRU9sqAHXusNSQsY9TkYP-DSojH63sfbw-hcQArHQQOXhQh4QyPvAqeDoeRTttZS42IY_GhitkmraST6zTEJBelhBcGo94VI42rJ-NW-X9nzIkPDGejcupJrJTk-JEFyP6RTSdInGU",
        text: "Antarmuka aplikasinya bersih banget, gak bikin pusing. Upload produk baru tinggal klik-klik aja. Sangat recommended buat yang baru mau mulai jualan."
    },
    {
        name: "Joko",
        role: "Pembeli di Medan",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        text: "Produk yang dijual sangat beragam dan harganya kompetitif. Saya suka karena sering ada flash sale yang beneran murah, bukan abal-abal."
    },
    {
        name: "Siska",
        role: "Seller di Bandung",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        text: "Proses pencairan dana sangat cepat dan tanpa kendala. Sangat membantu perputaran modal usaha kecil saya. Maju terus Seapedia!"
    },
    {
        name: "Andi",
        role: "Pembeli di Makassar",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        text: "Pengalaman belanja terbaik! UI/UX nya mulus banget, checkout cepat, dan kurir rekomendasinya selalu tepat waktu. Top banget pokoknya."
    }
];

export default function Landing() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/catalog');
                setProducts(res.data.data || []);
            } catch (error) {
                console.error("Gagal memuat produk:", error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchReviews = async () => {
            try {
                const res = await api.get('/reviews');
                if (res.data?.data) {
                    const backendReviews = res.data.data.map(r => ({
                        name: r.name,
                        role: "Pengguna Seapedia",
                        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(r.name) + "&background=006B7A&color=fff",
                        text: r.comment,
                        rating: r.rating || 5
                    }));
                    setReviews(backendReviews);
                }
            } catch (error) {
                console.error("Gagal memuat reviews:", error);
            }
        };
        fetchProducts();
        fetchReviews();
    }, []);

    useEffect(() => {
        if (user && !reviewForm.name) {
            setReviewForm(prev => ({ ...prev, name: user.username }));
        }
    }, [user, reviewForm.name]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const res = await api.post('/reviews', {
                name: reviewForm.name,
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment
            });
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Review berhasil dikirim! Terima kasih atas ulasan Anda.",
                timer: 2000,
                showConfirmButton: false,
            });
            setReviewForm({ name: user ? user.username : "", rating: 5, comment: "" });
            setIsReviewModalOpen(false);
            const newR = res.data.data;
            setReviews(prev => [{
                name: newR.name,
                role: "Pengguna Seapedia",
                avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(newR.name) + "&background=006B7A&color=fff",
                text: newR.comment,
                rating: newR.rating || 5
            }, ...prev]);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Gagal mengirim review",
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    // Split products for UI: first 4 for Flash Sale, rest for recommendations
    const flashSaleProducts = products.slice(0, 4);
    const recommendedProducts = products.slice(4, 14); // take next 10

    return (
        <div className="min-h-screen bg-gray-50/50">
            <PublicNavbar />

            {/* HERO SECTION */}
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[510px]">
                    {/* Main Banner */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden relative shadow-[0_12px_30px_rgba(0,0,0,0.1)] group h-full bg-gray-900">
                        {HERO_BANNERS.map((banner, idx) => (
                            <div 
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out" />
                                <div className={`absolute inset-0 ${banner.color} mix-blend-multiply`}></div>
                                
                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
                                    <div className={`relative z-20 w-full max-w-lg transition-all duration-700 delay-100 transform ${idx === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <h1 className="text-4xl md:text-[54px] font-black leading-[1.1] mb-5 tracking-tight drop-shadow-lg text-white">
                                            {banner.title}
                                        </h1>
                                        <p className="text-white/90 text-sm md:text-lg mb-8 leading-relaxed font-medium drop-shadow-md">
                                            {banner.subtitle}
                                        </p>
                                        <button className={`${banner.ctaColor} text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 text-sm md:text-base`}>
                                            {banner.cta}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Banner Navigation Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                            {HERO_BANNERS.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                        
                        {/* Prev/Next Buttons */}
                        <button onClick={() => setCurrentBanner(prev => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Side Banners */}
                    <div className="hidden lg:flex flex-col gap-4 h-full">
                        <div className="flex-1 rounded-2xl overflow-hidden relative bg-gray-100 p-5 flex flex-col justify-end shadow-sm group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90" alt="Gaya Terkini" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                            <div className="relative z-10">
                                <h3 className="text-white font-bold text-base drop-shadow-md">Gaya Terkini</h3>
                                <p className="text-white/90 text-xs font-medium flex items-center gap-0.5 group-hover:text-white transition-colors">Eksplorasi <ChevronRight className="w-3 h-3" /></p>
                            </div>
                        </div>

                        <div className="flex-1 rounded-2xl overflow-hidden relative p-5 flex flex-col justify-between shadow-sm group cursor-pointer text-white">
                            {/* Background image - delivery/shipping themed */}
                            <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=90" alt="" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                            {/* Dark gradient bottom for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"></div>

                            <div className="flex justify-between items-start w-full relative z-10">
                                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit">Voucher Khusus</span>
                                <Tag className="w-4 h-4 opacity-80" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-0.5">Gratis Ongkir</h3>
                                <p className="text-white/90 text-xs font-medium mb-3">Klaim sekarang, kuota terbatas!</p>
                                <button className="bg-white text-[#006B7A] w-full py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                                    Klaim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-800">Kategori Pilihan</h2>
                    <button className="text-[#006B7A] text-sm font-semibold hover:underline">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {CATEGORIES.map((cat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-[#006B7A]/30 group-hover:shadow-md transition-all">
                                <cat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#006B7A]" strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 text-center">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FLASH SALE */}
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-[#ff8c00] fill-[#ff8c00]" />
                            <h2 className="text-2xl font-black italic tracking-wide text-gray-900">Flash Sale</h2>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-sm font-medium text-gray-600">Berakhir dalam:</span>
                            <div className="flex items-center gap-1 font-bold">
                                <span className="bg-[#ff8c00] text-white px-2 py-1 rounded text-sm font-mono">02</span>
                                <span className="text-[#ff8c00]">:</span>
                                <span className="bg-[#ff8c00] text-white px-2 py-1 rounded text-sm font-mono">45</span>
                                <span className="text-[#ff8c00]">:</span>
                                <span className="bg-[#ff8c00] text-white px-2 py-1 rounded text-sm font-mono">12</span>
                            </div>
                        </div>
                    </div>
                    <button className="text-[#006B7A] text-sm font-bold hover:underline">
                        Lihat Semua
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {isLoading ? (
                        <div className="col-span-full text-center py-10 text-gray-500">Memuat Flash Sale...</div>
                    ) : flashSaleProducts.length > 0 ? (
                        flashSaleProducts.map((p, i) => (
                        <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#006B7A]/30 hover:-translate-y-0.5 transition-all duration-300 p-3 block group">
                            <div className="relative aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden">
                                <span className="absolute top-2 left-2 bg-[#ff8c00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 flex items-center gap-0.5">
                                    <Flame className="w-3 h-3" strokeWidth={3} /> -50%
                                </span>
                                <img src={getImageUrl(p.images?.[0], FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="text-sm text-gray-700 font-medium line-clamp-2 mb-2 group-hover:text-[#006B7A] transition-colors leading-relaxed">{p.name}</h3>
                            
                            <div className="mb-3">
                                <p className="text-lg font-black text-[#ff8c00] mb-0.5">{rupiah(p.price)}</p>
                                <p className="text-xs text-gray-400 line-through font-medium">{rupiah(p.price * 2)}</p>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="relative w-full h-1.5 bg-orange-100 rounded-full overflow-hidden mb-1.5">
                                    <div className="absolute top-0 left-0 h-full bg-[#ff8c00] rounded-full" style={{ width: `85%` }}></div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500">Tersisa {p.stock}</p>
                            </div>
                        </Link>
                    ))) : (
                        <div className="col-span-full text-center py-10 text-gray-500">Belum ada produk Flash Sale</div>
                    )}
                </div>
            </section>

            {/* REKOMENDASI */}
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Rekomendasi Untukmu</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white">Terbaru</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#006B7A] text-white text-sm font-medium shadow-sm transition-colors">Terlaris</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    {isLoading ? (
                        <div className="col-span-full text-center py-10 text-gray-500">Memuat Rekomendasi...</div>
                    ) : recommendedProducts.length > 0 ? (
                        recommendedProducts.map((p, i) => (
                        <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-transparent shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-[#006B7A]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,107,122,0.15)] hover:-translate-y-1 transition-all duration-300 p-3 cursor-pointer group flex flex-col h-full">
                            <div className="relative aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden">
                                {p.store?.name?.toLowerCase().includes("official") && (
                                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#006B7A] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Official
                                    </span>
                                )}
                                <img src={getImageUrl(p.images?.[0], FALLBACK_IMAGES[(i + 4) % FALLBACK_IMAGES.length])} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="text-sm text-gray-700 font-medium line-clamp-2 mb-2 group-hover:text-[#006B7A] leading-relaxed">{p.name}</h3>
                            <div className="mt-auto">
                                <p className="text-[15px] font-bold text-[#006B7A] mb-2">{rupiah(p.price)}</p>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium text-gray-700">4.8</span>
                                    <span className="mx-0.5">|</span>
                                    <span>Stok {p.stock}</span>
                                </div>
                            </div>
                        </Link>
                    ))) : (
                        <div className="col-span-full text-center py-10 text-gray-500">Belum ada rekomendasi produk</div>
                    )}
                </div>

                <div className="text-center">
                    <button className="border border-[#006B7A] text-[#006B7A] font-bold px-8 py-2.5 rounded-lg hover:bg-[#006B7A]/5 transition-colors bg-white">
                        Muat Lebih Banyak
                    </button>
                </div>
            </section>

            {/* APA KATA MEREKA / TESTIMONIALS */}
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(calc(-50% - 12px)); }
                    }
                `}
            </style>
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#006B7A]/5 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#ff8c00]/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-black text-[#006B7A] mb-3 tracking-tight">Apa Kata Mereka Tentang SEAPEDIA?</h2>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">Dipercaya oleh jutaan pengguna di seluruh Indonesia untuk segala kebutuhan belanja dan bisnis online.</p>
                    </div>

                    <div className="flex overflow-hidden relative w-full pt-4 group min-h-[200px] items-center justify-center">
                        {reviews.length === 0 ? (
                            <div className="text-center text-gray-500 font-medium">
                                Belum ada ulasan untuk aplikasi ini. Jadilah yang pertama memberikan ulasan!
                            </div>
                        ) : (
                            /* Auto-scrolling wrapper */
                            <div className={`flex ${reviews.length > 2 ? 'animate-[marquee_40s_linear_infinite]' : ''} group-hover:[animation-play-state:paused] whitespace-nowrap gap-6 min-w-max px-4`}>
                                {[...reviews, ...(reviews.length > 2 ? reviews : [])].map((t, i) => (
                                    <div key={i} className={`w-[300px] md:w-[350px] shrink-0 whitespace-normal backdrop-blur-md p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,107,122,0.05)] transition-all duration-300 ${t.highlight ? 'bg-[#006B7A]/5 border-2 border-[#006B7A]/20 transform md:-translate-y-2' : 'bg-white/80 border border-gray-100 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:border-[#006B7A]/20'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${t.highlight ? 'border-[#006B7A]' : 'border-[#006B7A]/20'}`}>
                                                <img className="w-full h-full object-cover" src={t.avatar} alt={t.name} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                                                <p className="text-sm text-gray-500 font-medium">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 text-[#ff8c00] mb-3">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? 'fill-[#ff8c00] text-[#ff8c00]' : 'fill-gray-200 text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 italic leading-relaxed text-sm">
                                            "{t.text}"
                                        </p>
                                        {t.highlight && (
                                            <div className="mt-4 flex justify-end">
                                                <Quote className="w-8 h-8 text-[#006B7A] opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 mb-2 relative z-10">
                        <button onClick={() => setIsReviewModalOpen(true)} className="w-full md:w-auto px-8 py-3.5 border-2 border-[#006B7A] text-[#006B7A] hover:bg-[#006B7A]/5 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Star className="w-5 h-5" />
                            Beri Ulasan
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Bagikan Pengalamanmu</h3>
                                <p className="text-sm text-gray-500 mt-1">Ulasanmu sangat berarti untuk kami</p>
                            </div>
                            <button onClick={() => setIsReviewModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleReviewSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                                    <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A] outline-none transition-all placeholder:text-gray-400" placeholder="Tuliskan nama Anda" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className="text-3xl focus:outline-none transition-transform hover:scale-110">
                                                <Star className={`w-8 h-8 ${reviewForm.rating >= star ? 'fill-[#ffb020] text-[#ffb020]' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Komentar</label>
                                    <textarea required value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows="3" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A] outline-none transition-all resize-none placeholder:text-gray-400" placeholder="Ceritakan pengalaman Anda..."></textarea>
                                </div>
                                <button disabled={submittingReview} type="submit" className="w-full py-3.5 bg-[#006B7A] text-white font-bold rounded-xl hover:bg-[#005a66] transition-colors disabled:opacity-50 mt-2 shadow-sm flex justify-center items-center gap-2">
                                    {submittingReview ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Mengirim...
                                        </>
                                    ) : "Kirim Ulasan"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}