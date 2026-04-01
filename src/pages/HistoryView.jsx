import { FiClock, FiPlay, FiTrash2, FiMoreVertical, FiFilm } from "react-icons/fi";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar";

const mockHistory = []; // Đã làm rỗng danh sách để xem giao diện "chưa có phim"

export default function HistoryView() {
  return (
    <div className="min-h-screen bg-[#0A0E17] flex">
      {/* ── LEFT PANEL – Sidebar ─────────────────────────────────────── */}
      <Sidebar active="tickets" />

      {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
      <main className="flex-1 bg-[#111827] px-16 py-12 overflow-y-auto max-h-screen hidden-scrollbar">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-1">Lịch sử xem phim</h1>
            <p className="text-[#94a3b8] text-sm">Quản lý các bộ phim bạn đã hoặc đang xem</p>
          </div>
          
          {mockHistory.length > 0 && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(244,63,94,0.3)] text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] hover:border-[#f43f5e] transition-all text-sm font-medium group">
              <FiTrash2 className="group-hover:scale-110 transition-transform" /> Xóa tất cả
            </button>
          )}
        </div>

        {/* Content list / Empty State */}
        <div className="flex flex-col gap-4">
          {mockHistory.length > 0 ? (
            mockHistory.map((item) => (
              <div key={item.id} className="group flex gap-6 p-4 rounded-2xl bg-[rgba(15,23,42,0.4)] border border-[rgba(100,116,139,0.15)] hover:bg-[rgba(15,23,42,0.7)] hover:border-[rgba(0,242,255,0.3)] hover:shadow-[0_4px_30px_rgba(0,242,255,0.06)] transition-all duration-300">
                
                {/* Poster with Play overlay */}
                <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer bg-[#0A0E17]">
                  <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-[#00F2FF]/20 flex items-center justify-center border border-[#00F2FF]/50 shadow-[0_0_20px_rgba(0,242,255,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <FiPlay className="text-[#00F2FF] text-xl ml-1" />
                    </div>
                  </div>
                  
                  {/* Embedded Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/60 backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-[#00F2FF] to-[#00bfa5] shadow-[0_0_10px_rgba(0,242,255,0.8)] relative" style={{ width: `${item.progress}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="flex-1 flex flex-col justify-center py-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-xl cursor-pointer hover:text-[#00F2FF] transition-colors">{item.title}</h3>
                    <button className="text-[#64748b] hover:text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1e293b]">
                      <FiMoreVertical />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#94a3b8]">
                      <FiClock className="text-[#00F2FF]/70" /> 
                      <span className="text-white">{item.watchedTime}</span> / {item.totalTime}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#334155]"></div>
                    <span className={`text-sm font-medium ${item.progress === 100 ? "text-[#10b981]" : "text-[#00F2FF]"}`}>
                      {item.progress === 100 ? "Đã xem xong" : `Hoàn thành ${item.progress}%`}
                    </span>
                  </div>
                  
                  <p className="text-xs text-[#64748b] font-medium mt-auto uppercase tracking-wider">{item.lastWatched}</p>
                </div>

              </div>
            ))
          ) : (
            /* Cinematic Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[rgba(15,23,42,0.3)] rounded-2xl border border-dashed border-[rgba(100,116,139,0.2)]">
              <div className="w-20 h-20 rounded-full bg-[rgba(15,23,42,0.6)] border border-[rgba(100,116,139,0.3)] flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00F2FF]/5 blur-xl"></div>
                <FiFilm className="text-4xl text-[#334155]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Chưa có lịch sử xem</h3>
              <p className="text-[#94a3b8] max-w-sm mb-8 leading-relaxed">
                Bạn chưa xem bộ phim nào gần đây. Hãy khám phá hàng ngàn bộ phim hấp dẫn trên DevChill ngay!
              </p>
              <Link 
                to="/" 
                className="btn-cinematic px-8 py-3.5 rounded-xl text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
              >
                <FiPlay className="text-lg" />
                Khám phá phim mới
              </Link>
            </div>
          )}
        </div>

      </main>
      
      {/* Add hidden-scrollbar style directly or ensure it exists in index.css */}
      <style>{`
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}