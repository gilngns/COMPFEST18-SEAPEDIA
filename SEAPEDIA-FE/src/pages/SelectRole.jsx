import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

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
    try {
      const res = await api.post("/auth/select-role", { role });
      localStorage.setItem("token", res.data.token);
      setUser({ ...user, activeRole: res.data.activeRole });
      if (res.data.activeRole === "SELLER") {
        navigate("/seller");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.error || "Gagal memilih peran",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Background Penuh */}
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
        {user.roles.map((role) => {
          const info = ROLE_INFO[role];
          if (!info) return null;
          return (
            <button
              key={role}
              onClick={() => choose(role)}
              className="bg-[#0b1b33]/40 backdrop-blur-xl rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] border border-white/10 px-8 py-10 text-center hover:bg-[#0b1b33]/60 hover:border-white/30 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-[84px] h-[84px] bg-[#147287]/40 rounded-full flex items-center justify-center mb-6 text-[#38e8ff] group-hover:bg-[#38e8ff] group-hover:text-[#060c17] transition-all duration-300 shadow-[0_0_15px_rgba(56,232,255,0.2)] group-hover:shadow-[0_0_25px_rgba(56,232,255,0.6)]">
                {info.icon}
              </div>
              <h3 className="font-semibold tracking-wide text-[1.2rem] text-white mb-2 group-hover:text-[#38e8ff] transition-colors">
                {info.title}
              </h3>
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