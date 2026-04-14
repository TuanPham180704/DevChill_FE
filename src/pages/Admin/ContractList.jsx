/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaRedo, FaEye, FaPlus, FaDownload } from "react-icons/fa";
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
  const itemsPerPage = 6;

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await getContracts({ page: 1, limit: 5, search: "" });
      const contractList =
        res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
      setContracts(contractList);
    } catch (err) {
      toast.error("Lỗi tải danh sách hợp đồng");
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

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

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-8 flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý hợp đồng
            </h1>
            <p className="text-sm text-gray-500">
              Theo dõi, chỉnh sửa và quản lý hợp đồng dễ dàng ✨
            </p>
          </div>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contracts.length}
              </div>
              <div className="text-gray-500 text-sm">Tổng hợp đồng</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {contracts.filter((c) => c.status === "draft").length}
              </div>
              <div className="text-gray-500 text-sm">Draft</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contracts.filter((c) => c.status === "active").length}
              </div>
              <div className="text-gray-500 text-sm">Active</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  contracts.filter(
                    (c) => c.status === "expired" || c.status === "cancelled",
                  ).length
                }
              </div>
              <div className="text-gray-500 text-sm">Expired/Cancelled</div>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative w-72">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Tất cả</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
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
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaRedo />
                Refresh
              </button>

              <button
                onClick={() => {
                  setSelectedContract(null);
                  setContractModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <FaPlus />
                Thêm hợp đồng
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Tên</th>
                    <th className="p-4 text-center">Ngày bắt đầu</th>
                    <th className="p-4 text-center">Ngày kết thúc</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 text-center">File</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6">
                        Đang tải...
                      </td>
                    </tr>
                  ) : currentContracts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-400"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    currentContracts.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{c.id}</td>
                        <td className="p-4 font-medium">{c.name}</td>
                        <td className="p-4 text-center">
                          {c.start_date || "-"}
                        </td>
                        <td className="p-4 text-center">{c.end_date || "-"}</td>
                        <td className="p-4 text-center">{c.status}</td>
                        <td className="p-4 text-center">
                          {c.file_url ? (
                            <button
                              onClick={() => handleDownload(c)}
                              className="text-blue-600 hover:underline flex items-center gap-1 justify-center mx-auto"
                            >
                              <FaDownload />
                              File
                            </button>
                          ) : (
                            "Không"
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setContractModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border-t py-3 flex justify-center shadow-inner mt-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredContracts.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
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
      />
    </div>
  );
}
