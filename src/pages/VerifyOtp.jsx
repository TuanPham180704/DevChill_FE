import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiFilm, FiHome } from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";

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
      console.log("Verify OTP error:", err?.response?.data);
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
      toast.success(data.message || "Đã gửi lại mã OTP!");
      setExpire(data.otp_expire);

      inputsRef.current.forEach((i) => (i.value = ""));
      inputsRef.current[0]?.focus();
    },
    onError(err) {
      toast.error(err?.response?.data?.error || "Gửi lại OTP thất bại");
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

  return (
    <div className="min-h-screen flex bg-dc-darker relative">
      <Link
        to="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full text-white/70 hover:text-[#00F2FF]"
      >
        <FiHome />
      </Link>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dc-dark">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Xác minh OTP</h1>
            {!email && (
              <p className="text-red-400 mb-4">
                Không tìm thấy email. Vui lòng đăng ký lại.
              </p>
            )}

            <p className="text-dc-text-muted text-sm mb-6">
              Nhập mã đã gửi tới <b>{email}</b>
            </p>

            <div
              className="flex justify-between gap-2 mb-4"
              onPaste={handlePaste}
            >
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl bg-dc-input-bg border border-dc-input-border rounded-xl text-white outline-none focus:border-dc-cyan"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={verifyMutation.isLoading}
              className="btn-cinematic w-full py-3 rounded-xl"
            >
              {verifyMutation.isLoading ? "Đang xác minh..." : "Xác minh"}
            </button>

            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-sm text-gray-400">
                  Gửi lại sau {formatTime(countdown)}
                </p>
              ) : (
                <button
                  onClick={() => resendMutation.mutate({ email })}
                  className="text-dc-cyan hover:underline text-sm"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              <Link to="/login" className="text-dc-cyan">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-[40%] relative cinematic-overlay overflow-hidden items-end">
        <img
          src={devchilllogo}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3 mb-4">
            <FiFilm className="text-dc-cyan text-xl" />
            <span className="text-2xl text-white font-bold">DevChill</span>
          </div>
          <h2 className="text-3xl text-white font-bold">Xác minh tài khoản</h2>
          <p className="text-sm text-gray-300 mt-2">
            Nhập mã OTP để kích hoạt tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
