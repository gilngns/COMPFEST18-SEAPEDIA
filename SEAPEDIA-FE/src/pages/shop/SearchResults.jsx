import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";
import api from "../../lib/api";
import {
    Search, Bell, ShoppingCart, User, Star, Check,
    ChevronRight, ChevronLeft, Heart
} from "lucide-react";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function getImageUrl(url, fallback) {
    if (!url) return fallback;
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
}

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=90",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=90",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=90",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=90",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=90",
    "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&q=90",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=90",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=90",
];

const SORT_OPTIONS = ["Paling Sesuai", "Terbaru", "Harga: Rendah - Tinggi", "Harga: Tinggi - Rendah"];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/catalog', { params: { search: query } });
                setProducts(res.data.data || []);
            } catch (error) {
                console.error("Gagal memuat hasil pencarian:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);
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

    const toggleSaved = (id) => {
        setSavedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif]">
            <PublicNavbar initialSearch={query} />

            {/* BREADCRUMB & HEADER */}<main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-gray-900">Menampilkan hasil untuk "{query}"</h1>
                    {!isLoading && <p className="text-sm text-gray-500 mt-1">{products.length} produk ditemukan</p>}
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
                            {isLoading ? (
                                <div className="col-span-full py-16 text-center text-gray-500">Mencari produk...</div>
                            ) : products.length > 0 ? (
                                products.map((p, i) => (
                                <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-transparent shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-[#006B7A]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,107,122,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                                        <img
                                            src={getImageUrl(p.images?.[0], FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {p.store?.name?.toLowerCase().includes("official") && (
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
                                            <p className="text-base font-bold text-[#ff8c00] mb-1.5">{rupiah(p.price)}</p>

                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="font-medium text-gray-700">4.8</span>
                                                <span>(Stok {p.stock})</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-[#006B7A]/10 flex items-center justify-center text-[8px] font-bold text-[#006B7A] shrink-0">
                                                    {p.store?.name?.charAt(0) || "S"}
                                                </div>
                                                <span className="text-[10px] text-gray-500 truncate">{p.store?.name || "Toko Bebas"}</span>
                                                {p.store?.name?.toLowerCase().includes("official") && (
                                                    <Check className="w-3 h-3 text-[#006B7A] shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))) : (
                                <div className="col-span-full py-16 text-center flex flex-col items-center">
                                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800">Produk tidak ditemukan</h3>
                                    <p className="text-gray-500 text-sm">Coba gunakan kata kunci lain atau kurangi filter.</p>
                                </div>
                            )}
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
