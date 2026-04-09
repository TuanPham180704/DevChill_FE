import { useState } from 'react';
import { Shield, Eye, RefreshCw, Download, Search, LockOpen, ChevronDown, History, Lock } from 'lucide-react';
import { 
  CustomerDetailModal, 
  RoleChangeModal, 
  UnlockModal, 
  LockModal 
} from '../../components/Admin/Users/CustomerModalTest';

/* ─── Page component ────────────────────────────────────────────────── */
export default function CustomerListTest() {
  const [showModal, setShowModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: '#2491024',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    role: 'User',
    service: 'Premium',
    isLocked: true,
    lockReason: 'Vi phạm điều khoản cộng đồng: Đăng tải nội dung không phù hợp nhiều lần.',
    lockUntil: '20/04/2026'
  });
  const thCls = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap';
  const selCls = 'px-3 py-2 rounded-xl text-sm outline-none text-gray-600 border bg-gray-50 appearance-none cursor-pointer';
  const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all';
  const getInpStyle = (editable) => ({
    background: editable ? '#FFFFFF' : '#F8FAFC',
    borderColor: editable ? '#6366F1' : '#F1F5F9',
    color: editable ? '#1E293B' : '#64748B'
  });
  const labelCls = 'block text-xs font-bold text-gray-500 mb-1.5 ml-1';

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Quản lý Người dùng</h1>
          <p className="text-sm text-gray-400 mt-1">0 người dùng · 0 đang hoạt động</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
          style={{ background: '#fff', color: '#64748B', borderColor: '#000000' }}>
          <History size={14} /> Lịch sử thao tác
        </button>
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

      {/* Filters & Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Left: Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input placeholder="Tìm tên, email..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none text-gray-700 border" style={{ background: '#ffffff', borderColor: '#000000' }} />
          </div>
          <div className="relative">
            <select className={selCls} style={{ borderColor: '#000000', borderWidth: '1px', borderStyle: 'solid' }}>
              <option>Tất cả dịch vụ</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className={selCls} style={{ borderColor: '#000000', borderWidth: '1px', borderStyle: 'solid' }}>
              <option>Tất cả trạng thái</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className={selCls} style={{ borderColor: '#000000', borderWidth: '1px', borderStyle: 'solid' }}>
              <option>Tất cả khóa</option>
              <option>Bình thường</option>
              <option>Bị khóa</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ background: '#fff', color: '#64748B', borderColor: '#000000' }}>
            <RefreshCw size={14} /> Làm mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ background: '#EFF6FF', color: '#3B82F6', borderColor: '#BFDBFE' }}>
            <Download size={14} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border overflow-hidden shadow-sm min-h-0" style={{ borderColor: '#E2E8F0' }}>
        
        {/* Table Body - Scrollable area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" /></th>
                <th className={thCls}>ID</th>
                <th className={thCls}>Người dùng</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Vai trò</th>
                <th className={thCls}>Dịch vụ</th>
                <th className={thCls}>Trạng thái</th>
                <th className={thCls}>Khóa</th>
                <th className={thCls}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">#1</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">NA</div>
                    <span className="text-sm font-semibold text-gray-700">Nguyễn Văn A</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">nguyenvana@gmail.com</td>
                <td className="px-4 py-3 text-sm text-gray-600">User</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 italic tracking-wider">Premium</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-green-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-bold">Đã kích hoạt</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-500 border border-blue-100">Bình thường</span>
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-1">
                      <button onClick={() => setShowModal(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Xem chi tiết"><Eye size={16} /></button>
                      <button onClick={() => setShowLockModal(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Khóa tài khoản"><LockOpen size={16} /></button>
                   </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-t border-gray-50">
                <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">#2</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">TH</div>
                    <span className="text-sm font-semibold text-gray-700">Trần Thị H</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">tranthih@gmail.com</td>
                <td className="px-4 py-3 text-sm text-gray-600">User</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-50 text-gray-400 border border-gray-100 italic tracking-wider">Free</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold">Bị hạn chế</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-100">Đã khóa</span>
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-1">
                      <button onClick={() => setShowModal(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Xem chi tiết"><Eye size={16} /></button>
                      <button onClick={() => setShowUnlockModal(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="Mở khóa tài khoản"><Lock size={16} /></button>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <CustomerDetailModal 
          isOpen={showModal} 
          onClose={() => { setShowModal(false); setIsEditing(false); }}
          user={selectedUser}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onShowRoleModal={() => setShowRoleModal(true)}
        />

        <RoleChangeModal 
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
        />

        <UnlockModal 
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
        />

        <LockModal 
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
        />

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-sm font-medium text-gray-600">Hiển thị <span className="text-blue-600">0</span> / 0 người dùng</p>
          </div>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed">Trước</button>
            <button className="w-8 h-8 rounded-lg text-xs font-black bg-blue-500 text-white shadow-lg shadow-blue-500/20">1</button>
            <button disabled className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
