
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { showtimesApi } from "../../../api/showtimeApi";
import { getProfile } from "../../../api/userApi";
import { getToken } from "../../../utils/auth";
import { ChevronLeft, Radio, ShieldAlert, Film } from "lucide-react";
import ChatRoom from "./ChatRoom";
import RoomCinematic from "./RoomCinematic";
import RoomInfo from "./RoomInfo";

export default function PremiereRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);

        let currentRoomData = null;
        const detailRes = await showtimesApi.getDetail(id).catch(() => null);
        if (detailRes?.success) {
          currentRoomData = detailRes.data;
          setRoomData(currentRoomData);
        }

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

        if (res?.data) {
          currentRoomData = { ...currentRoomData, ...res.data };
          setRoomData(currentRoomData);
        }

        if (
          res.success === false &&
          res.message?.toLowerCase().includes("premium")
        ) {
          setIsPremiumLocked(true);
        } else if (res.status === "live") {
          setStreamData(res.data);
          setIsScheduled(false);
          setIsEnded(false);
          setIsCancelled(false);
        } else if (res.status === "scheduled") {
          setIsScheduled(true);
        } else if (res.status === "ended") {
          setIsEnded(true);
        } else if (res.status === "cancelled") {
          setIsCancelled(true);
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
  useEffect(() => {
    if (loading || pageError || isPremiumLocked) return;

    const socketUrl = import.meta.env.VITE_API_URL;
    const socket = io(socketUrl);
    const roomName = `room_premiere_${id}`;

    socket.emit("join_premiere_room", roomName);

    socket.on("room_status_changed", async (data) => {
      if (data.roomId !== parseInt(id)) return;

      if (data.status === "cancelled") {
        setIsCancelled(true);
        setIsScheduled(false);
        setIsEnded(false);
      } else if (data.status === "ended") {
        setIsEnded(true);
        setIsScheduled(false);
        setIsCancelled(false);
      } else if (data.status === "live") {
        try {
          const res = await showtimesApi.watchPremiere(id);
          if (res.success && res.status === "live") {
            setIsScheduled(false);
            setIsCancelled(false);
            setIsEnded(false);
            setStreamData(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi fetch stream luồng live:", error);
        }
      }
    });

    return () => {
      socket.emit("leave_premiere_room", roomName);
      socket.disconnect();
    };
  }, [id, loading, pageError, isPremiumLocked]);
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
          <ShieldAlert size={36} className="text-rose-500" />
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
            {roomData?.movie_name || "Phòng Công Chiếu"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isEnded && !isScheduled && !isPremiumLocked && !isCancelled && (
            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100/50">
              <Radio size={14} className="text-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold text-rose-600 uppercase">
                Live
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-6 max-w-400 mx-auto w-full">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scroll-hide pr-2">
          <RoomCinematic
            roomData={roomData}
            streamData={streamData}
            activeStreamIndex={activeStreamIndex}
            isPremiumLocked={isPremiumLocked}
            isCancelled={isCancelled}
            isEnded={isEnded}
            isScheduled={isScheduled}
          />

          {!isPremiumLocked && !isCancelled && !isEnded && (
            <RoomInfo
              roomData={roomData}
              streamData={streamData}
              activeStreamIndex={activeStreamIndex}
              setActiveStreamIndex={setActiveStreamIndex}
              isScheduled={isScheduled}
            />
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
