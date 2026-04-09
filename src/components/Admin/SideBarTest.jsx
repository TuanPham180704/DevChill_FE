import {
  FaChartBar,
  FaUsers,
  FaFilm,
  FaFileContract,
  FaBoxOpen,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function SideBarTest() {
  const location = useLocation();

  const menuItems = [
    { name: "Tổng quan", icon: <FaChartBar />, path: "/admin/dashboardtest" },
    { name: "Quản lý khách hàng", icon: <FaUsers />, path: "/admin/customerstest" },
    { name: "Quản lý phim", icon: <FaFilm />, path: "/admin/moviestest" },
    { name: "Quản lý hợp đồng", icon: <FaFileContract />, path: "/admin/contractstest" },
    { name: "Quản lý gói", icon: <FaBoxOpen />, path: "/admin/packagestest" },
    { name: "Quản lý hỗ trợ", icon: <FaHeadset />, path: "/admin/supporttest" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#060a14]/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 text-white z-50">
      <div>
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-[#10B981]">
            DEV<span className="font-light text-white">CHILL</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">TEST</span>
          </h2>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 bg-[#060a14]/50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              T
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">
                Tester
              </p>
              <p className="text-xs text-gray-400 mt-1">Môi trường Test</p>
            </div>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
            title="Đăng xuất (Test)"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
