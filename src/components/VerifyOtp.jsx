import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Film, ArrowLeft, Loader2 } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyOtpApi, resendOtpApi } from "../api/authApi";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const initialExpire = location.state?.expire;

  const [countdown, setCountdown] = useState(0);
  const [expire, setExpire] = useState(initialExpire);

  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!expire) return;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.floor((new Date(expire).getTime() - now) / 1000);
      setCountdown(diff > 0 ? diff : 0);
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
  }, [expire]);

  const verifyMutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess(data) {
      toast.success(data.message || "Xác minh thành công!");
      navigate("/login");
    },
    onError(err) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "OTP không đúng",
      );
    },
  });
  const resendMutation = useMutation({
    mutationFn: resendOtpApi,
    onSuccess(data) {
      toast.success("Đã gửi lại OTP!");
      setExpire(data.otp_expire);

      inputsRef.current.forEach((i) => (i.value = ""));
      inputsRef.current[0]?.focus();
    },
  });

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    inputsRef.current[index].value = value;

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    const code = inputsRef.current.map((i) => i.value).join("");

    if (code.length === 6) {
      verifyMutation.mutate({ email, code });
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    paste.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = char;
      }
    });
    if (paste.length === 6) {
      verifyMutation.mutate({ email, code: paste });
    }
  };
  const handleSubmit = () => {
    const code = inputsRef.current.map((i) => i.value).join("");

    if (code.length < 6) {
      toast.error("Vui lòng nhập đủ mã OTP");
      return;
    }

    verifyMutation.mutate({ email, code });
  };
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const isLoading = verifyMutation.isPending;
  return (
    <div className="h-screen flex items-center justify-center bg-[#0D0D0D] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute w-175 h-175 bg-linear-to-br from-cyan-400 to-purple-600 opacity-20 blur-[160px] rounded-full" />
      <div className="absolute top-10 left-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg">
          <Film className="text-white" size={20} />
        </div>
        <span className="text-xl font-black bg-linear-to-br from-cyan-400 to-purple-600 text-transparent bg-clip-text">
          DevChill
        </span>
      </div>
      <div className="z-10 w-full max-w-115 p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,212,255,0.1)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 rounded-3xl" />
            <ShieldCheck className="text-cyan-400" size={34} />
          </div>

          <h2 className="text-3xl font-black text-white mb-2">Xác minh OTP</h2>

          <p className="text-gray-400 text-sm mb-8">
            Nhập mã gửi tới <br />
            <span className="text-cyan-400 font-semibold">{email}</span>
          </p>
          <div className="flex gap-3 mb-8" onPaste={handlePaste}>
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLoading}
                className="w-14 h-16 rounded-xl bg-white/10 border border-white/10 text-center text-xl font-bold text-white 
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 
                transition-all duration-200 hover:bg-white/20"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2
            bg-linear-to-br from-cyan-400 to-purple-600 hover:opacity-90 active:scale-95 transition-all"
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {isLoading ? "Đang xác minh..." : "Xác minh"}
          </button>
          <div className="mt-5 text-sm text-gray-400">
            {countdown > 0 ? (
              <>Gửi lại sau {formatTime(countdown)}</>
            ) : (
              <button
                onClick={() => resendMutation.mutate({ email })}
                className="text-cyan-400 hover:underline"
              >
                Gửi lại mã OTP
              </button>
            )}
          </div>
          <Link
            to="/login"
            className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
