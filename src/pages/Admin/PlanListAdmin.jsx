
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Crown,
  CheckCircle,
  AlertCircle,
  PackageX,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import PlanModal from "../../components/Admin/Plans/PlanModal";
import ConfirmToggleModal from "../../components/Admin/Plans/ConfirmToggleModal";

import { getAllPlansAdmin, togglePlanStatus } from "../../api/planAdminApi";

export default function PlanListAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    popular: 0,
  });

  const [total, setTotal] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("edit");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [planToToggle, setPlanToToggle] = useState(null);
  const [toggling, setToggling] = useState(false);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPlansAdmin({
        page,
        limit,
        keyword: debouncedKeyword,
        status,
      });

      const data = res?.data || [];
      setPlans(data);
      setTotal(res?.total || 0);

      setStats({
        total: res?.total || data.length,
        active: data.filter((p) => p.status === "active").length,
        inactive: data.filter((p) => p.status === "inactive").length,
        popular: data.filter((p) => p.is_popular).length,
      });
    } catch (err) {
      toast.error(err?.message || "Lỗi tải danh sách gói dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword, status]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const csvData = plans.map((p) => ({
    ID: p.id,
    Ten: p.name,
    Gia: p.price,
    ThoiHan: p.duration_days,
    PhoBien: p.is_popular ? "Có" : "Không",
    Trang_thai: p.status,
  }));

  const handleOpenCreate = () => {
    setSelectedPlanId(null);
    setMode("create");
    setModalOpen(true);
  };

  const handleOpenDetail = (plan) => {
    setSelectedPlanId(plan.id);
    setMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlanId(null);
  };
  const handleToggleClick = (plan) => {
    setPlanToToggle(plan);
    setIsConfirmOpen(true);
  };
  const confirmToggleStatus = async () => {
    if (!planToToggle) return;
    try {
      setToggling(true);
      await togglePlanStatus(planToToggle.id);
      toast.success(
        `Đã ${planToToggle.status === "active" ? "khóa" : "kích hoạt"} gói thành công`,
      );
      setIsConfirmOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err?.message || "Lỗi khi thay đổi trạng thái");
    } finally {
      setToggling(false);
    }
  };
  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "active":
        return `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`;
      case "inactive":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-100`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-6 space-y-5 flex-1 max-w-325 mx-auto w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý gói dịch vụ
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Thiết lập giá, thời hạn và tính năng cho các gói Premium 💎
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Crown size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng số gói
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <CheckCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang bán
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.active}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Ngừng bán
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.inactive}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Crown size={20} fill="currentColor" strokeWidth={1} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Phổ biến
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.popular}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 flex-wrap pl-1">
              <div className="relative w-64">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm gói..."
                  className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all min-w-35 appearance-none"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang bán (Active)</option>
                <option value="inactive">Ngừng bán (Inactive)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <ExportCSV
                data={csvData}
                fields={[
                  "ID",
                  "Ten",
                  "Gia",
                  "ThoiHan",
                  "PhoBien",
                  "Trang_thai",
                ]}
                fileName="DanhSachGoiVIP"
              />
              <button
                onClick={fetchPlans}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Làm mới
              </button>
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-200 rounded-xl transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                Thêm mới
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] overflow-hidden p-1.5">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    ID
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Tên gói
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Giá (VNĐ)
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Thời hạn
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Tùy chọn
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <RefreshCw
                          className="animate-spin text-blue-400"
                          size={24}
                        />
                        <span className="text-[13px] font-medium">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <PackageX size={24} className="text-slate-200" />
                        <span className="text-[13px] font-medium">
                          Chưa có gói dịch vụ nào.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plans.map((p) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-[#F8FAFC] transition-colors duration-200 rounded-xl"
                    >
                      <td className="px-5 py-3.5 text-center font-semibold text-slate-400 text-[12px] rounded-l-xl">
                        #{p.id}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-700 text-[13.5px] truncate max-w-50">
                        {p.name}
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-blue-600 text-[13px]">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-5 py-3.5 text-center font-medium text-slate-500 text-[13px]">
                        {p.duration_days} ngày
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {p.is_popular && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 text-[10px] font-black uppercase">
                            <Crown size={12} fill="currentColor" /> Hot
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={getStatusBadge(p.status)}>
                          {p.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right rounded-r-xl">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleClick(p)}
                            className={`p-2 rounded-lg transition-all ${
                              p.status === "active"
                                ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                            }`}
                            title={
                              p.status === "active" ? "Khóa gói" : "Kích hoạt"
                            }
                          >
                            {p.status === "active" ? (
                              <ToggleRight size={16} strokeWidth={2.5} />
                            ) : (
                              <ToggleLeft size={16} strokeWidth={2.5} />
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenDetail(p)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Chi tiết"
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/70 backdrop-blur-xl border-t border-slate-100 py-3 flex justify-center z-10">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / limit) || 1}
            onPageChange={setPage}
            totalItems={total}
            itemsPerPage={limit}
          />
        </div>
      </div>
      <ConfirmToggleModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmToggleStatus}
        isLoading={toggling}
        title="Xác nhận thay đổi?"
        type={planToToggle?.status === "active" ? "danger" : "success"}
        confirmText="Xác nhận ngay"
        content={
          <p>
            Bạn có chắc chắn muốn{" "}
            {planToToggle?.status === "active"
              ? "ngừng kinh doanh"
              : "kích hoạt lại"}{" "}
            gói
            <span className="font-bold text-slate-700">
              {" "}
              {planToToggle?.name}
            </span>{" "}
            không?
          </p>
        }
      />
      <PlanModal
        isOpen={isModalOpen}
        planId={selectedPlanId}
        mode={mode}
        onClose={handleCloseModal}
        onReload={fetchPlans}
      />
    </div>
  );
}
