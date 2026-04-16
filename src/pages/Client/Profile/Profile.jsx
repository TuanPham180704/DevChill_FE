import { useState, useRef, useEffect } from "react";
import Sidebar from "../../../components/Client/SideBar";
import Changepassword from "../../../components/Client/Users/Changepassword";
import { toast } from "react-toastify";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../../api/userApi";
import { removeToken } from "../../../utils/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    gender: "unknown",
    birth_date: "",
    avatar_url: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setUser(data);
        setFormData({
          username: data.username || "",
          gender: data.gender || "unknown",
          birth_date: data.birth_date || "",
          avatar_url: data.avatar_url || "",
        });

        setAvatarPreview(data.avatar_url || null);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Không thể tải thông tin tài khoản!",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriggerClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateProfile({
        username: formData.username,
        gender: formData.gender,
        avatar_url: formData.avatar_url,
        birth_date: formData.birth_date,
      });

      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar_url);

      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleChangePassword = async (data) => {
    return await changePassword(data);
  };

  const handleLogout = () => {
    removeToken();
    toast.info("Đã đăng xuất!");
    window.location.href = "/login";
  };

  const menuSkeleton = (
    <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* SIDEBAR */}
      <Sidebar
        active="profile"
        customAvatar={avatarPreview || user?.avatar_url}
        user={user}
        onLogout={handleLogout}
      />

      {/* MAIN */}
      <main className="flex-1 bg-white px-16 py-12">
        <h1 className="text-3xl font-bold mb-1">Tài khoản</h1>
        <p className="text-gray-500 text-sm mb-8">
          Cập nhật thông tin tài khoản của bạn
        </p>

        <div className="flex gap-10">
          {/* LEFT FORM */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <>
                {menuSkeleton}
                {menuSkeleton}
                {menuSkeleton}
                {menuSkeleton}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* IS PREMIUM - READ ONLY FIELD */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trạng thái tài khoản
                  </label>
                  <input
                    type="text"
                    value={user?.is_premium ? "Premium" : "Free"}
                    readOnly
                    className={`w-full px-4 py-3 rounded-xl border cursor-not-allowed ${
                      user?.is_premium
                        ? "bg-yellow-50 border-yellow-300 text-yellow-700 font-semibold"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 outline-none"
                    style={{ colorScheme: "light" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Giới tính
                  </label>

                  <div className="flex gap-6">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={handleChange}
                        />
                        <span>
                          {g === "male"
                            ? "Nam"
                            : g === "female"
                              ? "Nữ"
                              : "Không xác định"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Cập nhật
                </button>

                <p className="text-sm text-gray-500">
                  Đổi mật khẩu, nhấn vào{" "}
                  <span
                    onClick={() => setShowPasswordModal(true)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    đây
                  </span>
                </p>
              </>
            )}
          </div>

          {/* RIGHT AVATAR */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={handleTriggerClick}
              className="w-32 h-32 rounded-full ring-2 ring-blue-500 overflow-hidden cursor-pointer bg-gray-100"
            >
              <img
                src={avatarPreview || user?.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={handleTriggerClick}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition"
            >
              Chọn ảnh
            </button>
          </div>
        </div>
      </main>

      <Changepassword
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
