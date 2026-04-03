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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <h3 className="text-lg font-semibold">Quản lý người dùng</h3>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg hover:bg-white/20"
            >
              <FaEdit />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* LEFT */}
          <div className="flex flex-col items-center justify-between h-full text-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                    {formData.username?.slice(0, 2).toUpperCase() || <FaUser />}
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{formData.username}</p>
                <p className="text-xs text-gray-400">ID: {formData.id}</p>
              </div>
            </div>

            <div className="w-full text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
              <p>
                <span className="font-medium">Tạo:</span>{" "}
                {formatDate(formData.created_at)}
              </p>
              <p>
                <span className="font-medium">Cập nhật:</span>{" "}
                {formatDate(formData.updated_at)}
              </p>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="grid grid-rows-3 gap-4 h-full">
            <div className="flex flex-col justify-center">
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={formData.email || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  isEditing ? "border-indigo-400" : "bg-gray-100"
                }`}
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={formData.password || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Để trống nếu không đổi"
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  isEditing ? "border-indigo-400" : "bg-gray-100"
                }`}
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="text-sm text-gray-600">Role</label>
              <select
                value={formData.role}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-rows-3 gap-4 h-full">
            {/* ACTIVE */}
            <div className="p-3 rounded-lg border flex justify-between items-center">
              <span className="text-sm text-gray-600">Trạng thái</span>
              <span
                className={`text-sm font-medium ${
                  formData.is_active ? "text-green-600" : "text-gray-400"
                }`}
              >
                {formData.is_active ? "Hoạt động" : "Chưa kích hoạt"}
              </span>
            </div>

            {/* PREMIUM */}
            <div className="p-3 rounded-lg border flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-1">Premium</p>
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
                className="w-full px-3 py-2 rounded-lg border"
              >
                <option value={1}>1 tháng</option>
                <option value={2}>2 tháng</option>
                <option value={3}>3 tháng</option>
              </select>
            </div>

            {/* LOCK */}
            <div className="p-3 rounded-lg border flex flex-col justify-center">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Khóa</span>
                <span
                  className={`text-sm font-medium ${
                    formData.is_locked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formData.is_locked ? "Đã khóa" : "Bình thường"}
                </span>
              </div>

              {formData.is_locked && (
                <div className="text-xs text-red-400 mt-1">
                  <p>{formData.block_reason}</p>
                  <p>{formatDate(formData.lock_until)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            disabled={!isEditing}
            className={`px-5 py-2 rounded-lg ${
              isEditing
                ? "bg-indigo-600 text-white"
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
