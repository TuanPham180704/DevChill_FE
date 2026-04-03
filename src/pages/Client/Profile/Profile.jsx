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
  const [formData, setFormData] = useState({
    username: "",
    gender: "unknown",
    birth_date: "",
    avatar_url: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  // Load thông tin người dùng
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] flex">
      <Sidebar
        active="profile"
        customAvatar={avatarPreview || user.avatar_url}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 bg-[#111827] px-16 py-12">
        <h1 className="text-white text-3xl font-bold mb-1">Tài khoản</h1>
        <p className="text-dc-text-muted text-sm mb-8">
          Cập nhật thông tin tài khoản của bạn
        </p>

        <div className="flex gap-10">
          {/* Form */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-dc-text text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-dc-input-bg border border-dc-input-border text-dc-text-muted text-sm outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-dc-text text-sm font-medium mb-2">
                Tên hiển thị
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên hiển thị"
                className="w-full px-4 py-3 rounded-xl bg-dc-input-bg border border-dc-input-border text-white text-sm outline-none placeholder-[#4b5563] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
              />
            </div>

            <div>
              <label className="block text-dc-text text-sm font-medium mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-dc-input-bg border border-dc-input-border text-white text-sm outline-none focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
              />
            </div>

            <div>
              <label className="block text-dc-text text-sm font-medium mb-3">
                Giới tính
              </label>
              <div className="flex items-center gap-6">
                {["male", "female", "other"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-[#64748b] peer-checked:border-[#00F2FF] peer-checked:shadow-[0_0_12px_rgba(0,242,255,0.4)] flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FF] opacity-0 peer-checked:opacity-100 transition-all"></div>
                    </div>
                    <span className="text-dc-text-muted peer-checked:text-[#00F2FF] peer-checked:font-bold text-sm transition-all group-hover:text-white">
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
              className="px-8 py-3 rounded-xl bg-[#00F2FF] text-[#0A0E17] font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(0,242,255,0.45)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Cập nhật
            </button>

            <p className="mt-5 text-dc-text-muted text-sm">
              Đổi mật khẩu, nhấn vào{" "}
              <span
                onClick={() => setShowPasswordModal(true)}
                className="text-[#00F2FF] underline cursor-pointer hover:text-white"
              >
                đây
              </span>
            </p>
          </div>
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
              className="relative w-32 h-32 rounded-full p-1 ring-2 ring-[#00F2FF] bg-[#111827] flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)] cursor-pointer group hover:ring-[3px] transition-all duration-300"
            >
              <img
                src={avatarPreview || user.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                <span className="text-[#00F2FF] text-sm font-semibold tracking-wider uppercase">
                  Đổi ảnh
                </span>
              </div>
            </div>
            <button
              onClick={handleTriggerClick}
              className="w-36 py-2.5 rounded-xl border border-[rgba(100,116,139,0.4)] bg-[rgba(15,23,42,0.6)] text-dc-text text-sm font-medium cursor-pointer hover:border-[rgba(0,242,255,0.4)] hover:text-[#00F2FF] hover:bg-[rgba(15,23,42,0.8)] transition-all duration-200"
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
