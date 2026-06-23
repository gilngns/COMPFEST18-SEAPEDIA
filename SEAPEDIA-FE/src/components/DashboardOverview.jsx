import { CalendarDays, Wallet, TrendingUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function rupiah(n) {
    return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export default function DashboardOverview({ 
    title = "Tinjauan", 
    subtitle = "Pantau aktivitas Anda",
    mainCard = { title: "Total Saldo", value: 0, subValue: "Rp 0", actionText: "Tarik Dana", actionPath: "/" },
    secondaryCard = { title: "Pendapatan", value: 0, subtext: "vs kemarin", trend: "0%", icon: TrendingUp, iconColor: "text-orange-500" },
    actionCards = []
}) {
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const SecondaryIcon = secondaryCard.icon;

    return (
        <div>
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                <div>
                    <h2 className="text-[26px] font-semibold text-gray-900 tracking-tight mb-1">{title}</h2>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-4 sm:mt-0 font-medium">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Hari Ini, {today}
                </div>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="bg-[#006B7A] text-white rounded-xl p-6 flex flex-col justify-between shadow-sm border border-[#005a67]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                        <Wallet className="w-5 h-5" />
                        {mainCard.title}
                    </div>
                    <div className="mb-6">
                        <p className="text-4xl font-bold tracking-tight">{rupiah(mainCard.value)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="text-[13px] text-white/90">
                            {mainCard.subValueLabel || "Tersedia:"} <span className="font-semibold text-white">{mainCard.subValue}</span>
                        </div>
                        {mainCard.actionText && (
                            <button 
                                onClick={() => navigate(mainCard.actionPath)} 
                                className="bg-white text-[#006B7A] px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                {mainCard.actionText}
                            </button>
                        )}
                    </div>
                </div>

                {/* Secondary Stat Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4">
                        <SecondaryIcon className={`w-5 h-5 ${secondaryCard.iconColor}`} />
                        {secondaryCard.title}
                    </div>
                    <div className="mb-6">
                        <p className="text-4xl font-bold text-gray-900 tracking-tight">
                            {secondaryCard.isCurrency ? rupiah(secondaryCard.value) : secondaryCard.value}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                        <span className="bg-[#bceae5] text-[#006B7A] text-[13px] font-bold px-2 py-1 rounded flex items-center gap-1">
                            {secondaryCard.trend}
                        </span>
                        <span className="text-sm font-medium text-gray-500">{secondaryCard.subtext}</span>
                    </div>
                </div>

                {/* Small Action Stats */}
                <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
                    {actionCards.map((card, idx) => {
                        const CardIcon = card.icon;
                        return (
                            <button 
                                key={idx}
                                onClick={() => navigate(card.path)} 
                                className="w-full h-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 hover:shadow-md transition-all shadow-sm text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center shrink-0`}>
                                        <CardIcon className={`w-6 h-6 ${card.iconColor}`} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-600 mb-0.5">{card.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-bold text-gray-900 leading-none">{card.value}</p>
                                            {card.badge && (
                                                <span className={`text-xs font-medium ${card.badgeColor}`}>{card.badge}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0 ml-1" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
