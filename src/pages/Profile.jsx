import { useState, useRef, useEffect } from "react";
import avatarImg from "../assets/avatar.jpg";
import Sidebar from "../components/SideBar";
import Changepassword from "../components/Changepassword";

export default function Profile() {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup object URL
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleTriggerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(newPreviewUrl);
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex">

        {/* ── LEFT PANEL – Sidebar ─────────────────────────────────────── */}
       

          {/* Sidebar header */}
          {/* <div className="px-6 pt-8 pb-6">
            <h2 className="text-white text-xl font-bold leading-tight">
              Quản lý tài khoản
            </h2>
          </div> */}

          {/* Nav items */}
         <Sidebar active="profile" customAvatar={avatarPreview} />

          {/* Bottom user card */}
  

        {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
        <main className="flex-1 bg-[#111827] px-16 py-12">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold mb-1">Tài khoản</h1>
            <p className="text-[#94a3b8] text-sm">Cập nhật thông tin tài khoản của bạn</p>
          </div>

          {/* Content row: form + avatar */}
          <div className="flex gap-10">

            {/* Form */}
            <div className="flex-1">

              {/* Email */}
              <div className="mb-5">
                <label className="block text-[#e2e8f0] text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="email@example.com"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(15,23,42,0.7)] border border-[rgba(100,116,139,0.3)] text-[#94a3b8] text-sm outline-none cursor-not-allowed"
                />
              </div>

              {/* Display name */}
              <div className="mb-5">
                <label className="block text-[#e2e8f0] text-sm font-medium mb-2">Tên hiển thị</label>
                <input
                  type="text"
                  placeholder="Nhập tên hiển thị"
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(15,23,42,0.7)] border border-[rgba(100,116,139,0.3)] text-white text-sm outline-none placeholder-[#4b5563] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all"
                />
              </div>

              {/* Gender radio */}
              <div className="mb-8">
                <label className="block text-[#e2e8f0] text-sm font-medium mb-3">Giới tính</label>
                <div className="flex items-center gap-6">

                  {/* Nam */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="gender" value="male" className="peer hidden" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#64748b] peer-checked:border-[#00F2FF] peer-checked:shadow-[0_0_12px_rgba(0,242,255,0.4)] bg-transparent flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FF] opacity-0 peer-checked:opacity-100 transition-all"></div>
                    </div>
                    <span className="text-[#94a3b8] peer-checked:text-[#00F2FF] peer-checked:font-bold text-sm transition-all group-hover:text-white">Nam</span>
                  </label>

                  {/* Nữ – selected by default */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="gender" value="female" defaultChecked className="peer hidden" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#64748b] peer-checked:border-[#00F2FF] peer-checked:shadow-[0_0_12px_rgba(0,242,255,0.4)] bg-transparent flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FF] opacity-0 peer-checked:opacity-100 transition-all"></div>
                    </div>
                    <span className="text-[#94a3b8] peer-checked:text-[#00F2FF] peer-checked:font-bold text-sm transition-all group-hover:text-white">Nữ</span>
                  </label>

                  {/* Không xác định */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="gender" value="other" className="peer hidden" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#64748b] peer-checked:border-[#00F2FF] peer-checked:shadow-[0_0_12px_rgba(0,242,255,0.4)] bg-transparent flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FF] opacity-0 peer-checked:opacity-100 transition-all"></div>
                    </div>
                    <span className="text-[#94a3b8] peer-checked:text-[#00F2FF] peer-checked:font-bold text-sm transition-all group-hover:text-white">Không xác định</span>
                  </label>

                </div>
              </div>

              {/* Update button */}
              <button
                type="button"
                className="px-8 py-3 rounded-xl bg-[#00F2FF] text-[#0A0E17] font-bold text-sm tracking-wide cursor-pointer hover:shadow-[0_0_20px_rgba(0,242,255,0.45)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Cập nhật
              </button>

              {/* Change password link */}
              <p className="mt-5 text-[#94a3b8] text-sm">
                Đổi mật khẩu, nhấn vào{" "}
                <span 
                  onClick={() => setShowPasswordModal(true)}
                  className="text-[#00F2FF] underline cursor-pointer hover:text-white transition-all"
                >
                  đây
                </span>
              </p>
            </div>

            {/* Avatar area */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Large avatar circle */}
              <div 
                className="relative w-32 h-32 rounded-full p-1 ring-2 ring-[#00F2FF] bg-[#111827] flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)] cursor-pointer group hover:ring-[3px] transition-all duration-300"
                onClick={handleTriggerClick}
              >
                <img 
                  src={avatarPreview || avatarImg} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                  <span className="text-[#00F2FF] text-sm font-semibold tracking-wider uppercase">Đổi ảnh</span>
                </div>
              </div>

              {/* Upload button */}
              <button
                type="button"
                onClick={handleTriggerClick}
                className="w-36 py-2.5 rounded-xl border border-[rgba(100,116,139,0.4)] bg-[rgba(15,23,42,0.6)] text-[#e2e8f0] text-sm font-medium cursor-pointer hover:border-[rgba(0,242,255,0.4)] hover:text-[#00F2FF] hover:bg-[rgba(15,23,42,0.8)] transition-all duration-200"
              >
                Chọn ảnh
              </button>
            </div>

          </div>
        </main>

        {/* Modals */}
        <Changepassword 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
    </div>
  );
}
