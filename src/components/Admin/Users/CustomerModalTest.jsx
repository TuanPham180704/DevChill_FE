import React, {  } from 'react';
import { 
  X, Pencil, Mail, Lock, User, Briefcase, Calendar, 
  Info, Clock, AlertTriangle, Shield, ChevronDown, LockOpen 
} from 'lucide-react';

/* ─── Shared Styles/Logic ────────────────────────────────────────── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all';
const labelCls = 'block text-xs font-bold text-gray-500 mb-1.5 ml-1';
const getInpStyle = (editable) => ({
  background: editable ? '#FFFFFF' : '#F8FAFC',
  borderColor: editable ? '#6366F1' : '#F1F5F9',
  color: editable ? '#1E293B' : '#64748B'
});

/* ─── User Detail Modal ────────────────────────────────────────── */
export function CustomerDetailModal({ isOpen, onClose, user, isEditing, setIsEditing, onShowRoleModal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#FBFBFE] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Chi tiết hồ sơ</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quản lý định danh người dùng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(!isEditing)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isEditing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}>
              <Pencil size={16} /> {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-72 border-r p-6 flex flex-col border-gray-100 shrink-0 text-center">
            <div className="relative mb-6 group self-center">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200 ring-6 ring-indigo-50">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "US"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center text-white">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-800 mb-1">{user?.name || "Người dùng"}</h3>
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                ID: {user?.id || "#000000"}
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                 <div className="flex items-center justify-between mb-2 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                   <span>Thành viên</span>
                   <Calendar size={10} />
                 </div>
                 <div className="space-y-1.5">
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] font-bold text-gray-400">Tham gia</span>
                     <span className="text-[11px] font-black text-indigo-600">{user?.join_date ? new Date(user.join_date).toLocaleDateString('vi-VN') : '---'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] font-bold text-gray-400">Cuối</span>
                     <span className="text-[11px] font-black text-indigo-600">{user?.last_login ? new Date(user.last_login).toLocaleDateString('vi-VN') : '---'}</span>
                   </div>
                 </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                 <div className="flex items-center justify-between mb-2 text-[9px] font-black uppercase tracking-widest text-amber-500">
                   <span>Hiện tại</span>
                   <Briefcase size={10} />
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-gray-400 italic">{user?.service_name || 'Free Plan'}</span>
                   <span className={`px-1.5 py-0.5 rounded-md text-white text-[7px] font-black uppercase ${user?.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                     {user?.status || 'Inactive'}
                   </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Col 1 */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-indigo-600">
                       <Mail size={14} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Đăng nhập</h4>
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input disabled={!isEditing} defaultValue={user?.email || ""} className={inputCls} style={getInpStyle(isEditing)} />
                    </div>
                    <div>
                      <label className={labelCls}>Mật khẩu</label>
                      <input disabled={!isEditing} type="password" placeholder="••••••••" className={inputCls} style={getInpStyle(isEditing)} />
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pt-1">
                       <User size={14} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Cá nhân</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className={labelCls}>Ngày sinh</label>
                         <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 font-bold text-xs">{user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : '---'}</div>
                      </div>
                      <div>
                         <label className={labelCls}>Giới tính</label>
                         <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 font-bold text-xs">{user?.gender || '---'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-indigo-600">
                       <Shield size={14} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Dịch vụ</h4>
                    </div>
                    <div>
                      <label className={labelCls}>Vai trò</label>
                      <div className="relative">
                        <select 
                          disabled={!isEditing} 
                          className={inputCls} 
                          style={getInpStyle(isEditing)}
                          defaultValue={user?.role || "User"}
                          onChange={(e) => {
                            if (e.target.value === "Admin") onShowRoleModal();
                          }}
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                        {isEditing && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Dịch vụ</label>
                      <div className="relative">
                        <select disabled={!isEditing} className={inputCls} style={getInpStyle(isEditing)} defaultValue={user?.service || "Premium"}>
                          <option>Premium</option>
                          <option>Free</option>
                        </select>
                        {isEditing && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pt-1">
                       <Info size={14} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Trạng thái</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                           <p className="text-[11px] font-black text-emerald-600 uppercase">Hoạt động</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lock Info */}
                {user?.isLocked && (
                  <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                           <Lock size={16} />
                         </div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Bảo mật</h4>
                       </div>
                       <span className="px-3 py-1 rounded-lg bg-rose-500 text-white text-[9px] font-black uppercase">Bị khóa</span>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-rose-300 uppercase mb-1.5 ml-1">Lý do</label>
                        <div className="p-3.5 rounded-2xl bg-white border border-rose-100 text-xs font-bold text-rose-600 italic leading-relaxed shadow-sm">
                          "{user?.lockReason || "Không rõ lý do"}"
                        </div>
                      </div>
                      <div className="w-48 shrink-0">
                         <label className="block text-[9px] font-black text-rose-300 uppercase mb-1.5 ml-1">Mở khóa</label>
                         <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white border border-rose-100 shadow-sm text-rose-600">
                           <Clock size={14} />
                           <span className="text-sm font-black">{user?.lockUntil ? new Date(user.lockUntil).toLocaleDateString('vi-VN') : '---'}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-50 bg-[#FBFBFE] shrink-0">
              <button onClick={onClose} className="px-8 py-2.5 rounded-xl text-sm font-black border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest bg-white">
                Hủy
              </button>
              <button disabled={!isEditing} className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${
                isEditing ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Role Change Modal ────────────────────────────────────────── */
export function RoleChangeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-6 ring-8 ring-amber-50/50">
             <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Xác nhận cấp quyền?</h3>
          <p className="text-sm font-bold text-gray-400 leading-relaxed mb-8">
            Bạn đang chuẩn bị cấp quyền <span className="text-amber-500 underline decoration-amber-200 decoration-2 underline-offset-4">Quản trị viên (Admin)</span> cho người dùng này. Họ sẽ có toàn quyền truy cập hệ thống.
          </p>
          
          <div className="flex flex-col gap-3">
            <button onClick={onClose} className="w-full py-4 rounded-2xl bg-amber-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Xác nhận chuyển đổi
            </button>
            <button onClick={onClose} className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Unlock Account Modal ──────────────────────────────────────── */
export function UnlockModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <LockOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 leading-none">Mở khóa tài khoản</h3>
              <p className="text-[10px] font-bold text-emerald-300 uppercase mt-1">Khôi phục quyền truy cập</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 leading-relaxed text-center">
              Hành động này sẽ khôi phục toàn bộ quyền truy cập dịch vụ cho người dùng ngay lập tức.
            </p>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Ghi chú mở khóa (tùy chọn)</label>
            <textarea placeholder="Nhập lý do hoặc ghi chú khôi phục quyền truy cập..." className="w-full px-4 py-3 rounded-2xl text-sm outline-none border border-gray-100 focus:border-emerald-300 transition-all min-h-20 bg-gray-50/50" />
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">
            Hủy
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Xác nhận mở khóa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Lock Account Modal ────────────────────────────────────────── */
export function LockModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 leading-none">Khóa Tài khoản</h3>
              <p className="text-[10px] font-bold text-rose-300 uppercase mt-1">Quản lý hạn chế truy cập</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Lý do khóa tài khoản</label>
            <textarea placeholder="Ví dụ: Vi phạm điều khoản cộng đồng, đăng tải nội dung không phù hợp..." className="w-full px-4 py-3 rounded-2xl text-sm outline-none border border-gray-100 focus:border-rose-300 transition-all min-h-25 bg-gray-50/50" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Thời gian khóa đến hết ngày</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors pointer-events-none">
                <Calendar size={18} />
              </div>
              <input type="date" className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm outline-none border border-gray-100 focus:border-rose-300 transition-all bg-gray-50/50 font-bold text-gray-700" />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">* Tài khoản sẽ tự động được mở khóa sau ngày này.</p>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">
            Hủy
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-rose-500 text-white shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Xác nhận khóa
          </button>
        </div>
      </div>
    </div>
  );
}
