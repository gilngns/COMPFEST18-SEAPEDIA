import { Smartphone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-12 mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-black text-[#006B7A] tracking-tighter mb-4">SEAPEDIA</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        Marketplace terpercaya dengan pengalaman berbelanja sekuat samudra. Temukan segalanya di sini.
                    </p>
                    <p className="text-xs text-gray-400">© 2026 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-4">Jelajahi</h3>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><button className="hover:text-[#006B7A]">Tentang Kami</button></li>
                        <li><button className="hover:text-[#006B7A]">Karir</button></li>
                        <li><button className="hover:text-[#006B7A]">Blog</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-4">Bantuan</h3>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><button className="hover:text-[#006B7A]">Pusat Bantuan</button></li>
                        <li><button className="hover:text-[#006B7A]">Kebijakan Privasi</button></li>
                        <li><button className="hover:text-[#006B7A]">Syarat & Ketentuan</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-4">Aplikasi</h3>
                    <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500">Unduh Aplikasi</p>
                            <p className="text-sm font-bold text-gray-700">Seapedia App</p>
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}
