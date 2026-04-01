import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTicketAlt, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import avatarImg from "../assets/avatar.jpg";

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
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }
        try {
          const data = await getProfileApi(token);
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

  return (
    <aside className="w-80 border-r border-[rgba(100,116,139,0.3)] bg-[rgba(15,23,42,0.4)] md:bg-transparent p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-white text-xl font-bold mb-8 tracking-wide">Quản lý tài khoản</h2>

        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  active === item.id
                    ? "text-[#00F2FF] bg-[rgba(0,242,255,0.1)] font-semibold shadow-[0_0_15px_rgba(0,242,255,0.15)] border border-[rgba(0,242,255,0.2)]"
                    : "text-[#94a3b8] hover:text-white hover:bg-[rgba(100,116,139,0.2)] border border-transparent"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[rgba(100,116,139,0.3)] pt-6 pb-4">
        {loading ? (
          <p className="text-[#94a3b8] text-sm flex items-center gap-2">
            <span className="btn-spinner border-[#00F2FF] border-t-transparent w-4 h-4" />
            Đang tải thông tin...
          </p>
        ) : (
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <img
                src={
                  customAvatar ||
                  user?.avatar_url ||
                  avatarImg
                }
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00F2FF] p-0.5"
              />
              {user?.is_premium && (
                <div className="absolute -bottom-1 -right-1 bg-[#111827] rounded-full p-0.5">
                  <span className="flex w-4 h-4 bg-gradient-to-r from-[#FFB703] to-[#FFD000] rounded-full text-[8px] items-center justify-center text-[#111827] font-bold">★</span>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-[#e2e8f0] font-bold truncate">{user?.username || "Người dùng"}</p>
              {user?.is_premium && (
                <span className="text-[#FFB703] text-xs font-semibold uppercase tracking-wider">Premium</span>
              )}
              <p className="text-[#94a3b8] text-xs truncate mt-0.5">{user?.email || ""}</p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 rounded-xl border border-[rgba(244,63,94,0.3)] text-[#f43f5e] font-medium hover:bg-[rgba(244,63,94,0.1)] hover:border-[#f43f5e] transition-all duration-300 shadow-[0_4px_14px_0_rgba(244,63,94,0.1)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)]"
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
