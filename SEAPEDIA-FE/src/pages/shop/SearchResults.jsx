import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import {
    Search, Bell, ShoppingCart, User, Star, Check,
    ChevronRight, ChevronLeft, Heart
} from "lucide-react";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const MOCK_PRODUCTS = [
    {
        id: 1, name: "Nike Revolution 6 Next Nature Men's Road Running Shoes",
        price: 749000, originalPrice: null, discount: null,
        rating: 4.8, sold: "1.2k", official: true,
        seller: "Official Sports Cen...", sellerVerified: true,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=90",
    },
    {
        id: 2, name: "Adidas Duramo SL Men's Running Shoes - Core Black",
        price: 850000, originalPrice: null, discount: null,
        rating: 4.9, sold: "3.5k", official: false,
        seller: "Bandung Kicks", sellerVerified: false,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=90",
    },
    {
        id: 3, name: "Puma Velocity Nitro 2 Men's Running Shoes - Blue/White",
        price: 1199000, originalPrice: 1499000, discount: 20,
        rating: 4.7, sold: "850", official: false,
        seller: "Runner's Market", sellerVerified: true,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=90",
    },
    {
        id: 4, name: "Asics Gel-Kayano 29 Men's Running Shoes - White/Lime",
        price: 2399000, originalPrice: null, discount: null,
        rating: 5.0, sold: "420", official: false,
        seller: "Jakarta Sports", sellerVerified: true,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=90",
    },
    {
        id: 5, name: "New Balance Fresh Foam 1080v12 Running Shoes",
        price: 1899000, originalPrice: 2299000, discount: 17,
        rating: 4.8, sold: "670", official: true,
        seller: "NB Official Store", sellerVerified: true,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=90",
    },
    {
        id: 6, name: "Brooks Ghost 15 Men's Road Running Shoes",
        price: 1650000, originalPrice: null, discount: null,
        rating: 4.6, sold: "310", official: false,
        seller: "Sport Galaxy", sellerVerified: false,
        image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&q=90",
    },
    {
        id: 7, name: "Hoka Clifton 9 Wide Running Shoes - Foam Ultra",
        price: 2100000, originalPrice: 2500000, discount: 16,
        rating: 4.9, sold: "520", official: true,
        seller: "HOKA Official", sellerVerified: true,
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=90",
    },
    {
        id: 8, name: "Saucony Kinvara 14 Lightweight Running Shoes",
        price: 1350000, originalPrice: null, discount: null,
        rating: 4.5, sold: "190", official: false,
        seller: "Run Indonesia", sellerVerified: false,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=90",
    },
];

const SORT_OPTIONS = ["Paling Sesuai", "Terbaru", "Harga: Rendah - Tinggi", "Harga: Tinggi - Rendah"];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";

    const [searchInput, setSearchInput] = useState(query);
    const [activeSort, setActiveSort] = useState("Paling Sesuai");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [lokasi, setLokasi] = useState({ jabodetabek: false, bandung: true, surabaya: false });
    const [rating4up, setRating4up] = useState(true);
    const [kondisiBaru, setKondisiBaru] = useState(true);
    const [kondisiBekas, setKondisiBekas] = useState(false);
    const [savedItems, setSavedItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = 10;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    const toggleSaved = (id) => {
        setSavedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif]">
            {/* NAVBAR */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center gap-4 lg:gap-6">
                    <Link to="/" className="text-2xl font-black text-[#006B7A] tracking-tight shrink-0">SEAPEDIA</Link>
                    <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 shrink-0">
                        <button className="hover:text-[#006B7A] transition-colors">Kategori</button>
                        <button className="hover:text-[#006B7A] transition-colors">Seller Center</button>
                    </nav>
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2.5 gap-3">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Cari produk di Seapedia..."
                                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                            />
                        </div>
                    </form>
                    <div className="flex items-center gap-4 text-gray-600 shrink-0">
                        <Bell className="w-5 h-5 cursor-pointer hover:text-[#006B7A] transition-colors" />
                        <Link to="/cart" className="hover:text-[#006B7A] transition-colors">
                            <ShoppingCart className="w-5 h-5 cursor-pointer" />
                        </Link>
                        <User className="w-5 h-5 cursor-pointer hover:text-[#006B7A] transition-colors" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-gray-900">Menampilkan hasil untuk "{query}"</h1>
                    <p className="text-sm text-gray-500 mt-1">45.201 produk ditemukan</p>
                </div>

                <div className="flex gap-6">
                    {/* SIDEBAR FILTER */}
                    <aside className="w-44 shrink-0 hidden lg:block">
                        <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-gray-800 text-sm">Filter</span>
                                <button className="text-[#006B7A] text-xs font-semibold hover:underline">Reset</button>
                            </div>

                            {/* Harga */}
                            <div className="mb-5">
                                <p className="text-xs font-bold text-gray-700 mb-2">Harga</p>
                                <input
                                    type="number"
                                    placeholder="Minimum"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-700 mb-2 outline-none focus:border-[#006B7A] placeholder-gray-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Maksimum"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-[#006B7A] placeholder-gray-400"
                                />
                            </div>

                            {/* Lokasi */}
                            <div className="mb-5">
                                <p className="text-xs font-bold text-gray-700 mb-2">Lokasi</p>
                                {[
                                    { key: "jabodetabek", label: "Jabodetabek" },
                                    { key: "bandung", label: "Bandung Raya" },
                                    { key: "surabaya", label: "Surabaya & Sekitarnya" },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-2 mb-1.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={lokasi[key]}
                                            onChange={() => setLokasi(prev => ({ ...prev, [key]: !prev[key] }))}
                                            className="w-3.5 h-3.5 accent-[#006B7A] rounded"
                                        />
                                        <span className="text-xs text-gray-600 group-hover:text-gray-800 whitespace-nowrap">{label}</span>
                                    </label>
                                ))}
                                <button className="text-[#006B7A] text-xs font-semibold mt-1 hover:underline">Lihat Semua ↓</button>
                            </div>

                            {/* Rating */}
                            <div className="mb-5">
                                <p className="text-xs font-bold text-gray-700 mb-2">Rating</p>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rating4up}
                                        onChange={() => setRating4up(!rating4up)}
                                        className="w-3.5 h-3.5 accent-[#006B7A]"
                                    />
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-gray-600">4 Ke atas</span>
                                    </div>
                                </label>
                            </div>

                            {/* Kondisi */}
                            <div>
                                <p className="text-xs font-bold text-gray-700 mb-2">Kondisi</p>
                                <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
                                    <input type="checkbox" checked={kondisiBaru} onChange={() => setKondisiBaru(!kondisiBaru)} className="w-3.5 h-3.5 accent-[#006B7A]" />
                                    <span className="text-xs text-gray-600">Baru</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={kondisiBekas} onChange={() => setKondisiBekas(!kondisiBekas)} className="w-3.5 h-3.5 accent-[#006B7A]" />
                                    <span className="text-xs text-gray-600">Pernah Dipakai</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Sort Bar */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="text-sm text-gray-500 font-medium shrink-0">Urutkan:</span>
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setActiveSort(opt)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        activeSort === opt
                                            ? "bg-[#006B7A] text-white border-[#006B7A]"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {MOCK_PRODUCTS.map(p => (
                                <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-transparent shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-[#006B7A]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,107,122,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {p.official && (
                                            <span className="absolute top-2 left-2 bg-white/90 text-[#006B7A] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                                <Check className="w-2.5 h-2.5" /> Official
                                            </span>
                                        )}
                                        <button
                                            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSaved(p.id); }}
                                            className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            <Heart className={`w-3.5 h-3.5 transition-colors ${savedItems[p.id] ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-2 leading-relaxed group-hover:text-[#006B7A] transition-colors">
                                            {p.name}
                                        </p>

                                        <div className="mt-auto">
                                            {p.discount && (
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">{p.discount}%</span>
                                                    <span className="text-gray-400 text-[10px] line-through">{rupiah(p.originalPrice)}</span>
                                                </div>
                                            )}
                                            <p className="text-base font-bold text-[#ff8c00] mb-1.5">{rupiah(p.price)}</p>

                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="font-medium text-gray-700">{p.rating}</span>
                                                <span>({p.sold} Terjual)</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600 shrink-0">
                                                    {p.seller.charAt(0)}
                                                </div>
                                                <span className="text-[10px] text-gray-500 truncate">{p.seller}</span>
                                                {p.sellerVerified && (
                                                    <Check className="w-3 h-3 text-[#006B7A] shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>

                            {[1, 2, 3].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                        currentPage === p
                                            ? "bg-[#006B7A] text-white"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                    currentPage === totalPages
                                        ? "bg-[#006B7A] text-white"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {totalPages}
                            </button>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
