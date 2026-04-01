import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiFilm,
  FiHome,
} from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth";

import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/authApi";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      verify: false,
    },
  });
  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess(data, variables) {
      toast.success(data.message || "Đã gửi OTP, kiểm tra email!");
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    onError(err) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Đăng ký thất bại",
      );
    },
  });
  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex bg-dc-darker page-enter relative">
      <Link to="/" className="fixed top-8 left-8 z-50 flex items-center gap-2">
        <FiHome className="text-xl" />
      </Link>
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dc-dark relative overflow-hidden">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 animate-float-in delay-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              Tạo tài khoản
            </h1>
            <p className="text-dc-text-muted text-sm mb-6">
              Đăng ký để trải nghiệm kho phim khổng lồ
            </p>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="text"
                    placeholder="username"
                    {...formRegister("username")}
                    className={`w-full pl-10 pr-4 py-3 bg-dc-input-bg border rounded-xl text-dc-text
                      ${errors.username ? "border-red-500" : "border-dc-input-border"}`}
                  />
                </div>
                {errors.username && (
                  <span className="text-red-400 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...formRegister("email")}
                    className={`w-full pl-10 pr-4 py-3 bg-dc-input-bg border rounded-xl text-dc-text
                      ${errors.email ? "border-red-500" : "border-dc-input-border"}`}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-400 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...formRegister("password")}
                    className={`w-full pl-10 pr-12 py-3 bg-dc-input-bg border rounded-xl text-dc-text
                      ${errors.password ? "border-red-500" : "border-dc-input-border"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="confirm-password"
                    {...formRegister("confirmPassword")}
                    className={`w-full pl-10 pr-12 py-3 bg-dc-input-bg border rounded-xl text-dc-text
                      ${errors.confirmPassword ? "border-red-500" : "border-dc-input-border"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-400 text-sm">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...formRegister("verify")}
                  className="w-4 h-4 accent-cyan-500"
                />
                <label className="text-sm text-dc-text">
                  Tôi không phải robot
                </label>
              </div>
              {errors.verify && (
                <span className="text-red-400 text-sm">
                  {errors.verify.message}
                </span>
              )}
              <button
                type="submit"
                disabled={mutation.isLoading || isSubmitting}
                className="btn-cinematic w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
              >
                {mutation.isLoading || isSubmitting
                  ? "Đang đăng ký..."
                  : "Đăng ký"}
              </button>
            </form>

            <p className="text-center text-dc-text-muted text-sm mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-dc-cyan font-medium hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-[40%] relative cinematic-overlay overflow-hidden items-end">
        <img
          src={devchilllogo}
          alt="DevChill Cinema"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 p-10 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <FiFilm className="text-dc-cyan text-xl" />
            <span className="text-2xl font-bold text-white tracking-wide">
              Dev<span className="text-dc-cyan text-glow">Chill</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">
            Tham gia cộng đồng
            <br />
            <span className="text-dc-cyan">yêu phim</span> lớn nhất
          </h2>
          <p className="mt-3 text-dc-text-muted text-sm max-w-xs">
            Tạo tài khoản miễn phí để xem phim không giới hạn và nhận gợi ý cá
            nhân hóa.
          </p>
        </div>
      </div>
    </div>
  );
}
