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
  "w-full px-4 py-3 rounded-lg text-base outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium";

const inputStyle = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(209,213,219,1)",
};

const gradBtn =
  "w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-[0.98]";

const gradStyle = {
  background: "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
  boxShadow: "0 4px 20px rgba(59,130,246,0.25)",
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
    <div className="min-h-screen flex bg-white text-gray-800">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-50 border-r border-gray-200">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500 shadow-sm">
              <Film size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-gray-900">DevChill</span>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 leading-snug mb-4">
            Trải nghiệm điện ảnh
            <br />
            <span className="text-blue-600">thông minh hơn</span>
          </h1>

          <p className="text-base text-gray-500 mb-10 max-w-lg">
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
                className="p-4 rounded-xl text-center bg-white border border-gray-200 shadow-sm"
              >
                <p className="text-2xl font-black text-blue-600">{s.val}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-8 relative bg-white">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">DevChill</span>
          </div>

          <div className="rounded-2xl p-8 backdrop-blur-xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 mb-1">
              Đăng nhập
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              Chào mừng trở lại với DevChill!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  EMAIL
                </label>

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  MẬT KHẨU
                </label>

                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />

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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={gradBtn}
                style={gradStyle}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
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
