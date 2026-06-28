import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Home, Users, Store, Package, Ticket } from "lucide-react";

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/admin", icon: Home },
        { name: "Voucher/Promo", path: "/admin/promos", icon: Ticket },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-[#006B7A] flex flex-col fixed h-full z-10 text-white">
                <div className="h-16 flex items-center px-6 border-b border-[#008699]">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-white">SEAPEDIA</Link>
                </div>
                <div className="p-4 border-b border-[#008699]">
                    <p className="text-sm text-[#80d8e6]">Admin Control Panel</p>
                    <p className="font-bold truncate">{user?.username || "Admin"}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menu.map(m => {
                        const Icon = m.icon;
                        const active = location.pathname === m.path;
                        return (
                            <Link key={m.path} to={m.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-white text-[#006B7A]' : 'text-white hover:bg-[#005a66]'}`}>
                                <Icon className="w-5 h-5" />
                                {m.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-[#008699]">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-[#80d8e6] font-medium hover:bg-[#005a66] hover:text-white rounded-xl transition-colors mb-2">
                        <Home className="w-5 h-5" />
                        Website Seapedia
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-200 font-medium hover:bg-red-500 hover:text-white rounded-xl transition-colors">
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
