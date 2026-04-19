import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaEdit } from "react-icons/fa";

export default function CustomerModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...user,
        password: "",
        premium_plan: user.premium_plan || 1,
      });
    }
    setIsEditing(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const data = { ...formData };
    if (!data.password) delete data.password;
    onSave && onSave(data);
  };

  const formatDate = (d) => {
    if (!d) return "Không có";
    const date = new Date(d);
    if (isNaN(date)) return "Không hợp lệ";
    return date.toLocaleString("vi-VN");
  };

  const inputStyle =
    "w-full h-9 px-3 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-400";
  const disabledStyle = "bg-gray-100 cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-lg flex flex-col">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="text-base font-semibold">Quản lý người dùng</h3>

          <div className="flex gap-3">
            <FaEdit
              onClick={() => setIsEditing(!isEditing)}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
            />
            <FaTimes
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-red-500 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 p-5">
          <div className="flex flex-col items-center justify-between text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                    {formData.username?.slice(0, 2).toUpperCase() || <FaUser />}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{formData.username}</p>
                <p className="text-xs text-gray-400">ID: {formData.id}</p>
              </div>
            </div>
            <div className="w-full text-xs text-gray-500 bg-gray-50 rounded-md p-3 space-y-1 mt-4">
              <p>
                <span className="font-medium text-gray-600">Tạo:</span>{" "}
                {formatDate(formData.created_at)}
              </p>
              <p>
                <span className="font-medium text-gray-600">Cập nhật:</span>{" "}
                {formatDate(formData.updated_at)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Email</label>
              <input
                value={formData.email || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`${inputStyle} ${!isEditing ? disabledStyle : ""}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={formData.password || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Để trống nếu không đổi"
                className={`${inputStyle} ${!isEditing ? disabledStyle : ""}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Role</label>
              <select
                value={formData.role}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className={`${inputStyle} ${!isEditing ? disabledStyle : ""}`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 border rounded-md flex justify-between items-center">
              <span className="text-xs text-gray-600">Trạng thái</span>
              <span
                className={`text-xs font-medium ${
                  formData.is_active ? "text-green-600" : "text-gray-400"
                }`}
              >
                {formData.is_active ? "Hoạt động" : "Chưa kích hoạt"}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Premium
              </label>
              <select
                disabled={!isEditing}
                value={formData.premium_plan || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_premium: true,
                    premium_plan: Number(e.target.value),
                  })
                }
                className={`${inputStyle} ${!isEditing ? disabledStyle : ""}`}
              >
                <option value={1}>1 tháng</option>
                <option value={2}>2 tháng</option>
                <option value={3}>3 tháng</option>
              </select>
            </div>
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Khóa</span>
                <span
                  className={`text-xs font-medium ${
                    formData.is_locked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formData.is_locked ? "Đã khóa" : "Bình thường"}
                </span>
              </div>
              {formData.is_locked && (
                <div className="text-xs text-red-400 mt-1 space-y-1">
                  <p>{formData.block_reason}</p>
                  <p>{formatDate(formData.lock_until)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 h-9 text-sm border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            disabled={!isEditing}
            className={`px-4 h-9 text-sm rounded-md ${
              isEditing
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
