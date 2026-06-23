import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Home, Truck, MapPin } from "lucide-react";

export default function DriverLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/driver", icon: Home },
        { name: "Cari Job", path: "/driver/jobs", icon: Truck },
        { name: "Riwayat Pengiriman", path: "/driver/history", icon: MapPin },
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
                <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Driver Dashboard</p>
                    <p className="font-bold text-gray-900 truncate">{user?.username}</p>
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
