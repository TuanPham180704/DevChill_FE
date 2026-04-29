import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown, Lock, Bell } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminHeader({ toggleSidebar, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Đã Đăn Xuất");
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-gray-800">
            Chào {user?.username ? user.username : "Đang tải..."} 👋
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Chúc bạn một ngày làm việc hiệu quả!
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 bg-white">
              <img
                src={user?.avatar_url || "/default-avatar.png"}
                alt={user?.username || "Admin"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left mr-1">
              <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                {user?.username || "Admin"}
              </p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Quản trị viên
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
              <Link
                to="/admin/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                Thông tin cá nhân
              </Link>
              <div className="h-px bg-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
