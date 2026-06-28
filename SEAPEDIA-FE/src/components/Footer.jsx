import { Smartphone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#003B44] border-t border-[#002B31] pt-16 mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-5">SEAPEDIA</h2>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                        Marketplace terpercaya dengan pengalaman berbelanja sekuat samudra. Temukan jutaan produk berkualitas dan nikmati berbagai promo menarik setiap harinya.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Jelajahi</h3>
                    <ul className="space-y-3 text-sm text-white/70">
                        <li><button className="hover:text-white transition-colors">Tentang Kami</button></li>
                        <li><button className="hover:text-white transition-colors">Karir</button></li>
                        <li><button className="hover:text-white transition-colors">Blog & Berita</button></li>
                        <li><button className="hover:text-white transition-colors">Mitra Seapedia</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Bantuan</h3>
                    <ul className="space-y-3 text-sm text-white/70">
                        <li><button className="hover:text-white transition-colors">Pusat Bantuan</button></li>
                        <li><button className="hover:text-white transition-colors">Kebijakan Privasi</button></li>
                        <li><button className="hover:text-white transition-colors">Syarat & Ketentuan</button></li>
                        <li><button className="hover:text-white transition-colors">Panduan Belanja</button></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 font-medium">
                    <div className="flex gap-6">
                    </div>
                </div>
            </div>
        </footer>
    );
}
