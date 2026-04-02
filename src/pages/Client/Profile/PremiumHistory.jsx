import { FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Client/SideBar";

export default function PremiumHistory() {
  return (
    <div className="min-h-screen bg-[#0A0E17] flex">
      <Sidebar active="my-premium" />
      <main className="flex-1 bg-[#111827] px-16 py-12 overflow-y-auto max-h-screen hidden-scrollbar">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-1">Gói đã mua</h1>
            <p className="text-dc-text-muted text-sm">
              Quản lý các tư cách thành viên và lịch sử giao dịch của bạn
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[rgba(15,23,42,0.3)] rounded-2xl border border-dashed border-[rgba(100,116,139,0.2)]">
            <div className="w-20 h-20 rounded-full bg-[rgba(15,23,42,0.6)] border border-dc-input-border flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#00F2FF]/5 blur-xl"></div>
              <FaCrown className="text-4xl text-[#334155]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Chưa có gói Premium nào
            </h3>
            <p className="text-dc-text-muted max-w-sm mb-8 leading-relaxed">
              Bạn chưa đăng ký gói Premium nào. Hãy nâng cấp để trải nghiệm
              không giới hạn kho phim bom tấn với chất lượng 4K sắc nét!
            </p>

            <Link
              to="/upgrade"
              className="btn-cinematic px-8 py-3.5 rounded-xl text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
            >
              <FaCrown className="text-lg" />
              Khám phá gói Premium
            </Link>
          </div>
        </div>
      </main>
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
