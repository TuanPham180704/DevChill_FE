import { Shield, Eye, MoreHorizontal, RefreshCw, Download, Search, LockOpen } from 'lucide-react';

/* ══════════════════════════════════════════════════════
   MAIN PAGE (PURE STATIC TEMPLATE - EMPTY STATE)
══════════════════════════════════════════════════════ */
export default function CustomerListTest() {
  const thCls = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap';
  const tdCls = 'px-4 py-3';
  const selCls = 'px-3 py-2 rounded-xl text-sm outline-none text-gray-600 border bg-gray-50 appearance-none cursor-pointer';

  return (
    <div className="min-h-screen p-6 rounded-3xl" style={{ background: '#F8FAFC' }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">0 người dùng · 0 đang hoạt động</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ background: '#fff', color: '#64748B', borderColor: '#E2E8F0' }}>
            <RefreshCw size={14} /> Làm mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ background: '#EFF6FF', color: '#3B82F6', borderColor: '#BFDBFE' }}>
            <Download size={14} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-blue-500">0</p>
          <p className="text-xs text-gray-500 mt-1">Tổng users</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-amber-500">0</p>
          <p className="text-xs text-gray-500 mt-1">Premium</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-red-500">0</p>
          <p className="text-xs text-gray-500 mt-1">Chưa kích hoạt</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-purple-500">0</p>
          <p className="text-xs text-gray-500 mt-1">Bị khóa</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Tìm tên, email..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none text-gray-700 border" style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }} />
        </div>
        <div className="relative">
          <select className={selCls} style={{ borderColor: '#E2E8F0' }} defaultValue="all">
            <option value="all">Tất cả dịch vụ</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>
        </div>
        <div className="relative">
          <select className={selCls} style={{ borderColor: '#E2E8F0' }} defaultValue="all">
            <option value="all">Tất cả trạng thái</option>
            <option value="activated">Đã kích hoạt</option>
            <option value="unactivated">Chưa kích hoạt</option>
          </select>
        </div>
        <div className="relative">
          <select className={selCls} style={{ borderColor: '#E2E8F0' }} defaultValue="all">
            <option value="all">Tất cả khóa</option>
            <option value="active">Bình thường</option>
            <option value="banned">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" /></th>
                <th className={thCls}>ID</th>
                <th className={thCls}>Người dùng</th>
                <th className={thCls}>Ngày sinh</th>
                <th className={thCls}>Dịch vụ</th>
                <th className={thCls}>Trạng thái</th>
                <th className={thCls}>Khóa</th>
                <th className={thCls}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 italic">
                  Chưa có dữ liệu người dùng
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm text-gray-500">Hiển thị 0 / 0 người dùng</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors" style={{ background: '#EFF6FF', color: '#3B82F6' }}>1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
