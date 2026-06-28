import { X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose, message }) {
    const navigate = useNavigate();
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>
            
            {}
            <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                {}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 pt-10 flex flex-col items-center text-center">
                    {}
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-5 relative">
                        <div className="absolute inset-0 bg-[#006B7A] rounded-full opacity-10 animate-ping"></div>
                        <Lock className="w-8 h-8 text-[#006B7A]" strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 font-['Plus_Jakarta_Sans',sans-serif]">Login Diperlukan</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2 font-['Plus_Jakarta_Sans',sans-serif]">
                        {message || "Silakan masuk ke akun kamu terlebih dahulu untuk melanjutkan aktivitas ini."}
                    </p>

                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-[#006B7A] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#005a66] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,107,122,0.25)] font-['Plus_Jakarta_Sans',sans-serif]"
                    >
                        Masuk ke Akun
                    </button>
                    
                    <p className="mt-6 text-sm text-gray-500 font-['Plus_Jakarta_Sans',sans-serif]">
                        Belum punya akun? <button onClick={() => navigate('/register')} className="text-[#006B7A] font-bold hover:underline transition-all ml-1">Daftar Sekarang</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
