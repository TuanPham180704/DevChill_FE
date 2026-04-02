import { FaHeadset, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Client/SideBar";

export default function Support() {
  return (
    <div className="min-h-screen bg-[#0A0E17] flex">
      <Sidebar active="support" />
      <main className="flex-1 bg-[#111827] px-16 py-12 overflow-y-auto max-h-screen hidden-scrollbar">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-1">Hỗ trợ</h1>
            <p className="text-dc-text-muted text-sm">
              Gửi yêu cầu trợ giúp và báo cáo lỗi
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[rgba(15,23,42,0.3)] rounded-2xl border border-dashed border-[rgba(100,116,139,0.2)]">
            <div className="w-20 h-20 rounded-full bg-[rgba(15,23,42,0.6)] border border-dc-input-border flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#00F2FF]/5 blur-xl"></div>
              <FaHeadset className="text-4xl text-[#334155]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Bạn cần hỗ trợ?
            </h3>
            <p className="text-dc-text-muted max-w-sm mb-8 leading-relaxed">
              Bạn đang gặp sự cố khi xem phim, hoặc có vấn đề về thanh toán? Hãy
              liên hệ với đội ngũ hỗ trợ để được giải đáp nhanh chóng nhất.
            </p>

            <Link
              to="/contact"
              className="btn-cinematic px-8 py-3.5 rounded-xl text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
            >
              <FaEnvelope className="text-lg" />
              Gửi yêu cầu ngay
            </Link>
          </div>
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
