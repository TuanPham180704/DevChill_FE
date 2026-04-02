import { useState } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { changePasswordSchema } from "../../../schemas/auth";
import { toast } from "react-toastify";

export default function ChangePassword({ isOpen, onClose, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrors({});

    const result = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues.map((err) => [err.path[0], err.message]),
      );
      setErrors(fieldErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await onSubmit(result.data);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(res?.message || "Đổi mật khẩu thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };
  const renderPasswordInput = (
    value,
    setValue,
    placeholder,
    showPassword,
    setShowPassword,
    fieldName,
  ) => (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full px-5 py-3.5 rounded-xl bg-[rgba(15,23,42,0.6)] border ${
          errors[fieldName] ? "border-red-500" : "border-dc-input-border"
        } text-white text-sm outline-none placeholder-[#64748b] focus:border-[#00F2FF] focus:shadow-[0_0_0_3px_rgba(0,242,255,0.15)] transition-all pr-12`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
      {errors[fieldName] && (
        <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
      )}
    </div>
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#111827] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[rgba(0,242,255,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-6 pb-4 border-b border-[rgba(100,116,139,0.2)] relative">
          <h2 className="text-white text-xl font-bold tracking-wide">
            Đổi mật khẩu
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-dc-text-muted hover:text-[#00F2FF] transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-5">
          {renderPasswordInput(
            oldPassword,
            setOldPassword,
            "Mật khẩu cũ",
            showOldPassword,
            setShowOldPassword,
            "oldPassword",
          )}
          {renderPasswordInput(
            newPassword,
            setNewPassword,
            "Mật khẩu mới",
            showNewPassword,
            setShowNewPassword,
            "newPassword",
          )}
          {renderPasswordInput(
            confirmPassword,
            setConfirmPassword,
            "Xác nhận mật khẩu mới",
            showConfirmPassword,
            setShowConfirmPassword,
            "confirmPassword",
          )}
        </div>

        <div className="px-8 pb-8 pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-[rgba(100,116,139,0.4)] bg-[rgba(15,23,42,0.6)] text-dc-text text-sm font-medium hover:border-[rgba(0,242,255,0.4)] hover:text-[#00F2FF] hover:bg-[rgba(15,23,42,0.8)] transition-all disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#00F2FF] text-[#0A0E17] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,242,255,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
}
