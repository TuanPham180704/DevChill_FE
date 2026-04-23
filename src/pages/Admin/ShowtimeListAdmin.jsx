import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Radio,
  CalendarClock,
  CheckSquare,
  Clapperboard,
  PackageX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import ShowtimeModal from "../../components/Admin/Showtimes/ShowtimeModal";

import { getAllShowtimesAdmin } from "../../api/showtimeAdminApi";

export default function ShowtimeListAdmin() {
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    live: 0,
    ended: 0,
  });

  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchShowtimes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllShowtimesAdmin({});
      const data = res?.data || res || [];
      setAllShowtimes(data);

      setStats({
        total: data.length,
        scheduled: data.filter((s) => s.status === "scheduled").length,
        live: data.filter((s) => s.status === "live").length,
        ended: data.filter((s) => s.status === "ended").length,
      });
    } catch (err) {
      toast.error(err?.message || "Lỗi tải danh sách công chiếu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  useEffect(() => {
    let result = [...allShowtimes];
    if (debouncedKeyword) {
      const lowerKw = debouncedKeyword.toLowerCase();
      result = result.filter(
        (s) =>
          (s.movie_name &&
            String(s.movie_name).toLowerCase().includes(lowerKw)) ||
          (s.episode_name &&
            String(s.episode_name).toLowerCase().includes(lowerKw)),
      );
    }
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }
    setFilteredShowtimes(result);
    setTotal(result.length);

    const startIndex = (page - 1) * limit;
    const slicedData = result.slice(startIndex, startIndex + limit);
    setShowtimes(slicedData);
  }, [allShowtimes, debouncedKeyword, statusFilter, page]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (id) => {
    setModalMode("edit");
    setSelectedId(id);
    setModalOpen(true);
  };

  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "live":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-200 animate-pulse`;
      case "scheduled":
        return `${baseStyle} bg-amber-50 text-amber-600 border-amber-200`;
      case "ended":
        return `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`;
      case "cancelled":
        return `${baseStyle} bg-red-50 text-red-600 border-red-100`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const csvData = filteredShowtimes.map((s) => ({
    ID: s.id,
    Phim: s.movie_name,
    Tap: s.episode_name,
    Bat_Dau: new Date(s.start_time).toLocaleString("vi-VN"),
    Ket_Thuc: new Date(s.end_time).toLocaleString("vi-VN"),
    Trang_thai: s.status,
  }));

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-6 space-y-5 flex-1 max-w-325 mx-auto w-full">
          <div className="flex justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Quản lý Công Chiếu
              </h1>
              <p className="text-[14px] text-slate-500 font-medium">
                Sắp xếp lịch Premiere, đồng bộ thời gian xem cho toàn hệ thống
                🎬
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Clapperboard size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng cộng
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50/70 flex items-center justify-center text-amber-500">
                <CalendarClock size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Sắp chiếu
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.scheduled}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-rose-50">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Radio size={20} strokeWidth={2.5} className="animate-pulse" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang chiếu (LIVE)
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.live}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <CheckSquare size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đã kết thúc
                </div>
                <div className="text-xl font-black text-slate-800">
                  {stats.ended}
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
                  placeholder="Tìm tên phim, tập phim..."
                  className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all appearance-none"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="scheduled">Sắp chiếu</option>
                <option value="live">Đang chiếu</option>
                <option value="ended">Đã kết thúc</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <ExportCSV
                data={csvData}
                fields={[
                  "ID",
                  "Phim",
                  "Tap",
                  "Bat_Dau",
                  "Ket_Thuc",
                  "Trang_thai",
                ]}
                fileName="DanhSachCongChieu"
              />
              <button
                onClick={fetchShowtimes}
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
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-[13px] font-bold rounded-xl hover:bg-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              >
                <Plus size={16} strokeWidth={2.5} />
                Tạo suất chiếu
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] overflow-hidden p-1.5">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    ID
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Phim
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Tập
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Thời gian bắt đầu
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Thời gian kết thúc
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400 font-medium text-[13px]"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : showtimes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <PackageX size={24} className="text-slate-200" />
                        <span className="text-[13px] font-medium">
                          Không tìm thấy suất chiếu nào.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  showtimes.map((s) => (
                    <tr
                      key={s.id}
                      className="group hover:bg-[#F8FAFC] transition-colors duration-200 rounded-xl"
                    >
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-400 text-[12px] rounded-l-xl">
                        #{s.id}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-700 text-[13.5px]">
                        {s.movie_name}
                        {s.is_premiere && (
                          <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">
                            Premiere
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-500 text-center text-[13px]">
                        {s.episode_name || `Tập ${s.episode_number}`}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-600 text-[13px]">
                        {formatDate(s.start_time)}
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium text-slate-400 text-[12.5px]">
                        {formatDate(s.end_time)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={getStatusBadge(s.status)}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right rounded-r-xl">
                        <button
                          onClick={() => handleOpenEdit(s.id)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Chi tiết & Chỉnh sửa"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
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

      <ShowtimeModal
        isOpen={isModalOpen}
        showtimeId={selectedId}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onReload={fetchShowtimes}
      />
    </div>
  );
}
