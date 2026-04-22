import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  History,
  Crown,
  XCircle,
  Loader2,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function MySubscription() {
  const { subData, loading } = useOutletContext();
  const [activeTab, setActiveTab] = useState("active");

  const now = new Date();
  const allPlans = subData?.all_details || [];

  const activePlans = allPlans.filter(
    (plan) => new Date(plan.end_date) >= now || plan.status === "active",
  );

  const expiredPlans = allPlans.filter(
    (plan) => new Date(plan.end_date) < now && plan.status !== "active",
  );

  return (
    <main className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-10 flex flex-col h-full">
      <h3 className="text-lg font-extrabold text-slate-900 mb-6 shrink-0">
        Chi tiết các gói
      </h3>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            Đang tải dữ liệu gói...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* TAB CONTROL */}
          <div className="flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-2xl w-fit mb-6 shrink-0">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "active"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <CheckCircle2 size={16} /> Đang chạy ({activePlans.length})
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "expired"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <History size={16} /> Đã kết thúc ({expiredPlans.length})
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {(activeTab === "active" ? activePlans : expiredPlans).length ===
            0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-100/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200/50 shadow-sm">
                  <History size={24} className="text-slate-400" />
                </div>
                <h4 className="text-slate-700 font-bold mb-1">
                  Chưa có giao dịch nào
                </h4>
                <p className="text-slate-500 text-sm font-medium">
                  Dữ liệu của mục này hiện đang trống.
                </p>
              </div>
            ) : (
              (activeTab === "active" ? activePlans : expiredPlans).map(
                (plan, index) => (
                  <div
                    key={`${plan.id}-${index}`}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 gap-4 shrink-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          activeTab === "active"
                            ? "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {activeTab === "active" ? (
                          <Crown size={22} />
                        ) : (
                          <XCircle size={22} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              activeTab === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {activeTab === "active"
                              ? "Đang kích hoạt"
                              : "Đã hết hạn"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-6 md:gap-1 text-sm md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
                      <div className="flex items-center md:justify-end gap-1.5 text-slate-500 font-medium">
                        <CalendarDays size={14} className="text-slate-400" />
                        <span className="text-[11px] uppercase tracking-wider font-bold">
                          Bắt đầu:
                        </span>
                        <span className="text-slate-800">
                          {formatDate(plan.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5 text-slate-500 font-medium">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-[11px] uppercase tracking-wider font-bold">
                          Kết thúc:
                        </span>
                        <span className="text-slate-800">
                          {formatDate(plan.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
}
