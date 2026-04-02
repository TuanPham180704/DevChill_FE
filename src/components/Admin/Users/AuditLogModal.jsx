import React, { useState } from 'react';
import { FaTimes, FaHistory, FaUserShield, FaUserCheck, FaUserSlash, FaClock, FaEdit } from 'react-icons/fa';
import Pagination from '../Pagination';

export default function AuditLogModal({ isOpen, onClose, logs = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const currentLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionStyles = (action) => {
    switch (action) {
      case 'BLOCK':
        return { icon: <FaUserSlash />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'KHÓA' };
      case 'UNBLOCK':
        return { icon: <FaUserShield />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'MỞ KHÓA' };
      case 'UPDATE':
        return { icon: <FaEdit />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'CẬP NHẬT' };
      default:
        return { icon: <FaHistory />, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', label: 'CẬP NHẬT' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-[80vw] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100">
              <FaHistory size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight uppercase">LỊCH SỬ THAO TÁC</h3>
              <p className="text-gray-500 text-xs mt-0.5 font-medium">Theo dõi các hoạt động quản trị hệ thống</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all flex items-center justify-center border border-transparent hover:border-gray-200 active:scale-95"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 w-[10%] text-center">ID</th>
                  <th className="py-4 px-6 w-[15%]">Thời gian</th>
                  <th className="py-4 px-6 w-[15%]">Người đổi</th>
                  <th className="py-4 px-6 w-[15%]">Hành động</th>
                  <th className="py-4 px-6 w-[15%]">Đối tượng</th>
                  <th className="py-4 px-6 w-[30%]">Lý do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-24 text-center text-gray-400 text-sm italic font-medium">
                      Chưa có dữ liệu thao tác nào được ghi nhận.
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log) => {
                    const style = getActionStyles(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-indigo-50/20 transition-all group">
                        <td className="py-5 px-6 text-center">
                          <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">#{log.id}</span>
                        </td>
                        <td className="py-5 px-6">
                           <span className="text-gray-900 text-sm font-bold font-sans">{formatDate(log.created_at)}</span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2.5">
                             <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/10 shadow-sm font-sans shrink-0">
                                {log.admin_name?.[0].toUpperCase() || 'A'}
                             </div>
                             <span className="text-gray-700 text-sm font-bold truncate">{log.admin_name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest border shadow-sm w-27.5 ${style.bg} ${style.color} ${style.border} transition-all duration-300 hover:shadow-md hover:scale-105 select-none`}>
                            {React.cloneElement(style.icon, { size: 11, className: "shrink-0" })}
                            <span>{style.label}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col truncate">
                            <span className="text-gray-700 text-sm font-bold truncate">{log.target_name}</span>
                            <span className="text-[10px] text-indigo-500 font-bold mt-0.5">#{log.entity_id}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-gray-500 text-sm italic max-w-full leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                            {log.action === 'UPDATE' ? "-" : (log.reason || "-")}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={logs.length}
              itemsPerPage={itemsPerPage}
              itemName="thao tác"
            />
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-all font-bold text-sm shadow-sm active:scale-95 w-full sm:w-auto"
          >
            Đóng bảng nhật ký
          </button>
        </div>
      </div>
    </div>
  );
}
