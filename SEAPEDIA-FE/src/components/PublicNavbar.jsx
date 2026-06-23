import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PublicNavbar({ initialSearch = "" }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(initialSearch);

    useEffect(() => {
        setSearchInput(initialSearch);
    }, [initialSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
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
                        className="w-full bg-gray-100/80 border border-transparent focus:border-[#006B7A] focus:bg-white px-4 py-2.5 pl-10 rounded-lg text-sm transition-all outline-none"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </form>

                <div className="flex items-center gap-5 text-gray-500">
                    <button className="hover:text-[#006B7A] transition-colors relative hidden sm:block">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <Link to="/cart" className="hover:text-[#006B7A] transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                    </Link>
                    <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                    
                    {user ? (
                        <div className="hidden sm:flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-700">Hai, {user.username}</span>
                            <Link to={`/${user.activeRole?.toLowerCase() || 'login'}`} className="text-sm font-bold bg-[#006B7A] text-white px-4 py-2 rounded-lg hover:bg-[#005a66] transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/login" className="text-sm font-bold text-[#006B7A] px-4 py-2 hover:bg-[#006B7A]/5 rounded-lg transition-colors">
                                Masuk
                            </Link>
                            <Link to="/register" className="text-sm font-bold bg-[#006B7A] text-white px-4 py-2 rounded-lg hover:bg-[#005a66] transition-colors shadow-sm">
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
