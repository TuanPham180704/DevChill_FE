import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Film, FileText, Package, Radio,
  HeadphonesIcon, BarChart3, Bell, ChevronRight, Menu, X,
  LogOut, Film as FilmIcon, ChevronDown, Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, href: '/admin/dashboardtest' },
  { label: 'Người Dùng',  icon: Users,            href: '/admin/customerstest' },
  { label: 'Hợp Đồng',    icon: FileText,         href: '/admin/contractstest' },
  { label: 'Quản Lý Phim',icon: Film,             href: '/admin/moviestest' },
  { label: 'Gói Dịch Vụ', icon: Package,          href: '/admin/packagestest' },
  { label: 'Công Chiếu',  icon: Radio,            href: '/admin/premieretest' },
  { label: 'Hỗ Trợ',      icon: HeadphonesIcon,   href: '/admin/supporttest' },
  { label: 'Báo Cáo',     icon: BarChart3,        href: '/admin/reportstest' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'warning', message: 'Hợp đồng "Eternal Echo" đã vi phạm', time: '5 phút trước' },
  { id: 2, type: 'info',    message: '4 yêu cầu hỗ trợ mới cần xử lý',    time: '15 phút trước' },
  { id: 3, type: 'success', message: 'Công chiếu "Neon Warriors" đang LIVE', time: '1 giờ trước' },
];

export default function AdminLayoutTest() {
  const location            = useLocation();
  const navigate            = useNavigate();
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen,         setNotifOpen]         = useState(false);

  const isActive = (href) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href);
  
  const currentPage = NAV_ITEMS.find(n => isActive(n.href))?.label ?? 'Dashboard';

  /* ─── Sidebar content (reused for desktop + mobile) ─────────────────── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#3B82F6,#7C3AED)' }}>
          <FilmIcon size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black"
                style={{ background: 'linear-gradient(135deg,#3B82F6,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DevChill
              </span>
              <span className="px-1 py-0.5 rounded text-[8px] bg-blue-50 text-blue-500 border border-blue-100 font-bold uppercase">Test</span>
            </div>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} to={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              title={!sidebarOpen ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
              style={{ background: active ? '#EFF6FF' : 'transparent', color: active ? '#3B82F6' : '#64748B' }}>
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div className="p-3 border-t" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: '#F5F7FA' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#3B82F6,#7C3AED)' }}>T</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Tester</p>
              <p className="text-xs text-gray-400">Environment: Test</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={() => navigate('/admin/customerstest')} className="p-1 rounded-lg hover:bg-white text-gray-400">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>

      <div className="flex h-full overflow-hidden">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col shrink-0 transition-all duration-300 bg-white border-r"
          style={{ width: sidebarOpen ? 240 : 64, borderColor: '#E2E8F0' }}>
          <SidebarContent />
        </aside>

        {/* Sidebar — mobile overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="w-64 bg-white h-full shadow-2xl flex flex-col transition-all duration-300 transform scale-100">
              <SidebarContent />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Topbar */}
          <header className="flex items-center gap-4 px-4 md:px-6 h-16 bg-white border-b shrink-0"
            style={{ borderColor: '#E2E8F0' }}>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Collapse toggle (desktop) */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-2 rounded-lg hover:bg-gray-100">
              <Menu size={18} className="text-gray-500" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Admin (Test)</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="font-semibold text-gray-700">{currentPage}</span>
            </div>

            <div className="flex-1" />
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100">
                <Bell size={18} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border z-50 animate-in fade-in zoom-in duration-200"
                  style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                    <h3 className="font-semibold text-gray-800">Thông báo</h3>
                    <button onClick={() => setNotifOpen(false)}><X size={16} className="text-gray-400" /></button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto custom-scrollbar">
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === 'warning' ? 'bg-yellow-400' : n.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t">
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-600">Xem tất cả</button>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page content - Fill available space and prevent scroll */}
          <main className="flex-1 min-h-0 flex flex-col p-4 md:px-6 md:py-6 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
