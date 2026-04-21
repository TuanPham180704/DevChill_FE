/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Download,
  FileText,
  FileEdit,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import ContractModal from "../../components/Admin/Contracts/ContractModal";
import { toast } from "react-toastify";
import {
  getContracts,
  createContract,
  updateContract,
  downloadContractFile,
} from "../../api/contractApi";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    active: 0,
    expired: 0,
    cancelled: 0,
  });
  const itemsPerPage = 5;

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await getContracts({
        page: currentPage,
        limit: itemsPerPage,
        name: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
      });
      const contractList = res?.data?.data || res?.data || [];
      setContracts(contractList);
      setStats(
        res?.stats || {
          total: 0,
          draft: 0,
          active: 0,
          expired: 0,
          cancelled: 0,
        },
      );
    } catch (err) {
      toast.error("Lỗi tải danh sách hợp đồng");
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [currentPage, searchTerm, statusFilter]);

  const filteredContracts = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return contracts.filter((c) => {
      const matchSearch =
        c.name?.toLowerCase().includes(keyword) ||
        c.status?.toLowerCase().includes(keyword);

      let matchStatus = true;
      if (statusFilter !== "all") matchStatus = c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContracts.length / itemsPerPage),
  );

  const currentContracts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContracts.slice(start, start + itemsPerPage);
  }, [filteredContracts, currentPage]);

  const handleSaveContract = async (data) => {
    try {
      if (selectedContract?.id) {
        await updateContract(selectedContract.id, data);
        toast.success("Cập nhật hợp đồng thành công");
      } else {
        await createContract(data);
        toast.success("Tạo hợp đồng thành công");
      }
      await fetchContracts();
      setContractModalOpen(false);
      setSelectedContract(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDownload = async (contract) => {
    if (!contract?.id) return;
    try {
      const blob = await downloadContractFile(contract.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        contract.name?.replace(/\s/g, "_") + ".pdf",
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Tải file thất bại");
    }
  };

  const csvData = filteredContracts.map((c) => ({
    ID: c.id,
    Tên: c.name,
    "Ngày bắt đầu": c.start_date,
    "Ngày kết thúc": c.end_date,
    Trạng_thái: c.status,
    File: c.file_url ? "Có" : "Không",
  }));
  const getStatusBadge = (status) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseStyle} bg-emerald-50 text-emerald-600`;
      case "draft":
        return `${baseStyle} bg-slate-100 text-slate-500`;
      case "expired":
        return `${baseStyle} bg-amber-50 text-amber-600`;
      case "cancelled":
        return `${baseStyle} bg-rose-50 text-rose-600`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500`;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-6 space-y-5 flex-1 max-w-325 mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý hợp đồng
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Theo dõi, chỉnh sửa và quản lý hợp đồng dễ dàng ✨
            </p>
          </div>

          {/* Stat Cards - Cùng style 8/10 với trang Khách hàng */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <FileText size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng hợp đồng
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <FileEdit size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Nháp (Draft)
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.draft}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <CheckCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang hiệu lực
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
                  Hết hạn / Hủy
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.expired + stats.cancelled}
                </div>
              </div>
            </div>
          </div>

          {/* Bộ lọc và Công cụ */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 flex-wrap pl-1">
              <div className="relative w-64">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm hợp đồng..."
                  className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all appearance-none min-w-35"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Nháp (Draft)</option>
                <option value="active">Đang hiệu lực (Active)</option>
                <option value="expired">Hết hạn (Expired)</option>
                <option value="cancelled">Đã hủy (Cancelled)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <ExportCSV
                data={csvData}
                fields={[
                  "ID",
                  "Tên",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Trạng_thái",
                  "File",
                ]}
                fileName="DanhSachHopDong"
              />

              <button
                onClick={fetchContracts}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RefreshCw size={15} />
                Làm mới
              </button>

              <button
                onClick={() => {
                  setSelectedContract(null);
                  setContractModalOpen(true);
                }}
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
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    ID
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Tên Hợp Đồng
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Bắt đầu
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Kết thúc
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                    Tập tin
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
                ) : currentContracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
                          <FileText size={24} className="text-slate-300" />
                        </div>
                        <span className="text-[13px] font-medium">
                          Chưa có hợp đồng nào.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentContracts.map((c) => (
                    <tr
                      key={c.id}
                      className="group hover:bg-[#F8FAFC] transition-colors duration-200 rounded-xl"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-400 text-[13px] rounded-l-xl">
                        #{c.id}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-700 text-[13.5px]">
                        {c.name}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-500 text-[13px] text-center">
                        {c.start_date || "-"}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-500 text-[13px] text-center">
                        {c.end_date || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={getStatusBadge(c.status)}>
                          {c.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        {c.file_url ? (
                          <button
                            onClick={() => handleDownload(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mx-auto"
                          >
                            <Download size={14} strokeWidth={2.5} />
                            Tải về
                          </button>
                        ) : (
                          <span className="text-[13px] text-slate-300 italic">
                            Trống
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 rounded-r-xl">
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setContractModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
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

        {/* Thanh phân trang */}
        <div className="sticky bottom-0 bg-white/70 backdrop-blur-xl border-t border-slate-100 py-3 flex justify-center z-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredContracts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => {
          setContractModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
        onSave={handleSaveContract}
        isEditMode={!selectedContract}
      />
    </div>
  );
}
