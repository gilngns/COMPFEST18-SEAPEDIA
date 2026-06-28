import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Home, ShoppingBag, Wallet, MapPin } from "lucide-react";

export default function BuyerLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/buyer", icon: Home },
        { name: "Pesanan Saya", path: "/buyer/orders", icon: ShoppingBag },
        { name: "Wallet", path: "/buyer/wallet", icon: Wallet },
        { name: "Buku Alamat", path: "/buyer/address", icon: MapPin },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-black text-[#006B7A] tracking-tighter">SEAPEDIA</Link>
                </div>
                <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#006B7A] to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-sm border-2 border-white">
                            {user?.username?.charAt(0).toUpperCase() || 'B'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#006B7A] uppercase tracking-widest mb-0.5">Buyer</span>
                            <span className="font-bold text-gray-900 truncate max-w-[140px] text-sm leading-tight">{user?.username || 'User'}</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menu.map(m => {
                        const Icon = m.icon;
                        const active = location.pathname === m.path;
                        return (
                            <Link key={m.path} to={m.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-[#006B7A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Icon className="w-5 h-5" />
                                {m.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors mb-2">
                        <Home className="w-5 h-5" />
                        Kembali ke Belanja
                    </Link>
                    <Link to="/select-role" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                        </svg>
                        Ganti Peran
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
