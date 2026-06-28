import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
            
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 justify-center">
                            <span className="w-3.5 h-3.5 bg-[#006B7A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-3.5 h-3.5 bg-[#006B7A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-3.5 h-3.5 bg-[#006B7A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-[#006B7A] font-bold text-sm tracking-wide">Memproses...</span>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
}
