import { Smartphone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#003B44] border-t border-[#002B31] pt-16 pb-12 mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-4">SEAPEDIA</h2>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                        Marketplace terpercaya dengan pengalaman berbelanja sekuat samudra. Temukan segalanya di sini.
                    </p>
                    <p className="text-xs text-white/60">© 2026 SEAPEDIA. Seluruh hak cipta dilindungi.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Jelajahi</h3>
                    <ul className="space-y-3 text-sm text-white/80">
                        <li><button className="hover:text-white transition-colors">Tentang Kami</button></li>
                        <li><button className="hover:text-white transition-colors">Karir</button></li>
                        <li><button className="hover:text-white transition-colors">Blog</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Bantuan</h3>
                    <ul className="space-y-3 text-sm text-white/80">
                        <li><button className="hover:text-white transition-colors">Pusat Bantuan</button></li>
                        <li><button className="hover:text-white transition-colors">Kebijakan Privasi</button></li>
                        <li><button className="hover:text-white transition-colors">Syarat & Ketentuan</button></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
