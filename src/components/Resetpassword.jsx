import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiFilm, FiHome } from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { resetPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";

import { resetPasswordSchema } from "../schemas/auth"; 

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema), 
  });

  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess() {
      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Reset thất bại!");
    },
  });
  const onSubmit = (data) => {
    if (!token) {
      toast.error("Token không hợp lệ!");
      return;
    }
    mutation.mutate({
      token,
      newPassword: data.password,
    });
  };
  return (
    <div className="min-h-screen flex bg-dc-darker page-enter">
      <Link
        to="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full text-white/70 hover:text-[#00F2FF]"
      >
        <FiHome />
      </Link>
      <div className="hidden lg:flex w-[40%] relative overflow-hidden items-end">
        <img
          src={devchilllogo}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3 mb-4">
            <FiFilm className="text-dc-cyan text-xl" />
            <span className="text-2xl font-bold text-white">
              Dev<span className="text-dc-cyan">Chill</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white">Đặt lại mật khẩu</h2>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md glass-card p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>

          <p className="text-sm text-gray-400 mb-6">
            Nhập mật khẩu mới của bạn
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">Mật khẩu mới</label>

              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="password"
                  {...register("password")}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-dc-input-bg border border-dc-input-border text-white focus:border-dc-cyan outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-300">Nhập lại mật khẩu</label>

              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"} 
                  placeholder="confirmPassword"
                  {...register("confirmPassword")}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-dc-input-bg border border-dc-input-border text-white focus:border-dc-cyan outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)} 
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:opacity-90"
            >
              {mutation.isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            <Link to="/login" className="text-cyan-400">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
