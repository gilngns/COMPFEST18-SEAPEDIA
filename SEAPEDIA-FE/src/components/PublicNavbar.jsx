import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, ShoppingCart, X, ChevronRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCircleCheck,
    faTruck,
    faBoxOpen,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/usecases/useOrders";
import LoginModal from "./LoginModal";
import Swal from "sweetalert2";

const BUYER_STATUS_MAP = {
    PENDING:    { label: "Menunggu Konfirmasi Penjual", color: "text-amber-600 bg-amber-50",   icon: faClock },
    CONFIRMED:  { label: "Pesanan Dikonfirmasi",        color: "text-blue-600 bg-blue-50",     icon: faCircleCheck },
    SHIPPED:    { label: "Sedang Dikirim",               color: "text-purple-600 bg-purple-50", icon: faTruck },
    DELIVERED:  { label: "Pesanan Telah Tiba",           color: "text-green-600 bg-green-50",   icon: faBoxOpen },
    CANCELLED:  { label: "Pesanan Dibatalkan",           color: "text-red-600 bg-red-50",       icon: faCircleXmark },
};

const SELLER_STATUS_MAP = {
    PENDING:    { label: "Pesanan Baru Masuk!",          color: "text-orange-600 bg-orange-50",  icon: faClock },
    CONFIRMED:  { label: "Pesanan Sudah Dikonfirmasi",   color: "text-blue-600 bg-blue-50",      icon: faCircleCheck },
    SHIPPED:    { label: "Pesanan Sedang Dikirim",       color: "text-purple-600 bg-purple-50",  icon: faTruck },
    DELIVERED:  { label: "Pesanan Selesai",              color: "text-green-600 bg-green-50",    icon: faBoxOpen },
    CANCELLED:  { label: "Pesanan Dibatalkan Pembeli",   color: "text-red-600 bg-red-50",        icon: faCircleXmark },
};

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
}

export default function PublicNavbar({ initialSearch = "", theme = "light" }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { getMyOrders, getStoreOrders } = useOrders();
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [loadingNotif, setLoadingNotif] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => { setSearchInput(initialSearch); }, [initialSearch]);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        const role = user.activeRole;
        setLoadingNotif(true);
        try {
            let orders = [];
            if (role === "BUYER") {
                orders = await getMyOrders() || [];
            } else if (role === "SELLER") {
                orders = await getStoreOrders() || [];
            } else {
                // DRIVER atau role lain belum ada endpoint
                setNotifications([]);
                setHasUnread(false);
                return;
            }
            if (Array.isArray(orders)) {
                const notifs = orders.slice(0, 10).map(order => ({
                    id: order.id,
                    type: "order",
                    status: order.status,
                    productName: order.items?.[0]?.product?.name || "Produk",
                    totalItems: order.items?.length || 1,
                    createdAt: order.updatedAt || order.createdAt,
                    orderId: order.id,
                }));
                setNotifications(notifs);
                setHasUnread(notifs.length > 0);
            }
        } catch {
            setNotifications([]);
        } finally {
            setLoadingNotif(false);
        }
    }, [user, getMyOrders, getStoreOrders]);

    useEffect(() => {
        if (user) fetchNotifications();
        else { setNotifications([]); setHasUnread(false); }
    }, [user, fetchNotifications]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) navigate(`/catalog?q=${encodeURIComponent(searchInput.trim())}`);
    };

    const handleProtectedLink = (e, path) => {
        if (!user) { e.preventDefault(); setShowLoginModal(true); }
        else { e.preventDefault(); navigate(path); }
    };

    const handleBellClick = () => {
        if (!user) { setShowLoginModal(true); return; }
        setNotifOpen(prev => !prev);
        setHasUnread(false);
    };

    const isDark = theme === "dark";

    return (
        <>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <header className={`${isDark ? 'bg-[#0B1120]/90 border-white/10 text-white' : 'bg-white/90 border-gray-100 text-gray-900'} backdrop-blur-md border-b sticky top-0 z-50 shadow-sm transition-all duration-300`}>
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Link to="/" className={`text-2xl font-black tracking-tighter shrink-0 mr-4 ${isDark ? 'text-white' : 'text-[#006B7A]'}`}>
                        SEAPEDIA
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden sm:block">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="Cari produk di Seapedia..."
                        className={`w-full border border-transparent focus:border-[#006B7A] px-4 py-2.5 pl-10 rounded-lg text-sm transition-all outline-none ${isDark ? 'bg-white/10 focus:bg-white/20 text-white placeholder-gray-400' : 'bg-gray-100/80 focus:bg-white text-gray-900'}`}
                    />
                    <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </form>

                <div className={`flex items-center gap-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    {/* Notification Bell */}
                    <div className="relative hidden sm:block" ref={notifRef}>
                        <button
                            onClick={handleBellClick}
                            className="hover:text-[#006B7A] transition-colors relative"
                            aria-label="Notifikasi"
                        >
                            <Bell className="w-5 h-5" />
                            {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {notifOpen && (
                            <div className="absolute right-0 top-10 w-[360px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <span className="font-black text-gray-900 text-sm">Notifikasi</span>
                                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {loadingNotif ? (
                                        <div className="py-10 text-center text-gray-400 text-sm">Memuat notifikasi...</div>
                                    ) : user?.activeRole === 'DRIVER' ? (
                                        <div className="py-12 text-center">
                                            <FontAwesomeIcon icon={faTruck} className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm font-medium">Notifikasi Driver</p>
                                            <p className="text-gray-300 text-xs mt-1">Fitur notifikasi pengiriman segera hadir</p>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm font-medium">Tidak ada notifikasi</p>
                                            <p className="text-gray-300 text-xs mt-1">Notifikasi pesananmu akan muncul di sini</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => {
                                            const statusMap = user?.activeRole === 'SELLER' ? SELLER_STATUS_MAP : BUYER_STATUS_MAP;
                                            const s = statusMap[notif.status] || statusMap.PENDING;
                                            return (
                                                <Link
                                                    key={notif.id}
                                                    to={`/${user?.activeRole?.toLowerCase() || 'buyer'}`}
                                                    onClick={() => setNotifOpen(false)}
                                                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                                                        <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-800 leading-tight">{s.label}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                            {notif.productName}
                                                            {notif.totalItems > 1 && ` +${notif.totalItems - 1} produk`}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer */}
                                <Link
                                    to={`/${user?.activeRole?.toLowerCase() || 'buyer'}`}
                                    onClick={() => setNotifOpen(false)}
                                    className="flex items-center justify-center gap-1 py-3 text-[#006B7A] text-sm font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                >
                                    Lihat Semua Pesanan <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {(!user || user.activeRole === "BUYER") && (
                        <a href="/cart" onClick={(e) => handleProtectedLink(e, "/cart")} className="hover:text-[#006B7A] transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                        </a>
                    )}
                    <div className={`w-px h-6 hidden sm:block ${isDark ? 'bg-white/20' : 'bg-gray-200'}`}></div>
                    
                    {user ? (
                        <div className="hidden sm:flex items-center gap-4">
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>Hai, {user.username}</span>
                            <Link to={`/${user.activeRole?.toLowerCase() || 'login'}`} className="text-sm font-bold bg-[#006B7A] text-white px-4 py-2 rounded-lg hover:bg-[#005a66] transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/login" className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-[#006B7A] hover:bg-[#006B7A]/5'}`}>
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
        </>
    );
}
