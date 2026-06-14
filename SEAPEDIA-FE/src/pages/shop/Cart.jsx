import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart, User, Trash2, Minus, Plus, ShieldCheck } from "lucide-react";
import Footer from "../../components/Footer";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const INITIAL_CART = [
    {
        id: 1,
        name: "Smartwatch Pro Max Series 8 - Midnight Black",
        price: 2499000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80",
        quantity: 1,
        selected: true,
        seller: "Seapedia Official"
    },
    {
        id: 2,
        name: "Nike Revolution 6 Next Nature Men's Road Running Shoes",
        price: 749000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
        quantity: 1,
        selected: true,
        seller: "Official Sports Center"
    }
];

export default function Cart() {
    const [cartItems, setCartItems] = useState(INITIAL_CART);

    const handleQuantityChange = (id, delta) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleSelectToggle = (id) => {
        setCartItems(items => items.map(item => 
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const handleSelectAll = () => {
        const allSelected = cartItems.every(i => i.selected);
        setCartItems(items => items.map(item => ({ ...item, selected: !allSelected })));
    };

    const handleDelete = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const selectedItems = cartItems.filter(i => i.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                            <ShoppingCart className="w-5 h-5 cursor-pointer text-[#006B7A]" />
                        </Link>
                        <User className="w-5 h-5 cursor-pointer hover:text-[#006B7A] transition-colors" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 w-full flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* CART ITEMS LIST */}
                    <div className="flex-1 space-y-4">
                        {/* Select All Bar */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 accent-[#006B7A] rounded cursor-pointer"
                                checked={cartItems.length > 0 && cartItems.every(i => i.selected)}
                                onChange={handleSelectAll}
                            />
                            <span className="font-bold text-gray-800">Pilih Semua ({cartItems.length})</span>
                        </div>

                        {/* Items */}
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
                                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-lg font-bold text-gray-800 mb-2">Keranjang belanjamu kosong</h2>
                                <p className="text-gray-500 mb-6 text-sm">Yuk, cari barang impianmu sekarang!</p>
                                <Link to="/" className="bg-[#006B7A] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#005a66] transition-colors">
                                    Mulai Belanja
                                </Link>
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 accent-[#006B7A] rounded cursor-pointer mt-1 sm:mt-0"
                                            checked={item.selected}
                                            onChange={() => handleSelectToggle(item.id)}
                                        />
                                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.name}</p>
                                            <p className="text-[11px] text-gray-500 mb-2">{item.seller}</p>
                                            <p className="text-base font-black text-[#ff8c00]">{rupiah(item.price)}</p>
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
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#006B7A] hover:bg-gray-50 rounded"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* SUMMARY CART */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4">Ringkasan Belanja</h2>
                            
                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-gray-600">Total Harga ({selectedItems.length} barang)</span>
                                <span className="text-gray-800">{rupiah(totalPrice)}</span>
                            </div>
                            
                            <div className="h-px bg-gray-100 my-4"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900">Total Belanja</span>
                                <span className="text-lg font-black text-[#ff8c00]">{rupiah(totalPrice)}</span>
                            </div>

                            <button 
                                disabled={selectedItems.length === 0}
                                className="w-full bg-[#ff8c00] hover:bg-[#e67e00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold h-11 rounded-lg transition-colors mb-3"
                            >
                                Beli ({selectedItems.length})
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
