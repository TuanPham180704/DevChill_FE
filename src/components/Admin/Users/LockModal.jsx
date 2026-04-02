import { useState, useEffect } from 'react';
import { FaTimes, FaLock, FaCalendarAlt, FaEdit } from 'react-icons/fa';

export default function LockModal({ isOpen, onClose, user, onConfirm }) {
  const [reason, setReason] = useState('');
  const [lockUntil, setLockUntil] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    if (isOpen) {

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason('');
      setLockUntil('');
      setIsPermanent(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isLocked = user.status === 'locked';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
        {/* Header/Icon */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 rotate-12 transition-transform duration-500 hover:rotate-0 shadow-lg border-b-2 ${isLocked ? 'bg-emerald-50 text-emerald-500 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
            <FaLock size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
            {isLocked ? 'MỞ KHÓA TÀI KHOẢN' : 'KHÓA TÀI KHOẢN'}
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed px-4 text-center">
            Bạn có chắc muốn {isLocked ? 'khôi phục quyền truy cập' : 'tạm đình chỉ'} cho <span className="text-gray-900 font-bold underline decoration-indigo-500/30 underline-offset-4">{user.name}</span>?
          </p>
        </div>

        {/* Content Area */}
        <div className="px-6 py-6 border-y border-gray-100 bg-gray-50/50 space-y-6">
          {/* Reason Input */}
          <div className="space-y-2 text-left animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FaEdit size={10} className="text-gray-300" /> {isLocked ? 'LÝ DO MỞ KHÓA' : 'LÝ DO KHÓA'}
            </label>
            <textarea 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={isLocked ? "Nhập lí do mở khóa..." : "Nhập lí do cụ thể (VD: Vi phạm điều khoản, Spam...)"}
              className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-400 resize-none h-24 shadow-sm ${isLocked ? 'focus:border-emerald-500/30' : 'focus:border-red-500/30'}`}
            />
          </div>

          {/* Duration/Expiration - Only for locking */}
          {!isLocked && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FaCalendarAlt size={10} className="text-gray-300" /> THỜI HẠN KHÓA
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase select-none">Vĩnh viễn</span>
                  <input 
                    type="checkbox" 
                    checked={isPermanent}
                    onChange={e => setIsPermanent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:shadow-sm after:transition-all peer-checked:bg-red-500/80 relative"></div>
                </label>
              </div>

              {!isPermanent && (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                   <input 
                    type="date" 
                    value={lockUntil}
                    onChange={e => setLockUntil(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm font-bold focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all cursor-pointer shadow-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex gap-3 bg-white">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all font-bold text-sm border border-gray-200 active:scale-95"
          >
            Hủy thao tác
          </button>
          <button 
            onClick={() => {
              onConfirm(user, { reason, lockUntil, isPermanent });
              onClose();
            }}
            className={`flex-[1.5] py-3 px-4 rounded-xl transition-all font-bold text-sm shadow-md active:scale-95 ${
              isLocked 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
            }`}
          >
            Xác nhận {isLocked ? 'Mở khóa ngay' : 'Khóa truy cập'}
          </button>
        </div>
      </div>
    </div>
  );
}
