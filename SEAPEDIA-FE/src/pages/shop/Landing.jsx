import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import {
    Search, Bell, ShoppingCart, User, Zap, ChevronRight,
    Check, Star, Tag, Truck, Smartphone, Monitor,
    Armchair, Baby, Sparkles, Car, Utensils, Gamepad2, Shirt,
    Timer, Flame
} from "lucide-react";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
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

const FLASH_SALE_PRODUCTS = [
    { id: 1, name: "Headphone Nirkabel Premium Pro X", price: 1250000, oldPrice: 2400000, discount: "-50%", sold: 85, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: 2, name: "Smartwatch Series 8 Sport Band", price: 3100000, oldPrice: 4000000, discount: "-30%", sold: 45, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" },
    { id: 3, name: "Mug Keramik Minimalis Nordik", price: 45000, oldPrice: 90000, discount: "-60%", sold: 92, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80" },
    { id: 4, name: "Set Perawatan Wajah Natural", price: 225000, oldPrice: 300000, discount: "-25%", sold: 38, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
];

const RECOMMENDATIONS = [
    { id: 5, name: "Sepatu Lari Pria Sprint X Warna Merah", price: 850000, rating: 4.8, sold: "1rb+", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
    { id: 6, name: "Drone Quadcopter Pro 4K Camera", price: 4200000, rating: 4.9, sold: "250", image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80", official: true },
    { id: 7, name: "Jam Tangan Pria Kulit Klasik", price: 650000, rating: 4.7, sold: "500+", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80" },
    { id: 8, name: "Laptop Ultrabook 14\" RAM 16GB SSD 512GB", price: 12500000, rating: 5.0, sold: "100+", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" },
    { id: 9, name: "TWS Earbuds ANC Tahan Air IPX7", price: 450000, rating: 4.8, sold: "2rb+", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" },
];

export default function Landing() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* NAVBAR */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-2xl font-black text-[#006B7A] tracking-tighter">
                            SEAPEDIA
                        </Link>
                        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
                            <Link to="/catalog" className="hover:text-[#006B7A] border-b-2 border-transparent hover:border-[#006B7A] pb-1 transition-all">Kategori</Link>
                            <Link to="/seller" className="hover:text-[#006B7A] border-b-2 border-transparent hover:border-[#006B7A] pb-1 transition-all">Seller Center</Link>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden sm:block">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Cari produk di Seapedia..."
                            className="w-full bg-gray-100 border border-transparent focus:border-[#006B7A] focus:bg-white px-4 py-2.5 pl-10 rounded-lg text-sm transition-all outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="flex items-center gap-5 text-gray-500">
                        <button className="hover:text-[#006B7A] transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <Link to="/cart" className="hover:text-[#006B7A] transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                        </Link>
                        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                        <Link to="/login" className="hover:text-[#006B7A] transition-colors hidden sm:block">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* BANNERS */}
            <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[510px]">
                    {/* Main Banner */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden relative p-8 md:p-10 flex flex-col justify-center text-white shadow-sm group cursor-pointer h-full">
                        <img src="/banner_bg.png" alt="Promo Diskon" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />

                        <div className="relative z-10 w-full max-w-sm">
                            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] mb-4 tracking-tight drop-shadow-md">
                                Diskon Mengalir<br />Hingga 70%
                            </h1>

                            <p className="text-white/80 text-sm md:text-base mb-7 leading-relaxed">
                                Penawaran terbaik untuk produk pilihanmu, hari ini.
                            </p>

                            <button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md text-sm">
                                Belanja Sekarang
                            </button>
                        </div>
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
                    {FLASH_SALE_PRODUCTS.map((p) => (
                        <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#006B7A]/30 hover:-translate-y-0.5 transition-all duration-300 p-3 block group">
                            <div className="relative aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden">
                                <span className="absolute top-2 left-2 bg-[#ff8c00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 flex items-center gap-0.5">
                                    <Flame className="w-3 h-3" strokeWidth={3} /> {p.discount}
                                </span>
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="text-sm text-gray-700 font-medium line-clamp-2 mb-2 group-hover:text-[#006B7A] transition-colors leading-relaxed">{p.name}</h3>
                            
                            <div className="mb-3">
                                <p className="text-lg font-black text-[#ff8c00] mb-0.5">{rupiah(p.price)}</p>
                                <p className="text-xs text-gray-400 line-through font-medium">{rupiah(p.oldPrice)}</p>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="relative w-full h-1.5 bg-orange-100 rounded-full overflow-hidden mb-1.5">
                                    <div className="absolute top-0 left-0 h-full bg-[#ff8c00] rounded-full" style={{ width: `${p.sold}%` }}></div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500">Tersisa {100 - p.sold}</p>
                            </div>
                        </Link>
                    ))}
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
                    {RECOMMENDATIONS.map((p) => (
                        <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-transparent shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-[#006B7A]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,107,122,0.15)] hover:-translate-y-1 transition-all duration-300 p-3 cursor-pointer group flex flex-col h-full">
                            <div className="relative aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden">
                                {p.official && (
                                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#006B7A] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Official
                                    </span>
                                )}
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="text-sm text-gray-700 font-medium line-clamp-2 mb-2 group-hover:text-[#006B7A] leading-relaxed">{p.name}</h3>
                            <div className="mt-auto">
                                <p className="text-[15px] font-bold text-[#006B7A] mb-2">{rupiah(p.price)}</p>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium text-gray-700">{p.rating}</span>
                                    <span className="mx-0.5">|</span>
                                    <span>Terjual {p.sold}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <button className="border border-[#006B7A] text-[#006B7A] font-bold px-8 py-2.5 rounded-lg hover:bg-[#006B7A]/5 transition-colors bg-white">
                        Muat Lebih Banyak
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}