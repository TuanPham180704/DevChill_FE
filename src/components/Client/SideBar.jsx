import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTicketAlt, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { getProfile } from "../../api/userApi";
import avatarImg from "../../assets/devchill-logo.png";

export default function Sidebar({
  user: propUser,
  onLogout,
  active = "profile",
  customAvatar,
}) {
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);

  useEffect(() => {
    if (!propUser) {
      const fetchUser = async () => {
        setLoading(true);

        try {
          // ❌ bỏ token truyền tay nếu API đã dùng interceptor
          const data = await getProfile();

          setUser(data);
        } catch (err) {
          console.error(err);
          toast.error("Không thể tải thông tin user!");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [propUser]);

  const menuItems = [
    {
      id: "profile",
      icon: <FaUser />,
      label: "Tài khoản cá nhân",
      path: "/profile",
    },
    {
      id: "tickets",
      icon: <FaTicketAlt />,
      label: "Lịch sử xem phim",
      path: "/history",
    },
    {
      id: "my-premium",
      icon: <FaCrown />,
      label: "Gói đã mua",
      path: "/my-premium",
    },
    {
      id: "support",
      icon: <FaCrown />,
      label: "Hỗ trợ",
      path: "/support",
    },
  ];

  const avatarSrc = customAvatar || user?.avatar_url || avatarImg;

  const handleLogout = () => {
    toast.info("Bạn đã đăng xuất khỏi hệ thống");
    onLogout?.();
  };

  return (
    <aside className="w-80 border-r border-gray-200 bg-white p-6 flex flex-col justify-between min-h-screen shadow-sm">
      <div>
        <h2 className="text-gray-900 text-xl font-bold mb-8 tracking-wide">
          Quản lý tài khoản
        </h2>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border ${
                  active === item.id
                    ? "text-blue-600 bg-blue-50 border-blue-200 font-semibold"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-6 pb-4">
        {loading ? (
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Đang tải thông tin...
          </p>
        ) : (
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 p-0.5"
              />
              {user?.is_premium && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                  <span className="flex w-4 h-4 bg-yellow-400 rounded-full text-[8px] items-center justify-center text-black font-bold">
                    ★
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-bold truncate">
                  {user?.username || "Người dùng"}
                </p>
                {user?.is_premium && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black font-semibold">
                    PRO
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-xs truncate mt-0.5">
                {user?.email || ""}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-200"
        >
          <FaSignOutAlt />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
