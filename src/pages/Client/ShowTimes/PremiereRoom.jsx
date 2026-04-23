/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
} from "lucide-react";

export default function PremiereRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);

        try {
          const detailRes = await showtimesApi.getDetail(id);
          if (detailRes.success) setRoomData(detailRes.data);
        } catch (e) {
          console.error("Lỗi lấy thông tin phim public");
        }

        const token = getToken() || localStorage.getItem("token");
        if (!token) {
          setPageError({
            type: "auth",
            title: "Yêu cầu đăng nhập",
            message: "Vui lòng đăng nhập để tham gia",
          });
          return setLoading(false);
        }

        try {
          const userProfile = await getProfile();
          setCurrentUser(userProfile);
        } catch (err) {
          setPageError({
            type: "auth",
            title: "Hết phiên đăng nhập",
            message: "Vui lòng đăng nhập lại",
          });
          return setLoading(false);
        }

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
          setPageError({
            type: "wait",
            title: "Chưa tới giờ chiếu",
            message: res.message,
          });
        } else if (res.status === "cancelled") {
          setPageError({
            type: "error",
            title: "Đã huỷ",
            message: res.message,
          });
        } else if (res.status === "ended") {
          setPageError({
            type: "ended",
            title: "Đã kết thúc",
            message:
              res.message ||
              "Suất công chiếu này đã kết thúc. Hẹn gặp lại bạn ở các phim sau!",
          });
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setIsPremiumLocked(true);
        } else {
          setPageError({
            type: "error",
            title: "Lỗi kết nối",
            message: "Không thể tải dữ liệu",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    initRoom();
  }, [id]);
  useEffect(() => {
    if (!roomData?.end_time || pageError || isPremiumLocked) return;

    const checkEndInterval = setInterval(() => {
      const now = new Date();
      const end = new Date(roomData.end_time);
      if (now > end) {
        setPageError({
          type: "ended",
          title: "Buổi công chiếu đã kết thúc",
          message:
            "Cảm ơn bạn đã theo dõi. Hẹn gặp lại ở các suất chiếu tiếp theo!",
        });
        clearInterval(checkEndInterval);
      }
    }, 5000);

    return () => clearInterval(checkEndInterval);
  }, [roomData, pageError, isPremiumLocked]);

  if (loading)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );

  if (pageError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6">
          {pageError.type === "wait" && (
            <Clock size={36} className="text-blue-500" />
          )}
          {pageError.type === "ended" && (
            <Film size={36} className="text-slate-400" />
          )}
          {(pageError.type === "error" || pageError.type === "auth") && (
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
            className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl shadow-md transition-all"
          >
            Về lịch chiếu
          </button>
          {pageError.type === "auth" && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl transition-all"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    );
  }

  const streams = streamData?.streams || [];
  const activeStream = streams[activeStreamIndex] || {};

  return (
    <div className="h-screen bg-[#FAFAFA] flex flex-col font-sans overflow-hidden relative">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10">
        <button
          onClick={() => navigate("/showtimes")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
            <ChevronLeft size={18} />
          </div>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-slate-900 text-[15px] font-bold">
            {roomData?.movie_name}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full">
          <Radio size={14} className="text-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-600 uppercase">
            Live
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-6 max-w-400 mx-auto w-full">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2">
          <div className="relative w-full aspect-video bg-black rounded-[24px] overflow-hidden shadow-lg shrink-0">
            {isPremiumLocked ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 filter blur-xl"
                  style={{ backgroundImage: `url(${roomData?.poster_url})` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50">
                  <div className="bg-white p-8 rounded-[32px] w-[90%] max-w-105 text-center shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-18 h-18 bg-[#FFF9E6] border border-[#FFE8B3] rounded-full flex items-center justify-center mb-5 shadow-sm">
                      <Crown size={36} className="text-[#FF9F00]" />
                    </div>
                    <h2 className="text-[22px] font-extrabold text-slate-900 mb-3 tracking-tight">
                      Nội dung Đặc quyền VIP
                    </h2>
                    <p className="text-slate-500 text-[14px] leading-relaxed mb-7 px-2">
                      Suất công chiếu này chỉ dành riêng cho hội viên Premium.
                      Vui lòng nâng cấp gói để trải nghiệm phim chất lượng cao
                      không quảng cáo.
                    </p>
                    <button
                      onClick={() => navigate("/premium")}
                      className="w-full py-3.5 bg-[#FF9F00] hover:bg-[#F09200] text-white rounded-2xl text-[15px] font-bold flex justify-center items-center gap-2 mb-3 transition-colors shadow-md shadow-orange-500/20"
                    >
                      <Crown size={18} /> Nâng cấp Premium ngay
                    </button>
                    <button
                      onClick={() => navigate("/showtimes")}
                      className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[15px] font-semibold transition-colors border border-transparent hover:border-slate-200"
                    >
                      Trở về lịch chiếu
                    </button>
                  </div>
                </div>
              </>
            ) : (
              activeStream.link_m3u8 && (
                <PremierePlayer
                  url={activeStream.link_m3u8}
                  startTime={streamData.current_offset || 0}
                />
              )
            )}
          </div>

          {!isPremiumLocked && streams.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm shrink-0">
              <div className="flex items-center gap-2.5 mb-5">
                <MonitorPlay size={20} className="text-slate-700" />
                <h3 className="font-bold text-[15px] text-slate-800 tracking-wide uppercase">
                  Hệ Thống Server
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {streams.map((stream, index) => {
                  const isActive = activeStreamIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveStreamIndex(index)}
                      className={`flex items-center justify-between px-5 py-4 rounded-[18px] border transition-all duration-200 ${
                        isActive
                          ? "border-slate-300 bg-slate-50 text-slate-900 font-bold shadow-sm"
                          : "border-slate-100 bg-white text-slate-600 font-semibold hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-[14px]">{stream.server_name}</span>
                      {isActive && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50">
                <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                  Trải nghiệm xem bị gián đoạn? Vui lòng chọn một{" "}
                  <strong className="text-slate-500">Server</strong> khác bên
                  trên để có tốc độ tốt hơn.
                </p>
              </div>
            </div>
          )}

          {roomData && (
            <div className="mt-6 bg-white p-6 lg:p-8 rounded-[24px] border border-slate-100 shadow-sm shrink-0">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {roomData.movie_name}
              </h2>
              <div className="inline-block bg-slate-100 px-3 py-1 rounded-md text-[13px] font-semibold text-slate-600 mb-6">
                {roomData.episode_name}
              </div>

              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-rose-500 rounded-full"></span> Nội
                dung phim
              </h3>
              <p
                className="text-slate-600 text-[15px] leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: roomData.description }}
              ></p>

              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Diễn
                viên
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {roomData.actors?.map((actor) => (
                  <span
                    key={actor.id}
                    className="px-4 py-2 bg-slate-50 rounded-full text-[13.5px] font-medium text-slate-700 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {actor.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <ChatRoom currentUser={currentUser} roomData={roomData} />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
