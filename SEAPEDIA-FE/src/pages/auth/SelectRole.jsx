import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { authService } from "../../services/authService";

const ALL_ROLES = ["BUYER", "SELLER", "DRIVER"];

const ROLE_INFO = {
  BUYER: {
    title: "Buyer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  SELLER: {
    title: "Seller",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 1.5 6.75v.75c0 2.071 1.68 3.75 3.75 3.75h.077c.365-.002.723-.058 1.066-.164l2.846-1.139a.75.75 0 0 0 .47-.697V3.375a1.125 1.125 0 0 0-1.125-1.125H5.223ZM11.25 3.375v5.875a.75.75 0 0 0 .47.697l2.846 1.139c.343.106.7.162 1.066.164h.077c2.07 0 3.75-1.679 3.75-3.75v-.75c0-1.046-.43-1.996-1.098-2.652l-1.3-1.298a1.875 1.875 0 0 0-1.325-.55H11.25ZM18.777 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298a1.875 1.875 0 0 0-.428.697v5.875a.75.75 0 0 0 .47.697l2.846 1.139c.343.106.7.162 1.066.164h.077c2.07 0 3.75-1.679 3.75-3.75v-.75c0-1.046-.43-1.996-1.098-2.652l-1.3-1.298a3.75 3.75 0 0 0-1.325-.55H18.777Z" />
        <path fillRule="evenodd" d="M3 12.75a.75.75 0 0 0-.75.75v6A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5v-6a.75.75 0 0 0-.75-.75H3Zm4.5 4.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  DRIVER: {
    title: "Driver",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 0 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
        <path d="M8.25 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.468c.85-.879 1.5-2.02 1.5-3.216V11.475c0-1.381-.884-2.585-2.184-2.915l-1.928-.482A3.811 3.811 0 0 0 17.433 7.8l-.208-.052A.75.75 0 0 0 15.75 6.75ZM18 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
};

export default function SelectRole() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  async function choose(role) {
    if (!user.roles.includes(role)) {
      const confirm = await Swal.fire({
        title: "Tambah Peran?",
        text: `Anda belum terdaftar sebagai ${ROLE_INFO[role]?.title}. Ingin menambahkannya sekarang?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan!",
        cancelButtonText: "Batal",
        confirmButtonColor: "#147287"
      });
      if (!confirm.isConfirmed) return;
      
      try {
        const res = await authService.addRole(role);
        localStorage.setItem("token", res.token);
        setUser({ ...user, roles: [...user.roles, role], activeRole: res.activeRole });
        navigateRole(res.activeRole);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.response?.data?.message || err.message || "Gagal menambah peran",
        });
      }
      return;
    }

    try {
      const res = await authService.selectRole(role);
      localStorage.setItem("token", res.token);
      setUser({ ...user, activeRole: res.activeRole });
      navigateRole(res.activeRole);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || err.message || "Gagal memilih peran",
      });
    }
  }

  function navigateRole(activeRole) {
    if (activeRole === "SELLER") {
      navigate("/seller");
    } else if (activeRole === "BUYER") {
      navigate("/buyer");
    } else if (activeRole === "DRIVER") {
      navigate("/driver");
    } else if (activeRole === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans">
      {}
      <div className="absolute inset-0 bg-[#060c17]">
        <img 
          src="/loginbg.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08303b]/90 via-[#08303b]/60 to-[#060c17]/70 mix-blend-multiply"></div>
      </div>

      <div className="text-center mb-10 max-w-[500px] relative z-10">
        <h1 className="text-[2.5rem] font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-md">
          Sign in as
        </h1>
        <p className="text-gray-200 text-[15px] leading-relaxed drop-shadow-sm font-medium">
          Choose your role to continue. You can change this later in profile settings.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[900px] w-full px-2 relative z-10">
        {ALL_ROLES.map((role) => {
          const info = ROLE_INFO[role];
          if (!info) return null;
          const isOwned = user.roles.includes(role);
          return (
            <button
              key={role}
              onClick={() => choose(role)}
              className={`backdrop-blur-xl rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] border px-8 py-10 text-center transition-all duration-300 flex flex-col items-center group cursor-pointer 
                ${isOwned 
                  ? "bg-[#0b1b33]/40 border-white/10 hover:bg-[#0b1b33]/60 hover:border-white/30 hover:-translate-y-2" 
                  : "bg-[#0b1b33]/20 border-white/5 opacity-70 hover:opacity-100 hover:bg-[#0b1b33]/40 hover:-translate-y-1 grayscale hover:grayscale-0"}`}
            >
              <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center mb-6 transition-all duration-300 
                ${isOwned 
                  ? "bg-[#147287]/40 text-[#38e8ff] group-hover:bg-[#38e8ff] group-hover:text-[#060c17] shadow-[0_0_15px_rgba(56,232,255,0.2)] group-hover:shadow-[0_0_25px_rgba(56,232,255,0.6)]"
                  : "bg-gray-700/40 text-gray-400 group-hover:bg-[#147287]/80 group-hover:text-white"}`}>
                {info.icon}
              </div>
              <h3 className={`font-semibold tracking-wide text-[1.2rem] mb-2 transition-colors
                ${isOwned ? "text-white group-hover:text-[#38e8ff]" : "text-gray-400 group-hover:text-white"}`}>
                {info.title}
              </h3>
              {!isOwned && (
                <span className="text-[11px] font-medium text-[#38e8ff]/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add Role
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 text-white/80 hover:text-white text-[15px] font-semibold mt-14 hover:underline relative z-10 transition-colors drop-shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}