import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  History,
  Users,
  Star,
  ShieldAlert,
  UserX,
} from "lucide-react";
import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import CustomerModal from "../../components/Admin/Users/CustomerModal";
import LockModal from "../../components/Admin/Users/LockModal";
import {
  getUsers,
  updateUser,
  lockUser,
  unlockUser,
} from "../../api/adUserApi";
import { toast } from "react-toastify";

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [loadingLock, setLoadingLock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isLockModalOpen, setLockModalOpen] = useState(false);
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

  const itemsPerPage = 5;

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

  // Thu nhỏ badge một chút (giảm padding & font-size)
  const badge = (style) =>
    `inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${style}`;

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
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex-1 ml-64 flex flex-col">
        {/* Thu hẹp max-width và giảm padding của container */}
        <div className="p-6 space-y-5 flex-1 max-w-325 mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý khách hàng
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Theo dõi và quản lý tài khoản người dùng một cách dễ dàng ✨
            </p>
          </div>

          {/* Stat Cards - Thu nhỏ padding, icon và font size */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Users size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng users
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50/70 flex items-center justify-center text-amber-500">
                <Star size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Premium
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => u.is_premium).length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <UserX size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Chưa kích hoạt
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => !u.is_active).length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <ShieldAlert size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Bị khóa
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => u.is_locked).length}
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar - Thu nhỏ ô input và nút bấm */}
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
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 text-[13px] bg-slate-50/50 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all appearance-none min-w-35"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Chưa kích hoạt</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pr-1">
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
                onClick={fetchUsers}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white bg-slate-800 hover:bg-slate-700 shadow-sm shadow-slate-200 rounded-xl transition-all"
              >
                <RefreshCw size={15} />
                Làm mới
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
                    Khách hàng
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Giới tính
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Gói
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Tình trạng
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">
                    Hành động
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
                          Đang tải dữ liệu nhẹ nhàng...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
                          <Users size={24} className="text-slate-300" />
                        </div>
                        <span className="text-[13px] font-medium">
                          Chưa có khách hàng nào ở đây.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-[#F8FAFC] transition-colors duration-200 rounded-xl"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-400 text-[13px] rounded-l-xl">
                        #{user.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-[13.5px]">
                            {user.username}
                          </span>
                          <span className="text-[12px] text-slate-400 font-medium mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-500 text-[13px]">
                        {getGenderText(user.gender)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={badge(
                            user.is_premium
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-50 text-slate-500",
                          )}
                        >
                          {user.is_premium ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={badge(
                            user.is_active
                              ? "bg-blue-50 text-blue-500"
                              : "bg-slate-50 text-slate-500",
                          )}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={badge(
                            user.is_locked
                              ? "bg-rose-50 text-rose-500"
                              : "bg-emerald-50 text-emerald-500",
                          )}
                        >
                          {user.is_locked ? "Locked" : "Normal"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 rounded-r-xl">
                        {/* Thu nhỏ các icon thao tác */}
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setCustomerModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setLockModalOpen(true);
                            }}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              user.is_locked
                                ? "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                            }`}
                            title={
                              user.is_locked ? "Mở khóa" : "Khóa tài khoản"
                            }
                          >
                            {user.is_locked ? (
                              <Unlock size={16} strokeWidth={2.5} />
                            ) : (
                              <Lock size={16} strokeWidth={2.5} />
                            )}
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

        {/* Phân trang */}
        <div className="sticky bottom-0 bg-white/70 backdrop-blur-xl border-t border-slate-100 py-3 flex justify-center z-10">
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
    </div>
  );
}
