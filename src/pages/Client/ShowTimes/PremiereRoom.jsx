/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PremierePlayer from "../../../components/PremierePlayer";
import ChatRoom from "./ChatRoom";
import { showtimesApi } from "../../../api/showtimeApi";
import { getProfile } from "../../../api/userApi";
import { getToken } from "../../../utils/auth";
import {
  ChevronLeft,
  Radio,
  Crown,
  MonitorPlay,
  Film,
  Clock,
  ShieldAlert,
  Star,
  Monitor,
  ShieldCheck,
} from "lucide-react";

const RoomCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        clearInterval(timer);
        window.location.reload();
        return;
      }
      setTimeLeft({
        h: Math.floor(diff / 3600000)
          .toString()
          .padStart(2, "0"),
        m: Math.floor((diff % 3600000) / 60000)
          .toString()
          .padStart(2, "0"),
        s: Math.floor((diff % 60000) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3 md:gap-5 mt-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2A3040]/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
          <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
            {timeLeft.h}
          </span>
        </div>
        <span className="text-[#8B95A5] text-[10px] font-bold uppercase tracking-widest">
          Giờ
        </span>
      </div>

      <div className="text-white/40 text-2xl font-medium mb-6">:</div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2A3040]/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
          <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
            {timeLeft.m}
          </span>
        </div>
        <span className="text-[#8B95A5] text-[10px] font-bold uppercase tracking-widest">
          Phút
        </span>
      </div>

      <div className="text-white/40 text-2xl font-medium mb-6">:</div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2556E8] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(37,86,232,0.4)]">
          <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
            {timeLeft.s}
          </span>
        </div>
        <span className="text-[#2556E8] text-[10px] font-bold uppercase tracking-widest">
          Giây
        </span>
      </div>
    </div>
  );
};

export default function PremiereRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);
        const detailRes = await showtimesApi.getDetail(id).catch(() => null);
        if (detailRes?.success) setRoomData(detailRes.data);

        const token = getToken() || localStorage.getItem("token");
        if (!token) {
          setPageError({
            type: "auth",
            title: "Yêu cầu đăng nhập",
            message: "Bạn cần đăng nhập để xem buổi công chiếu này.",
          });
          return setLoading(false);
        }

        const userProfile = await getProfile().catch(() => null);
        if (!userProfile) {
          setPageError({
            type: "auth",
            title: "Phiên làm việc hết hạn",
            message: "Vui lòng đăng nhập lại.",
          });
          return setLoading(false);
        }
        setCurrentUser(userProfile);

        const res = await showtimesApi.watchPremiere(id);
        if (
          res.success === false &&
          res.message?.toLowerCase().includes("premium")
        ) {
          setIsPremiumLocked(true);
        } else if (res.success && res.status === "live") {
          setStreamData(res.data);
          if (!roomData) setRoomData(res.data);
        } else if (res.status === "scheduled") {
          setIsScheduled(true);
        } else if (res.status === "ended") {
          setPageError({
            type: "ended",
            title: "Đã kết thúc",
            message: "Suất chiếu đã kết thúc, hẹn gặp lại bạn lần sau!",
          });
        }
      } catch (err) {
        if (err.response?.status === 403) setIsPremiumLocked(true);
        else
          setPageError({
            type: "error",
            title: "Lỗi kết nối",
            message: "Không thể tải dữ liệu phòng chiếu.",
          });
      } finally {
        setLoading(false);
      }
    };
    initRoom();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );

  if (pageError)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6">
          {pageError.type === "ended" ? (
            <Film size={36} className="text-slate-400" />
          ) : (
            <ShieldAlert size={36} className="text-rose-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {pageError.title}
        </h1>
        <p className="text-slate-500 mb-8 max-w-sm text-center">
          {pageError.message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/showtimes")}
            className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-all"
          >
            Về lịch chiếu
          </button>
          {pageError.type === "auth" && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="h-screen bg-[#FDFDFD] flex flex-col overflow-hidden relative font-sans">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20">
        <button
          onClick={() => navigate("/showtimes")}
          className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-slate-900 text-[15px] font-bold tracking-tight">
            {roomData?.movie_name}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100/50">
          <Radio size={14} className="text-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-600 uppercase">
            Live
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-6 max-w-400 mx-auto w-full">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scroll-hide pr-2">
          <div className="relative w-full aspect-video bg-[#0B101A] rounded-[24px] overflow-hidden shadow-lg shrink-0 flex items-center justify-center">
            {isPremiumLocked ? (
              <>
                <img
                  src={roomData?.poster_url}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md"
                  alt="Poster"
                />
                <div className="absolute inset-0 bg-slate-900/60"></div>
                <div className="relative z-10 w-[90%] max-w-110 bg-[#F4F6F9] rounded-[24px] p-8 text-center shadow-2xl h-max animate-in zoom-in duration-300">
                  <div className="w-13 h-13 bg-[#FFF8E7] rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Star
                      size={26}
                      className="text-[#F59E0B]"
                      fill="currentColor"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2.5 mb-3">
                    <h2 className="text-[20px] font-bold text-slate-800">
                      Nâng cấp Premium để tiếp tục
                    </h2>
                    <span className="bg-[#FFF4D6] text-[#D97706] text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">
                      PREMIUM
                    </span>
                  </div>

                  <p className="text-slate-500 text-[14.5px] leading-relaxed mb-8 px-2">
                    Phim này là nội dung độc quyền, chỉ dành riêng cho thành
                    viên Premium. Hãy nâng cấp để tiếp tục thưởng thức.
                  </p>

                  <button
                    onClick={() => navigate("/premium")}
                    className="w-full py-3.5 bg-white border border-[#FCD34D] hover:bg-[#FFFDEB] text-slate-800 rounded-[14px] text-[15px] font-bold flex items-center justify-center gap-2.5 mb-3.5 transition-colors shadow-sm"
                  >
                    <Star
                      size={18}
                      className="text-[#F59E0B]"
                      fill="currentColor"
                    />{" "}
                    Nâng cấp gói Premium
                  </button>

                  <button
                    onClick={() => navigate("/showtimes")}
                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-[14px] text-[15px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Trở về trang công chiếu
                  </button>

                  <div className="flex items-center justify-center gap-6 mt-7 text-[12.5px] font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <Monitor size={15} className="text-blue-500" /> 4K HDR
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-emerald-500" />{" "}
                      Không quảng cáo
                    </div>
                  </div>
                </div>
              </>
            ) : isScheduled ? (
              <>
                <img
                  src={roomData?.poster_url}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  alt="Poster"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B101A] via-[#0B101A]/70 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  <div className="w-10 h-10 bg-[#2556E8]/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-[#2556E8]/30">
                    <Clock size={18} className="text-[#60A5FA]" />
                  </div>
                  <h2 className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight">
                    Sắp công chiếu
                  </h2>
                  <p className="text-white/70 max-w-sm text-center text-[13px] md:text-[14px]">
                    Buổi công chiếu đang được đếm ngược. Hãy chuẩn bị sẵn sàng,
                    hệ thống sẽ tự động phát khi đến giờ!
                  </p>
                  <RoomCountdown targetDate={roomData?.start_time} />
                </div>
              </>
            ) : (
              streamData?.streams?.[activeStreamIndex]?.link_m3u8 && (
                <PremierePlayer
                  url={streamData.streams[activeStreamIndex].link_m3u8}
                  startTime={streamData.current_offset || 0}
                />
              )
            )}
          </div>

          {!isPremiumLocked && !isScheduled && (
            <div className="mt-6 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MonitorPlay size={18} className="text-slate-600" />
                  <h3 className="font-bold text-slate-800 uppercase text-[14px]">
                    Hệ thống Servers
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {streamData?.streams?.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStreamIndex(i)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-[16px] border transition-all duration-200 ${activeStreamIndex === i ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span className="font-semibold text-[14px]">
                        {s.server_name}
                      </span>
                      {activeStreamIndex === i && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#60a5fa]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-slate-100 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {roomData?.movie_name}
                </h2>
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[13px] font-semibold w-max mb-6">
                  {roomData?.episode_name}
                </div>

                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-rose-500 rounded-full"></div> Nội
                  dung phim
                </h3>
                <p
                  className="text-slate-600 text-[14.5px] leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: roomData?.description }}
                ></p>

                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Diễn
                  viên
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {roomData?.actors?.map((a) => (
                    <span
                      key={a.id}
                      className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[13.5px] font-medium text-slate-700 cursor-default"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatRoom currentUser={currentUser} roomData={roomData} />
      </div>
      <style>{`
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
