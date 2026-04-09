import {
  FaChartBar,
  FaUsers,
  FaFilm,
  FaFileContract,
  FaBoxOpen,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
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
    { name: "Tổng quan", icon: <FaChartBar />, path: "/admin" },
    { name: "Quản lý khách hàng", icon: <FaUsers />, path: "/admin/customers" },
    { name: "Quản lý phim", icon: <FaFilm />, path: "/admin/movies" },
    {
      name: "Quản lý hợp đồng",
      icon: <FaFileContract />,
      path: "/admin/contracts",
    },
    { name: "Quản lý gói", icon: <FaBoxOpen />, path: "/admin/packages" },
    { name: "Quản lý hỗ trợ", icon: <FaHeadset />, path: "/admin/support" },
  ];

  const avatarSrc = user?.avatar_url || avatarImg;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 text-gray-700 shadow-lg z-50">
      <div>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-black tracking-tighter text-gray-800">
            DEV<span className="font-light text-cyan-500">CHILL</span>
          </h2>
        </div>
        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 shadow-sm border-l-4 border-cyan-500"
                    : "text-gray-600 hover:text-cyan-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 flex flex-col gap-4">
        {loading ? (
          <p className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
            Đang tải thông tin...
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={avatarSrc}
              alt="admin avatar"
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
            <div className="flex flex-col truncate">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Quản lý hệ thống"}
              </p>
            </div>
          </div>
        )}
        {!loading && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all font-medium"
          >
            <FaSignOutAlt size={16} />
            Đăng xuất
          </button>
        )}
      </div>
    </aside>
  );
}
