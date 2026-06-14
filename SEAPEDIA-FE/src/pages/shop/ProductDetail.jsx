import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Search, Bell, ShoppingCart, User, Star, Check,
    Truck, MessageSquare, Minus, Plus
} from "lucide-react";
import Footer from "../../components/Footer";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(1);
    const [activeColor, setActiveColor] = useState("Midnight Black");
    const [activeTab, setActiveTab] = useState("Detail Produk");

    const product = {
        name: "Smartwatch Pro Max Series 8 - Midnight Black",
        price: 2499000,
        rating: 4.9,
        sold: "2.1k",
        isMall: true,
        colors: [
            { name: "Midnight Black", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80" },
            { name: "Silver", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&q=80" }
        ],
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=90",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80"
        ],
        description: `Smartwatch premium dengan fitur kesehatan lengkap dan baterai tahan lama. Cocok untuk menemani aktivitas sehari-hari maupun olahraga intens.`,
        features: [
            "Layar OLED 1.9 inch super terang",
            "Sensor detak jantung & SpO2 akurat",
            "Water resistant 5ATM (Bisa untuk berenang)",
            "Baterai tahan hingga 14 hari pemakaian normal",
            "Garansi Resmi 1 Tahun Seapedia Official"
        ],
        boxContents: "1x Smartwatch, 1x Kabel Charger Magnetic, 1x Buku Panduan",
        seller: {
            name: "Seapedia Official",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
            verified: true,
            chatResponse: "98% Chat Dibalas"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
            {/* NAVBAR */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center gap-4 lg:gap-6">
                    <Link to="/" className="text-2xl font-black text-[#006B7A] tracking-tight shrink-0">SEAPEDIA</Link>
                    <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 shrink-0">
                        <button className="hover:text-[#006B7A] transition-colors">Kategori</button>
                        <button className="hover:text-[#006B7A] transition-colors">Seller Center</button>
                    </nav>
                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2.5 gap-3">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari produk di Seapedia..."
                                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 shrink-0">
                        <Bell className="w-5 h-5 cursor-pointer hover:text-[#006B7A] transition-colors" />
                        <Link to="/cart" className="hover:text-[#006B7A] transition-colors">
                            <ShoppingCart className="w-5 h-5 cursor-pointer" />
                        </Link>
                        <User className="w-5 h-5 cursor-pointer hover:text-[#006B7A] transition-colors" />
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: Images & Description */}
                    <div className="w-full lg:w-[65%] space-y-6">
                        {/* Image Grid */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-3 gap-3">
                                {/* Big Image */}
                                <div className="col-span-2 aspect-square rounded-xl overflow-hidden bg-gray-100">
                                    <img src={product.images[0]} alt="Main" className="w-full h-full object-cover" />
                                </div>
                                {/* Small Images */}
                                <div className="col-span-1 flex flex-col gap-3">
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                        <img src={product.images[1]} alt="Thumbnail 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                        <img src={product.images[2]} alt="Thumbnail 2" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs & Details */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex gap-8 border-b border-gray-200 mb-6">
                                {["Detail Produk", "Ulasan (450)"].map(tab => (
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
                                    <p>{product.description}</p>
                                    <ul className="list-disc pl-5 space-y-1.5">
                                        {product.features.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                    <div className="pt-2">
                                        <p className="font-bold text-gray-900 mb-1">Isi dalam kotak:</p>
                                        <p>{product.boxContents}</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === "Ulasan (450)" && (
                                <div className="text-gray-500 text-sm py-4">Ulasan produk akan tampil di sini.</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info & Actions */}
                    <div className="w-full lg:w-[35%] space-y-6">
                        
                        {/* Product Basic Info */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-3">
                                {product.isMall && (
                                    <span className="bg-blue-100 text-[#006B7A] text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                                        MALL
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-700">{product.rating}</span>
                                    <span>• {product.sold} Terjual</span>
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
                                    Pilih Warna: <span className="font-normal text-gray-600">{activeColor}</span>
                                </p>
                                <div className="flex gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setActiveColor(color.name)}
                                            className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${
                                                activeColor === color.name ? "border-[#006B7A]" : "border-gray-200"
                                            }`}
                                        >
                                            <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                                            {activeColor === color.name && (
                                                <div className="absolute -bottom-1 -right-1 bg-[#006B7A] rounded-full w-4 h-4 flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Info */}
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

                            {/* Actions */}
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
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-12 text-center text-sm font-bold text-gray-800 outline-none hide-arrows" 
                                    />
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 h-11 border border-[#006B7A] text-[#006B7A] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#006B7A]/5 transition-colors">
                                    <ShoppingCart className="w-4 h-4" /> Keranjang
                                </button>
                                <button className="flex-1 h-11 bg-[#ff8c00] hover:bg-[#e67e00] text-white font-bold rounded-lg transition-colors">
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={product.seller.avatar} alt={product.seller.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                <div>
                                    <div className="flex items-center gap-1">
                                        {product.seller.verified && <Check className="w-3.5 h-3.5 text-white bg-blue-500 rounded-full p-0.5" />}
                                        <p className="text-sm font-bold text-gray-900">{product.seller.name}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{product.seller.chatResponse}</p>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#006B7A] hover:border-[#006B7A] transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
