import { Link, useNavigate } from "react-router-dom";
import { Film, Mail, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-6 py-4 rounded-2xl text-lg outline-none transition-all duration-200 text-white placeholder-slate-600";
const inputNormal = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};
const gradBtn =
  "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-black disabled:opacity-70";
const gradStyle = {
  background: "linear-gradient(135deg,#00D4FF 0%,#7C3AED 100%)",
  boxShadow: "0 0 24px rgba(0,212,255,0.25)",
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
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
    if (mutation.isPending) return;
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0D0D" }}>
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.07) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,10,30,0.85) 0%,rgba(10,5,25,0.7) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right,transparent 60%,#0D0D0D 100%)",
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-125 h-125 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(0,212,255,0.18) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.5) 2px,rgba(0,0,0,0.5) 4px)",
          }}
        />
        <div
          className="absolute bottom-8 right-8 text-6xl font-black select-none opacity-[0.04] tracking-[0.3em]"
          style={{ color: "#00D4FF" }}
        >
          DEVCHILL
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-14 py-16">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#7C3AED)",
                boxShadow: "0 0 32px rgba(0,212,255,0.45)",
              }}
            >
              <Film size={24} className="text-white" />
            </div>
            <span
              className="text-3xl font-black"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DevChill
            </span>
          </div>
          <h1 className="text-4xl font-black text-white leading-snug mb-4">
            Trải nghiệm điện ảnh
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#00D4FF,#7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              thông minh hơn
            </span>
          </h1>
          <p className="text-base mb-12" style={{ color: "#94A3B8" }}>
            AI gợi ý phim cá nhân hóa, công chiếu realtime
            <br />
            và kho phim đỉnh nhất.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "10K+", label: "Phim" },
              { val: "88K+", label: "Người dùng" },
              { val: "92%", label: "AI chính xác" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-2xl text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-2xl font-black" style={{ color: "#00D4FF" }}>
                  {s.val}
                </p>
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 70%)",
          }}
        />
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00D4FF,#7C3AED)" }}
            >
              <Film size={20} className="text-white" />
            </div>
            <span
              className="text-2xl font-black"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DevChill
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="rounded-3xl p-10"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  boxShadow: "0 0 30px rgba(0,212,255,0.15)",
                }}
              >
                <KeyRound size={28} style={{ color: "#00D4FF" }} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                Quên mật khẩu?
              </h2>
              <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                Nhập email để nhận liên kết đặt lại mật khẩu.
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    className="text-sm font-semibold mb-1.5 block tracking-wider"
                    style={{ color: "#64748B" }}
                  >
                    EMAIL
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#475569" }}
                    />
                    <input
                      type="email"
                      {...register("email")}
                      disabled={isSubmitting || mutation.isPending}
                      className={`${inputBase} pl-12`}
                      style={inputNormal}
                      placeholder="exemple@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className={gradBtn}
                  style={gradStyle}
                >
                  {isSubmitting || mutation.isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi liên kết đặt lại"
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
                <span className="text-sm" style={{ color: "#475569" }}>
                  hoặc
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              </div>

              <p className="text-center text-sm" style={{ color: "#64748B" }}>
                Nhớ mật khẩu rồi?{" "}
                <Link
                  to="/login"
                  className="font-semibold hover:underline"
                  style={{ color: "#00D4FF" }}
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
