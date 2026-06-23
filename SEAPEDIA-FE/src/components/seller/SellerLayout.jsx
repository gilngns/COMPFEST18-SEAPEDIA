// src/components/seller/SellerLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Store,
  Wallet,
  Plus,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  ShoppingBag,
  BadgeCheck,
  Settings,
} from "lucide-react";

const menu = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "Produk Saya", icon: Package },
  { to: "/seller/orders", label: "Pesanan", icon: Receipt, badge: 0 },
  { to: "/seller/store", label: "Profil Toko", icon: Store },
  { to: "/seller/finance", label: "Keuangan", icon: Wallet },
];

export default function SellerLayout({ children, storeName = "Toko Saya", storeLogo }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
        {/* store identity */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-seapedia flex items-center justify-center mb-3 shadow-sm overflow-hidden">
            {storeLogo ? (
              <img src={`http://localhost:5000${storeLogo}`} alt="Store Logo" className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="w-7 h-7 text-seapedia" />
            )}
          </div>
          <h3 className="font-bold text-seapedia text-[15px]">{storeName}</h3>
          <div className="flex items-center justify-center gap-1 mt-1">
            <BadgeCheck className="w-3.5 h-3.5 text-seapedia" />
            <span className="text-xs text-seapedia font-semibold">
              Verified Merchant
            </span>
          </div>
        </div>

        {/* menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.to === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                    ? "bg-seapedia text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="flex-1">{m.label}</span>
                {m.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {m.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* bottom */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
          <NavLink
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1"
          >
            <ShoppingBag className="w-[18px] h-[18px]" /> Kembali ke Belanja
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-[18px] h-[18px]" /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN (ml-60 karena sidebar fixed) */}
      <div className="flex-1 flex flex-col ml-60">
        {/* topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-seapedia">
            SEAPEDIA Seller Center
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari di toko..."
                className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent rounded-md text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-seapedia focus:bg-white"
              />
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="w-[18px] h-[18px]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border border-gray-200 ml-1">
              <img src={`https://ui-avatars.com/api/?name=${storeName}&background=1A8FA8&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}