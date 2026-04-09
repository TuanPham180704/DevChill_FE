import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, Mail, Lock } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";
import { setToken } from "../utils/auth";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-4 py-3 rounded-lg text-base outline-none transition-all duration-200 text-white placeholder-slate-400 font-medium";

const inputStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(0,212,255,0.25)",
};

const gradBtn =
  "w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 text-black hover:scale-[1.02] active:scale-[0.98]";

const gradStyle = {
  background: "linear-gradient(135deg,#00D4FF 0%,#7C3AED 100%)",
  boxShadow: "0 0 25px rgba(0,212,255,0.35)",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess(data) {
      const token = data?.token;
      const user = data?.user;

      if (token) {
        setToken(token);
        qc.invalidateQueries({ queryKey: ["me"] });

        toast.success(`Chào mừng ${user?.username || "bạn"} quay lại!`);

        if (user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Đăng nhập thất bại");
      }
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const isLoading = mutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen flex bg-[#0D0D0D]">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.06) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-[#020617] via-[#050816] to-[#0a0519]" />

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br from-cyan-400 to-purple-600 shadow-[0_0_25px_rgba(0,212,255,0.5)]">
              <Film size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black bg-linear-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              DevChill
            </span>
          </Link>

          <h1 className="text-4xl font-black text-white leading-snug mb-4">
            Trải nghiệm điện ảnh
            <br />
            <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              thông minh hơn
            </span>
          </h1>

          <p className="text-base text-slate-400 mb-10 max-w-lg">
            AI gợi ý phim cá nhân hóa, công chiếu realtime và kho phim đỉnh
            nhất.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {[
              { val: "10K+", label: "Phim" },
              { val: "88K+", label: "Người dùng" },
              { val: "92%", label: "AI chính xác" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl text-center backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                <p className="text-2xl font-black text-cyan-400">{s.val}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-8 relative">
        <div className="absolute inset-0 bg-linear-to-br from-[#020617] via-[#050816] to-[#0a0519]" />
        <div className="absolute top-16 right-16 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-16 left-8 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-cyan-400 to-purple-600">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white">DevChill</span>
          </div>

          <div
            className="rounded-2xl p-8 backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 25px rgba(0,212,255,0.08)",
            }}
          >
            <h2 className="text-3xl font-black text-white mb-1">Đăng nhập</h2>
            <p className="text-xl text-slate-300 mb-8">
              Chào mừng trở lại với DevChill!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="text-sm text-white mb-1 block font-semibold">
                  EMAIL
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400" />
                  <input
                    type="email"
                    {...register("email")}
                    className={`${inputBase} pl-10 ${
                      errors.email ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="example@gmail.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-white mb-1 block font-semibold">
                  MẬT KHẨU
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`${inputBase} pl-10 pr-10 ${
                      errors.password ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className={gradBtn}
                style={gradStyle}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-slate-300">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-cyan-400 font-semibold hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
