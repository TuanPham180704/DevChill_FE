import { useState, useMemo } from 'react';
import { Shield, Eye, RefreshCw, Download, Search, LockOpen, ChevronDown, History, Lock } from 'lucide-react';
import { 
  CustomerDetailModal, 
  RoleChangeModal, 
  UnlockModal, 
  LockModal 
} from '../../components/Admin/Users/CustomerModalTest';
import Pagination from '../../components/Admin/Pagination';

/* ─── Page component ────────────────────────────────────────────────── */
export default function CustomerListTest() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('Tất cả dịch vụ');
  const [lockFilter, setLockFilter] = useState('Tất cả khóa');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchService = serviceFilter === 'Tất cả dịch vụ' || user.service === serviceFilter;
      const matchLock = lockFilter === 'Tất cả khóa' || 
                        (lockFilter === 'Bị khóa' ? user.isLocked : !user.isLocked);
      return matchSearch && matchService && matchLock;
    });
  }, [users, searchTerm, serviceFilter, lockFilter]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats calculation
  const stats = {
    total: users.length,
    premium: users.filter(u => u.service === 'Premium').length,
    restricted: users.filter(u => u.status === 'restricted').length,
    locked: users.filter(u => u.isLocked).length
  };

  const thCls = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap';
  const selCls = 'px-3 py-2 rounded-xl text-sm outline-none text-gray-600 border bg-gray-50 appearance-none cursor-pointer';

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleOpenLock = (user) => {
    setSelectedUser(user);
    setShowLockModal(true);
  };

  const handleOpenUnlock = (user) => {
    setSelectedUser(user);
    setShowUnlockModal(true);
  };

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
          <p className="text-sm text-gray-400 mt-1">{stats.total} người dùng · {stats.total - stats.locked} đang hoạt động</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
          style={{ background: '#fff', color: '#64748B', borderColor: '#000000' }}>
          <History size={14} /> Lịch sử thao tác
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-blue-500">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng users</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-amber-500">{stats.premium}</p>
          <p className="text-xs text-gray-500 mt-1">Premium</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-red-500">{stats.restricted}</p>
          <p className="text-xs text-gray-500 mt-1">Hạn chế</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-2xl font-black text-purple-500">{stats.locked}</p>
          <p className="text-xs text-gray-500 mt-1">Bị khóa</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Left: Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Tìm tên, email..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none text-gray-700 border" 
              style={{ background: '#ffffff', borderColor: '#E2E8F0' }} 
            />
          </div>
          <div className="relative">
            <select 
              value={serviceFilter}
              onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
              className={selCls} 
              style={{ borderColor: '#E2E8F0' }}
            >
              <option>Tất cả dịch vụ</option>
              <option>Free</option>
              <option>Premium</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={lockFilter}
              onChange={(e) => { setLockFilter(e.target.value); setCurrentPage(1); }}
              className={selCls} 
              style={{ borderColor: '#E2E8F0' }}
            >
              <option>Tất cả khóa</option>
              <option>Bình thường</option>
              <option>Bị khóa</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => { setSearchTerm(''); setServiceFilter('Tất cả dịch vụ'); setLockFilter('Tất cả khóa'); setCurrentPage(1); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ background: '#fff', color: '#64748B', borderColor: '#E2E8F0' }}>
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
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">#{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm bg-gradient-to-br ${user.role === 'Admin' ? 'from-purple-500 to-indigo-600' : 'from-blue-400 to-blue-600'}`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase italic tracking-wider border ${
                      user.service === 'Premium' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}>
                      {user.service}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 ${
                      user.status === 'active' ? 'text-green-600' : 
                      user.status === 'restricted' ? 'text-rose-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                         user.status === 'active' ? 'bg-green-500' : 
                         user.status === 'restricted' ? 'bg-rose-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs font-bold">
                        {user.status === 'active' ? 'Đã kích hoạt' : 
                         user.status === 'restricted' ? 'Bị hạn chế' : 'Chưa kích hoạt'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                      user.isLocked 
                      ? 'bg-rose-50 text-rose-500 border-rose-100' 
                      : 'bg-blue-50 text-blue-500 border-blue-100'
                    }`}>
                      {user.isLocked ? 'Đã khóa' : 'Bình thường'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenDetail(user)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Xem chi tiết"><Eye size={16} /></button>
                      {user.isLocked ? (
                        <button onClick={() => handleOpenUnlock(user)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="Mở khóa tài khoản"><Lock size={16} /></button>
                      ) : (
                        <button onClick={() => handleOpenLock(user)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Khóa tài khoản"><LockOpen size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400 italic">
                    Không tìm thấy người dùng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: '#E2E8F0' }}>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            itemName="người dùng"
          />
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
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
            user={selectedUser}
          />

          <UnlockModal 
            isOpen={showUnlockModal}
            onClose={() => setShowUnlockModal(false)}
            user={selectedUser}
          />

          <LockModal 
            isOpen={showLockModal}
            onClose={() => setShowLockModal(false)}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
