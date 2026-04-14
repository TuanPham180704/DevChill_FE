import { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaRedo,
  FaEye,
  FaLock,
  FaUnlock,
  FaHistory,
} from "react-icons/fa";
import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import CustomerModal from "../../components/Admin/Users/CustomerModal";
import LockModal from "../../components/Admin/Users/LockModal";
import AuditLogModal from "../../components/Admin/Users/AuditLogModal";
import {
  getUsers,
  updateUser,
  lockUser,
  unlockUser,
} from "../../api/adUserApi";
import { toast } from "react-toastify";
export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [auditLogs] = useState([]);
  const [loadingLock, setLoadingLock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isLockModalOpen, setLockModalOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers({
        page: 1,
        limit: 100,
        search: "",
      });

      const userList =
        res?.data?.data || res?.data || (Array.isArray(res) ? res : []);

      setUsers(userList);
    } catch {
      toast.error("Lỗi tải dữ liệu");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return users.filter((u) => {
      const matchSearch =
        u.username?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword);

      let matchStatus = true;

      if (statusFilter === "active") matchStatus = u.is_active;
      if (statusFilter === "inactive") matchStatus = !u.is_active;
      if (statusFilter === "locked") matchStatus = u.is_locked;

      return matchSearch && matchStatus;
    });
  }, [users, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const itemsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);
  const handleSaveCustomer = async (data) => {
    try {
      await updateUser(selectedUser.id, {
        email: data.email,
        password: data.password || undefined,
        is_premium: data.is_premium,
        role: data.role,
      });

      toast.success("Cập nhật thành công");
      await fetchUsers();
      setCustomerModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };
  const handleLockConfirm = async (userId, data) => {
    try {
      setLoadingLock(true);
      if (!data) {
        await unlockUser(userId);
        toast.success("Đã mở khóa");
      } else {
        await lockUser(userId, data);
        toast.success("Đã khóa tài khoản");
      }
      await fetchUsers();
      setLockModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setLoadingLock(false);
    }
  };
  const badge = (style) =>
    `px-3 py-1 text-xs font-semibold rounded-full ${style}`;

  const getGenderText = (gender) => {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    if (gender === "other") return "Khác";
    return "Không rõ";
  };
  const csvData = filteredUsers.map((u) => ({
    ID: u.id,
    Tên: u.username,
    Email: u.email,
    Giới_tính: getGenderText(u.gender),
    Gói: u.is_premium ? "Premium" : "Free",
    Trạng_thái: u.is_active ? "Active" : "Inactive",
    Khóa: u.is_locked ? "Locked" : "Normal",
  }));
  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-8 space-y-6 flex-1">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý khách hàng
            </h1>
            <p className="text-sm text-gray-500">
              Theo dõi, chỉnh sửa và quản lý tài khoản người dùng một cách dễ
              dàng ✨
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.length}
              </div>
              <div className="text-gray-500 text-sm">Tổng users</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => u.is_premium).length}
              </div>
              <div className="text-gray-500 text-sm">Premium</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-red-600">
                {users.filter((u) => !u.is_active).length}
              </div>
              <div className="text-gray-500 text-sm">Chưa kích hoạt</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.is_locked).length}
              </div>
              <div className="text-gray-500 text-sm">Bị khóa</div>
            </div>
          </div>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ExportCSV
                data={csvData}
                fields={[
                  "ID",
                  "Tên",
                  "Email",
                  "Giới_tính",
                  "Gói",
                  "Trạng_thái",
                  "Khóa",
                ]}
                fileName="DanhSachKhachHang"
              />

              <button
                onClick={() => setIsAuditLogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaHistory />
                Lịch sử
              </button>

              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaRedo />
                Refresh
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Tên</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4">Giới tính</th>
                  <th className="p-4">Gói</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Khóa</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6">
                      Đang tải...
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4 font-medium">{user.username}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>

                      <td className="p-4 text-center">
                        {getGenderText(user.gender)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={badge(
                            user.is_premium
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {user.is_premium ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={badge(
                            user.is_active
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={badge(
                            user.is_locked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600",
                          )}
                        >
                          {user.is_locked ? "Locked" : "Normal"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setCustomerModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setLockModalOpen(true);
                            }}
                            className={`p-2 rounded-lg ${
                              user.is_locked
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {user.is_locked ? <FaUnlock /> : <FaLock />}
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
        <div className="sticky bottom-0 bg-white border-t py-3 flex justify-center shadow-inner">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveCustomer}
      />

      <LockModal
        isOpen={isLockModalOpen}
        onClose={() => {
          setLockModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleLockConfirm}
        loading={loadingLock}
      />

      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
