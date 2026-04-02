import { useState, useRef } from "react";
import { FaSearch, FaRedo, FaPlus, FaEdit, FaLock, FaUnlock, FaEye, FaFilter, FaChevronDown, FaChevronUp, FaCheck, FaHistory } from "react-icons/fa";
import Sidebar from "../../components/Admin/Sidebar";
import Pagination from "../../components/Admin/Pagination";
import CustomerModal from "../../components/Admin/Users/CustomerModal";
import LockModal from "../../components/Admin/Users/LockModal";
import AuditLogModal from "../../components/Admin/Users/AuditLogModal";


export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);

  const [isLockModalOpen, setLockModalOpen] = useState(false);
  const [lockFilter, setLockFilter] = useState("all");
  const [activationFilter, setActivationFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const filterRef = useRef(null);

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLock =
        lockFilter === "all" ||
        (lockFilter === "active" && !user.is_locked) ||
        (lockFilter === "locked" && user.is_locked);

    const matchesActivation =
        activationFilter === "all" ||
        (activationFilter === "active" && user.is_active) ||
        (activationFilter === "inactive" && !user.is_active);

    return matchesSearch && matchesLock && matchesActivation;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveCustomer = (updatedData) => {
    console.log("Saving customer:", updatedData);
    // TODO: Connect to API
    setCustomerModalOpen(false);
  };

  const handleLockConfirm = (user, reasonData) => {
    console.log("Lock/Unlock confirm:", user.id, reasonData);
    // TODO: Connect to API
    setLockModalOpen(false);
  };

  const getGenderText = (gender) => {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    if (gender === "other") return "Khác";
    return "Không rõ";
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-gray-800 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Khách Hàng
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Quản lý thông tin và hoạt động của khách hàng trong hệ thống
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer">
                <FaRedo size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="relative w-full sm:w-[400px]">
              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto relative">
              <button 
                onClick={() => setIsAuditLogOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all border border-gray-100 text-sm font-medium cursor-pointer"
              >
                <FaHistory size={12} />
                <span>Lịch sử</span>
              </button>

              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border ${
                    isFilterOpen || lockFilter !== "all" || activationFilter !== "all"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm shadow-indigo-500/5"
                      : "bg-gray-100 border-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FaFilter size={12} className={isFilterOpen ? "animate-pulse" : ""} />
                    <span>Bộ lọc {(lockFilter !== "all" || activationFilter !== "all") && "(+)"}</span>
                  </div>
                  {isFilterOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </button>

                {isFilterOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Lọc theo trạng thái</p>
                      <div className="space-y-1">
                        {[
                          { value: "all", label: "Tất cả trạng thái" },
                          { value: "active", label: "Đã kích hoạt" },
                          { value: "inactive", label: "Chưa kích hoạt" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setActivationFilter(opt.value);
                              setCurrentPage(1);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              activationFilter === opt.value
                                ? "bg-indigo-50 text-indigo-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                            {activationFilter === opt.value && <FaCheck size={10} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-[1px] bg-gray-50 mx-2 my-1" />

                    <div className="p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Lọc theo khóa</p>
                      <div className="space-y-1">
                        {[
                          { value: "all", label: "Tất cả khóa" },
                          { value: "active", label: "Hiển thị bình thường" },
                          { value: "locked", label: "Đang khóa" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setLockFilter(opt.value);
                              setCurrentPage(1);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              lockFilter === opt.value
                                ? "bg-indigo-50 text-indigo-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                            {lockFilter === opt.value && <FaCheck size={10} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(lockFilter !== "all" || activationFilter !== "all") && (
                      <div className="p-2 pt-0">
                        <button
                          onClick={() => {
                            setLockFilter("all");
                            setActivationFilter("all");
                            setIsFilterOpen(false);
                          }}
                          className="w-full py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          Xóa tất cả bộ lọc
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLockFilter("all");
                  setActivationFilter("all");
                  setIsFilterOpen(false);
                  setCurrentPage(1);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                <FaRedo size={12} /> Làm mới
              </button>
            </div>
          </div>



          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[80px]">
                      ID
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[220px]">
                      Khách hàng
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-auto">
                      Email
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[100px]">
                      Giới tính
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[140px]">
                      Ngày đăng ký
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[150px]">
                      Trạng thái
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[150px]">
                      Khóa
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-[100px]">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors group h-[81px]"
                    >
                      <td className="py-4 px-6 text-indigo-500 font-medium text-sm text-center">
                        {user.id}
                      </td>
                      <td className="py-4 px-6 overflow-hidden">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="h-8 w-8 rounded-full object-cover shadow-sm shrink-0" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 font-sans">
                              {user.username
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 truncate">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm truncate max-w-0">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm text-center uppercase text-[11px] font-medium font-sans">
                        {getGenderText(user.gender)}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm text-center font-sans">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold w-[120px] whitespace-nowrap font-sans ${
                            user.is_active
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.is_active ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          ></div>
                          {user.is_active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold w-[120px] whitespace-nowrap font-sans ${
                            user.is_locked
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.is_locked ? "bg-red-500" : "bg-emerald-500"
                            }`}
                          ></div>
                          {user.is_locked ? "Đang khóa" : "Bình thường"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setCustomerModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors hover:bg-indigo-50 rounded cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <FaEye size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setLockModalOpen(true);
                            }}
                            className={`p-1.5 transition-colors rounded cursor-pointer ${
                              user.is_locked 
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.is_locked ? "Mở khóa (Đang khóa)" : "Khóa (Đang hoạt động)"}
                          >
                            {user.is_locked ? <FaLock size={16} /> : <FaUnlock size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to fill space */}
                  {currentUsers.length > 0 && Array.from({ length: itemsPerPage - currentUsers.length }).map((_, i) => (
                    <tr key={`empty-${i}`} className="h-[81px]">
                      <td colSpan="8" className="border-none"></td>
                    </tr>
                  ))}
                  {currentUsers.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-16 text-center">
                        <p className="text-gray-400 text-sm">
                          Không tìm thấy dữ liệu
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                itemName="khách hàng"
              />
            </div>
          </div>
        </div>
      </div>
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveCustomer}
      />

      <LockModal
        isOpen={isLockModalOpen}
        onClose={() => setLockModalOpen(false)}
        user={selectedUser ? { ...selectedUser, name: selectedUser.username, status: selectedUser.is_locked ? 'locked' : 'active' } : null}
        onConfirm={handleLockConfirm}
      />

      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
