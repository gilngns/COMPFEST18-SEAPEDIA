import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import api from "../../lib/api";
import PublicNavbar from "../../components/PublicNavbar";
import { useAuth } from "../../context/AuthContext";
import { useCatalog } from "../../hooks/usecases/useCatalog";
import { useCategories } from "../../hooks/usecases/useCategories";
import { useReviews } from "../../hooks/usecases/useReviews";
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

const CATEGORY_ICONS = {
    Shirt, Monitor, Gamepad2, Armchair, Baby, Sparkles, Car, Utensils
};


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
    const { products, isLoading: isLoadingProducts } = useCatalog({});
    const { categories, isLoading: isLoadingCategories } = useCategories();
    const { reviews, isLoading: isLoadingReviews, addReview } = useReviews();

    const [recommendationSort, setRecommendationSort] = useState("Terbaru");
    const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 10);
            setIsLoadingMore(false);
        }, 800);
    };

    const isLoading = isLoadingProducts || isLoadingCategories || isLoadingReviews;

    useEffect(() => {
        const bannerTimer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
        }, 5000);

        const calculateTimeLeft = () => {
            const now = new Date();
            const nextFlashSaleHour = Math.ceil((now.getHours() + 1) / 3) * 3;
            const endDate = new Date(now);
            endDate.setHours(nextFlashSaleHour, 0, 0, 0);

            const diff = endDate.getTime() - now.getTime();
            if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

            return {
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            };
        };

        setTimeLeft(calculateTimeLeft());

        const flashSaleTimer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(bannerTimer);
            clearInterval(flashSaleTimer);
        };
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
            await addReview({
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
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error || "Gagal mengirim review",
            });
        } finally {
            setSubmittingReview(false);
        }
    };


    const availableProducts = products.filter(p => p.stock > 0);
    const flashSaleProducts = availableProducts.slice(0, 4);

    const baseRecommendedProducts = availableProducts.slice(4);
    const filteredRecommendedProducts = activeCategory
        ? baseRecommendedProducts.filter(p => p.categoryId === activeCategory)
        : baseRecommendedProducts;

    const recommendedProducts = [...filteredRecommendedProducts]
        .sort((a, b) => recommendationSort === "Terlaris" ? a.stock - b.stock : 0)
        .slice(0, visibleCount);

    const totalRecommended = filteredRecommendedProducts.length;
    const hasMore = visibleCount < totalRecommended;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="bg-[#0B1120] pb-24 relative overflow-hidden">
                {/* Subtle dark glow effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#006B7A]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ff8c00]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <PublicNavbar theme="dark" />

                {/* HERO SECTION */}
                <section className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-8 pb-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[540px]">
                        { }
                        <div className="lg:col-span-2 rounded-[2rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] group h-full bg-gray-900">
                            {HERO_BANNERS.map((banner, idx) => (
                                <div
                                    key={banner.id}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                >
                                    <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-[15s] ease-out" />
                                    <div className={`absolute inset-0 ${banner.color} mix-blend-multiply opacity-90`}></div>

                                    <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-center">
                                        <div className={`relative z-20 w-full max-w-xl transition-all duration-1000 delay-200 transform ${idx === currentBanner ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white drop-shadow-md">
                                                    {banner.title}
                                                </h1>
                                                <p className="text-white/90 text-sm md:text-lg mb-8 leading-relaxed font-medium drop-shadow-sm">
                                                    {banner.subtitle}
                                                </p>
                                                <button className={`${banner.ctaColor} text-white font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(255,140,0,0.3)] text-sm md:text-base flex items-center gap-2`}>
                                                    {banner.cta} <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            { }
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                                {HERO_BANNERS.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentBanner(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBanner ? 'w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>

                            { }
                            <button onClick={() => setCurrentBanner(prev => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0 border border-white/10 shadow-xl hover:scale-110">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={() => setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 border border-white/10 shadow-xl hover:scale-110">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        { }
                        <div className="hidden lg:flex flex-col gap-6 h-full">
                            <div className="flex-1 rounded-[2rem] overflow-hidden relative bg-gray-900 p-6 flex flex-col justify-end shadow-xl group cursor-pointer border border-gray-100/10">
                                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90" alt="Gaya Terkini" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-[10s] opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <h3 className="text-white font-black text-2xl drop-shadow-md mb-1">Gaya Terkini</h3>
                                    <p className="text-white/80 text-sm font-medium flex items-center gap-1 group-hover:text-white transition-colors">Eksplorasi Katalog <ChevronRight className="w-4 h-4" /></p>
                                </div>
                            </div>

                            <div className="flex-1 rounded-[2rem] overflow-hidden relative p-6 flex flex-col justify-between shadow-xl group cursor-pointer text-white border border-gray-100/10">
                                { }
                                <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=90" alt="" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[10s] opacity-90" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#006B7A]/90 via-[#006B7A]/40 to-black/20"></div>

                                <div className="flex justify-between items-start w-full relative z-10">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-lg border border-white/20">Voucher Khusus</span>
                                    <Tag className="w-5 h-5 text-white/90 drop-shadow-md" />
                                </div>
                                <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                                    <h3 className="font-black text-2xl mb-1 drop-shadow-md">Gratis Ongkir</h3>
                                    <p className="text-white/90 text-sm font-medium mb-4 drop-shadow-md">Klaim sekarang, kuota terbatas!</p>
                                    <button className="bg-white text-[#006B7A] w-full py-3 rounded-xl font-black text-sm hover:bg-gray-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                        Klaim Voucher
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="bg-gray-50 rounded-t-[3rem] -mt-10 relative z-20 pt-10">
                {/* CATEGORIES */}
                <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Kategori Pilihan</h2>
                            <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">Temukan produk sesuai kebutuhanmu</p>
                        </div>
                        <Link to="/catalog" className="text-[#006B7A] text-xs md:text-sm font-bold hover:underline flex items-center gap-1 shrink-0">
                            Lihat Semua <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto pb-2 md:grid md:grid-cols-8 gap-3 hide-scrollbar">
                        {categories.map((cat, i) => {
                            const IconComponent = CATEGORY_ICONS[cat.icon] || ShoppingBag;
                            const colors = [
                                { from: '#14b8a6', to: '#0d9488', light: '#f0fdfa', border: '#99f6e4', icon: '#0f766e' },
                                { from: '#a855f7', to: '#7c3aed', light: '#faf5ff', border: '#d8b4fe', icon: '#7c3aed' },
                                { from: '#f97316', to: '#ea580c', light: '#fff7ed', border: '#fed7aa', icon: '#c2410c' },
                                { from: '#f43f5e', to: '#e11d48', light: '#fff1f2', border: '#fecdd3', icon: '#be123c' },
                                { from: '#3b82f6', to: '#2563eb', light: '#eff6ff', border: '#bfdbfe', icon: '#1d4ed8' },
                                { from: '#10b981', to: '#059669', light: '#ecfdf5', border: '#a7f3d0', icon: '#065f46' },
                                { from: '#ef4444', to: '#dc2626', light: '#fef2f2', border: '#fecaca', icon: '#b91c1c' },
                                { from: '#8b5cf6', to: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe', icon: '#6d28d9' },
                            ];
                            const color = colors[i % colors.length];
                            const isActive = activeCategory === cat.id;
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                                    style={isActive
                                        ? { background: `linear-gradient(135deg, ${color.from}, ${color.to})` }
                                        : {}}
                                    className={`cursor-pointer shrink-0 w-[80px] md:w-auto flex flex-col items-center gap-2.5 p-3 md:p-4 rounded-2xl transition-all duration-200 ${
                                        isActive
                                            ? 'shadow-md -translate-y-0.5'
                                            : 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                >
                                    <div
                                        style={isActive ? { background: 'rgba(255,255,255,0.2)' } : { background: color.light }}
                                        className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                                    >
                                        <IconComponent
                                            style={{ color: isActive ? '#fff' : color.icon }}
                                            className="w-5 h-5 transition-colors duration-200"
                                            strokeWidth={1.8}
                                        />
                                    </div>
                                    <span className={`text-[11px] md:text-xs font-semibold text-center leading-tight ${isActive ? 'text-white' : 'text-gray-600'}`}>{cat.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            <section className="bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 py-12 mt-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ff8c00]/20 to-[#ff2a5f]/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ff2a5f]/20 to-purple-500/20 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-white/40 backdrop-blur-md px-4 py-4 rounded-[2rem] border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-[#ff8c00] to-[#ff2a5f] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 shrink-0">
                                <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black italic tracking-wide bg-gradient-to-r from-[#ff8c00] to-[#ff2a5f] bg-clip-text text-transparent">Flash Sale</h2>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Berakhir dalam</span>
                            <div className="flex items-center gap-1 font-bold">
                                <span className="bg-white text-[#ff2a5f] shadow-sm border border-[#ff2a5f]/20 px-2.5 py-1.5 rounded-lg text-base font-black tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-[#ff2a5f] font-black text-sm">:</span>
                                <span className="bg-white text-[#ff2a5f] shadow-sm border border-[#ff2a5f]/20 px-2.5 py-1.5 rounded-lg text-base font-black tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="text-[#ff2a5f] font-black text-sm">:</span>
                                <span className="bg-[#ff2a5f] text-white shadow-sm px-2.5 py-1.5 rounded-lg text-base font-black tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                        <Link to="/catalog" className="bg-white/80 hover:bg-white text-[#ff2a5f] px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm hover:shadow-md border border-white whitespace-nowrap">
                            Lihat Promo Lainnya
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-10 text-gray-500 font-bold">Memuat Flash Sale...</div>
                        ) : flashSaleProducts.length > 0 ? (
                            flashSaleProducts.map((p, i) => (
                                <Link to={`/product/${p.id}`} key={p.id} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(255,42,95,0.15)] hover:-translate-y-2 transition-all duration-500 p-4 block group">
                                    <div className="relative aspect-square rounded-xl bg-gray-50 mb-4 overflow-hidden">
                                        <span className="absolute top-3 left-3 bg-gradient-to-r from-[#ff8c00] to-[#ff2a5f] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                            <Flame className="w-3 h-3" strokeWidth={3} /> -50%
                                        </span>
                                        <img src={getImageUrl(p.images?.[0], FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h3 className="text-[15px] text-gray-800 font-bold line-clamp-2 mb-3 group-hover:text-[#ff2a5f] transition-colors leading-snug">{p.name}</h3>

                                    <div className="mb-4">
                                        <p className="text-2xl font-black text-[#ff2a5f] mb-1">{rupiah(p.price)}</p>
                                        <p className="text-sm text-gray-400 line-through font-semibold decoration-gray-300">{rupiah(p.price * 2)}</p>
                                    </div>

                                    { }
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff8c00] to-[#ff2a5f] rounded-full" style={{ width: `85%` }}></div>
                                        </div>
                                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider flex justify-between">
                                            <span>Terjual 85%</span>
                                            <span className="text-[#ff2a5f]">Sisa {p.stock}</span>
                                        </p>
                                    </div>
                                </Link>
                            ))) : (
                            <div className="col-span-full text-center py-10 text-gray-500">Belum ada produk Flash Sale</div>
                        )}
                    </div>
                </div>
            </section>

            { }
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rekomendasi Untukmu</h2>
                    <div className="flex gap-2 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200/50">
                        <button
                            onClick={() => setRecommendationSort("Terbaru")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${recommendationSort === 'Terbaru' ? 'bg-white text-[#006B7A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Terbaru
                        </button>
                        <button
                            onClick={() => setRecommendationSort("Terlaris")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${recommendationSort === 'Terlaris' ? 'bg-white text-[#006B7A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Terlaris
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-12">
                    {isLoading ? (
                        <div className="col-span-full text-center py-10 text-gray-500 font-bold">Memuat Rekomendasi...</div>
                    ) : recommendedProducts.length > 0 ? (
                        recommendedProducts.map((p, i) => (
                            <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,107,122,0.12)] hover:-translate-y-2 transition-all duration-500 p-4 cursor-pointer group flex flex-col h-full">
                                <div className="relative aspect-square rounded-xl bg-gray-50 mb-4 overflow-hidden">
                                    {p.store?.name?.toLowerCase().includes("official") && (
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#006B7A] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Official
                                        </span>
                                    )}
                                    <img src={getImageUrl(p.images?.[0], FALLBACK_IMAGES[(i + 4) % FALLBACK_IMAGES.length])} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <h3 className="text-[15px] text-gray-800 font-bold line-clamp-2 mb-3 group-hover:text-[#006B7A] leading-snug">{p.name}</h3>
                                <div className="mt-auto">
                                    <p className="text-2xl font-black text-[#006B7A] mb-3">{rupiah(p.price)}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-[#ff8c00] fill-[#ff8c00]" />
                                            <span className="font-bold text-gray-700">4.8</span>
                                        </div>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="font-semibold text-gray-600">Stok {p.stock}</span>
                                    </div>
                                </div>
                            </Link>
                        ))) : (
                        <div className="col-span-full text-center py-10 text-gray-500">Belum ada rekomendasi produk</div>
                    )}
                </div>

                <div className="text-center mt-8">
                    {hasMore ? (
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className={`border-2 border-[#006B7A] font-black px-10 py-4 rounded-2xl transition-all duration-300 shadow-sm ${
                                isLoadingMore 
                                    ? 'bg-[#006B7A] text-white opacity-80 cursor-not-allowed' 
                                    : 'text-[#006B7A] hover:bg-[#006B7A] hover:text-white hover:shadow-xl hover:-translate-y-1'
                            }`}
                        >
                            {isLoadingMore ? (
                                <div className="flex items-center gap-1.5 justify-center">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            ) : (
                                "Muat Lebih Banyak Produk"
                            )}
                        </button>
                    ) : totalRecommended > 10 ? (
                        <p className="text-gray-400 text-sm font-semibold">Semua produk sudah ditampilkan</p>
                    ) : null}
                </div>
            </section>

            { }
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(calc(-50% - 12px)); }
                    }
                `}
            </style>
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden mt-12">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#006B7A]/20 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#ff8c00]/20 to-transparent rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#006B7A] font-black tracking-widest uppercase text-sm mb-4 inline-block bg-[#006B7A]/20 px-4 py-1.5 rounded-full border border-[#006B7A]/30">Testimonial</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-md">Apa Kata Mereka?</h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium">Dipercaya oleh jutaan pengguna di seluruh Indonesia untuk segala kebutuhan belanja dan bisnis online.</p>
                    </div>

                    <div className="flex overflow-hidden relative w-full pt-4 pb-12 group min-h-[200px] items-center justify-center">
                        { }
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-20 pointer-events-none"></div>

                        {reviews.length === 0 ? (
                            <div className="text-gray-500 font-medium">Belum ada review.</div>
                        ) : (
                            <div className="flex w-max animate-[marquee_120s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-3">
                                { }
                                {[...reviews, ...reviews, ...reviews, ...reviews].map((t, i) => (
                                    <div
                                        key={i}
                                        className={`w-[320px] shrink-0 bg-white/5 backdrop-blur-md rounded-3xl p-6 relative flex flex-col justify-between border transition-all duration-500 hover:-translate-y-2 ${t.highlight ? 'border-[#006B7A]/50 shadow-[0_20px_40px_rgba(0,107,122,0.2)] bg-gradient-to-b from-[#006B7A]/10 to-transparent' : 'border-white/10 hover:border-white/20 hover:shadow-2xl hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, j) => (
                                                    <Star key={j} className={`w-4 h-4 ${j < (t.rating || 5) ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' : 'text-gray-600'}`} />
                                                ))}
                                            </div>
                                            <Quote className="w-6 h-6 text-white/10" />
                                        </div>
                                        <p className="text-gray-200 text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                                                <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.name}&background=1A8FA8&color=fff`} alt={t.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-base">{t.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{t.role || 'Pembeli'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    { }
                    <div className="flex justify-center items-center mt-4 mb-8 relative z-10">
                        <button onClick={() => setIsReviewModalOpen(true)} className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
                            <Star className="w-5 h-5 text-[#ff8c00] fill-[#ff8c00]" />
                            Beri Ulasan Kamu
                        </button>
                    </div>
                </div>
            </section>

            { }
            <Footer />

            { }
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
                                    <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A] outline-none transition-all placeholder:text-gray-400" placeholder="Tuliskan nama Anda" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="text-3xl focus:outline-none transition-transform hover:scale-110">
                                                <Star className={`w-8 h-8 ${reviewForm.rating >= star ? 'fill-[#ffb020] text-[#ffb020]' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Komentar</label>
                                    <textarea required value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows="3" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-[#006B7A] focus:ring-1 focus:ring-[#006B7A] outline-none transition-all resize-none placeholder:text-gray-400" placeholder="Ceritakan pengalaman Anda..."></textarea>
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