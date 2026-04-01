import { FiX } from "react-icons/fi";

export default function Changepassword({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md bg-[#111827] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[rgba(0,242,255,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center pt-6 pb-4 border-b border-[rgba(100,116,139,0.2)]">
          <h2 className="text-white text-xl font-bold tracking-wide">Đổi mật khẩu</h2>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-[#94a3b8] hover:text-[#00F2FF] transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="w-full px-5 py-3.5 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(100,116,139,0.3)] text-white text-sm outline-none placeholder-[#64748b] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full px-5 py-3.5 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(100,116,139,0.3)] text-white text-sm outline-none placeholder-[#64748b] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="w-full px-5 py-3.5 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(100,116,139,0.3)] text-white text-sm outline-none placeholder-[#64748b] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
          />
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-[rgba(100,116,139,0.4)] bg-[rgba(15,23,42,0.6)] text-[#e2e8f0] text-sm font-medium hover:border-[rgba(0,242,255,0.4)] hover:text-[#00F2FF] hover:bg-[rgba(15,23,42,0.8)] transition-all"
          >
            Hủy
          </button>
          <button 
            type="button"
            className="px-6 py-2.5 rounded-xl bg-[#00F2FF] text-[#0A0E17] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,242,255,0.45)] hover:-translate-y-0.5 transition-all"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
