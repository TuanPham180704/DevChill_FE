import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiFilm, FiHome } from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess() {
      toast.success("Đã gửi email khôi phục!");
      navigate("/login");
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Không thể gửi email!");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen flex bg-dc-darker page-enter">
      <Link
        to="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full text-white/70 hover:text-[#00F2FF] hover:border-[#00F2FF]/40 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-300 group"
      >
        <FiHome className="text-xl group-hover:text-[#00F2FF]" />
      </Link>
      <div className="hidden lg:flex w-[40%] relative cinematic-overlay overflow-hidden items-end">
        <img
          src={devchilllogo}
          alt="DevChill Cinema"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 p-10 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-dc-cyan/20 flex items-center justify-center">
              <FiFilm className="text-dc-cyan text-xl" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Dev<span className="text-dc-cyan text-glow">Chill</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight">
            Khôi phục tài khoản
            <br />
            <span className="text-dc-cyan">nhanh chóng</span>
          </h2>

          <p className="mt-3 text-dc-text-muted text-sm max-w-xs">
            Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dc-dark relative overflow-hidden">
        <div className="absolute -top-30 -right-20 w-75 h-75 bg-dc-cyan/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-25 -left-15 w-62.5 h-62.5 bg-dc-teal/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-dc-cyan/20 flex items-center justify-center">
              <FiFilm className="text-dc-cyan text-xl" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Dev<span className="text-dc-cyan text-glow">Chill</span>
            </span>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Quên mật khẩu</h1>
              <p className="text-dc-text-muted text-sm mt-1">
                Nhập email để nhận link khôi phục
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Email
                </label>

                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />

                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-3 bg-dc-input-bg border rounded-xl text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all duration-200 input-glow
                      ${
                        errors.email
                          ? "border-red-500"
                          : "border-dc-input-border"
                      }`}
                    placeholder="you@example.com"
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="btn-cinematic w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
              >
                {mutation.isLoading ? "Đang gửi..." : "Gửi link khôi phục"}
              </button>
            </form>
            <p className="text-center text-dc-text-muted text-sm mt-6">
              Nhớ mật khẩu rồi?{" "}
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
    </div>
  );
}
