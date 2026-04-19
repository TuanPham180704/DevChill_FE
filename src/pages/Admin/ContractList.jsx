/* eslint-disable react-hooks/exhaustive-deps */
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

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý hợp đồng
            </h1>
            <p className="text-sm text-gray-500">
              Theo dõi, chỉnh sửa và quản lý hợp đồng dễ dàng ✨
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg shadow text-center">
              <div className="text-xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-xs text-gray-500">Tổng hợp đồng</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow text-center">
              <div className="text-xl font-bold text-green-600">
                {stats.draft}
              </div>
              <div className="text-xs text-gray-500">Draft</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow text-center">
              <div className="text-xl font-bold text-blue-600">
                {stats.active}
              </div>
              <div className="text-xs text-gray-500">Active</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow text-center">
              <div className="text-xl font-bold text-red-600">
                {stats.expired + stats.cancelled}
              </div>
              <div className="text-xs text-gray-500">Expired</div>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg"
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
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg"
              >
                <FaRedo />
                Refresh
              </button>

              <button
                onClick={() => {
                  setSelectedContract(null);
                  setContractModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg"
              >
                <FaPlus />
                Thêm
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow flex-1 overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-100 text-gray-500 uppercase">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Tên</th>
                    <th className="p-3 text-center">Start</th>
                    <th className="p-3 text-center">End</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">File</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : currentContracts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No data
                      </td>
                    </tr>
                  ) : (
                    currentContracts.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{c.id}</td>
                        <td className="p-4 font-medium">{c.name}</td>
                        <td className="p-4 text-center">{c.start_date}</td>
                        <td className="p-4 text-center">{c.end_date}</td>
                        <td className="p-4 text-center">{c.status}</td>

                        <td className="p-4 text-center">
                          {c.file_url ? (
                            <button
                              onClick={() => handleDownload(c)}
                              className="text-blue-600 flex items-center gap-1 justify-center mx-auto"
                            >
                              <FaDownload />
                              File
                            </button>
                          ) : (
                            "No"
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setContractModalOpen(true);
                            }}
                            className="p-1 bg-blue-100 rounded text-blue-600"
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
          <div className="bg-white py-2 flex justify-center rounded-lg">
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
        isEditMode={!selectedContract}
      />
    </div>
  );
}
