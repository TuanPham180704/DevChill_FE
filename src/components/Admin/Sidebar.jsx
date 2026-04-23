import {
  LayoutDashboard,
  Users,
  Film,
  FileText,
  Package,
  Headphones,
  LogOut,
  ChevronRight,
  CreditCard,
  Clapperboard,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../api/userApi";
import { toast } from "react-toastify";
import { logout } from "../../utils/auth";
import avatarImg from "../../assets/devchill-logo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }
      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin admin!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuItems = [
    { name: "Tổng quan", icon: LayoutDashboard, path: "/admin" },
    { name: "Người Dùng", icon: Users, path: "/admin/customers" },
    { name: "Phim ", icon: Film, path: "/admin/movies" },
    { name: "Công Chiếu", icon: Clapperboard, path: "/admin/showtimes" },
    { name: "Hợp đồng", icon: FileText, path: "/admin/contracts" },
    { name: "Gói dịch vụ", icon: Package, path: "/admin/plans" },
    { name: "Thanh Toán", icon: CreditCard, path: "/admin/payment" },
    { name: "Hỗ trợ", icon: Headphones, path: "/admin/support" },
  ];

  const avatarSrc = user?.avatar_url || avatarImg;

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col justify-between fixed left-0 top-0 text-slate-700 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50">
      <div>
        <div className="h-24 flex items-center px-8">
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-200">
              D
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              DEV<span className="text-cyan-500">CHILL</span>
            </h2>
          </Link>
        </div>
        <nav className="px-4 space-y-1 mt-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Main Navigation
          </p>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 shadow-sm shadow-cyan-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`${isActive ? "text-cyan-500" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                  <span className="text-[14.5px]">{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight size={14} className="text-cyan-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
        {loading ? (
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4 transition-all hover:border-cyan-100">
              <img
                src={avatarSrc}
                alt="admin avatar"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user?.username || "Quản trị viên"}
                </p>
                <p className="text-[11px] text-slate-500 truncate lowercase">
                  {user?.email || "admin@devchill.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-bold border border-transparent hover:border-red-100"
            >
              <LogOut size={16} strokeWidth={2.5} />
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
