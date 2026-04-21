/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Home, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { planApi } from "../../../api/planApi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  // Cờ chặn React StrictMode gọi API 2 lần liên tiếp
  const hasVerified = useRef(false);

  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  useEffect(() => {
    // Nếu cờ đã bật (hàm đã chạy qua 1 lần) thì return luôn, không làm gì cả
    if (hasVerified.current) return;

    const verifyPayment = async () => {
      // Đánh dấu là đã bắt đầu xử lý để chặn các lần gọi tiếp theo
      hasVerified.current = true;

      if (responseCode !== "00") {
        setStatus("failed");
        toast.error("Giao dịch đã bị hủy hoặc thất bại!", {
          toastId: "payment_fail",
        });
        return;
      }

      try {
        const res = await planApi.checkPaymentStatus(txnRef);
        if (res && res.status === "success") {
          setStatus("success");
          toast.success("Tuyệt vời! Thanh toán thành công.", {
            toastId: "payment_success",
          });
        } else {
          setStatus("failed");
          toast.error("Giao dịch đang chờ hoặc bị lỗi.", {
            toastId: "payment_pending",
          });
        }
      } catch (error) {
        setStatus("failed");
        toast.error("Lỗi xác minh từ máy chủ.", { toastId: "payment_error" });
      }
    };

    if (txnRef && responseCode) {
      verifyPayment();
    } else {
      setStatus("failed");
    }
  }, [txnRef, responseCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Box layout nhỏ gọn, tinh tế max-w-sm */}
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 text-center">
        {/* State: Đang xử lý */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 size={48} className="text-sky-500 animate-spin mb-5" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Đang xác minh...
            </h2>
            <p className="text-sm text-slate-500">
              Vui lòng không đóng trang này.
            </p>
          </div>
        )}

        {/* State: Thành công */}
        {status === "success" && (
          <div className="animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Hoàn tất!
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Cảm ơn bạn. Đặc quyền VIP của bạn đã được hệ thống kích hoạt tự
              động.
            </p>

            {amount && (
              <div className="bg-slate-50/50 p-4 rounded-xl mb-6 border border-slate-100 flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">
                  Đã thanh toán
                </span>
                <span className="text-xl font-black text-slate-900">
                  {(Number(amount) / 100).toLocaleString("vi-VN")}đ
                </span>
              </div>
            )}

            <Link
              to="/"
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Home size={16} /> Về trang chủ
            </Link>
          </div>
        )}

        {/* State: Thất bại */}
        {status === "failed" && (
          <div className="animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thất bại</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Giao dịch đã bị hủy hoặc có lỗi xảy ra. Tài khoản của bạn không bị
              trừ tiền.
            </p>

            <button
              onClick={() => navigate("/premium")}
              className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20"
            >
              <RotateCcw size={16} /> Thử thanh toán lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
