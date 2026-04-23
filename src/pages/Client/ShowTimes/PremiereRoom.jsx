/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../../../components/VideoPlayer";
import { showtimesApi } from "../../../api/showtimeApi";
import { getProfile } from "../../../api/userApi";
import { getToken } from "../../../utils/auth";
import {
  Send,
  Users,
  ShieldAlert,
  Clock,
  ChevronLeft,
  Radio,
  Crown,
} from "lucide-react";

const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "🔥", "✨"];

export default function PremiereRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Hệ thống",
      text: "Phòng chiếu đã sẵn sàng. Chúc bạn xem phim vui vẻ!",
      isSystem: true,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const chatEndRef = useRef(null);
  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);
        const token = getToken() || localStorage.getItem("token");
        if (!token) {
          setErrorObj({
            title: "Yêu cầu đăng nhập",
            message: "Bạn cần đăng nhập để tham gia phòng công chiếu.",
            type: "auth",
          });
          setLoading(false);
          return;
        }
        let userProfile;
        try {
          userProfile = await getProfile();
          setCurrentUser(userProfile);
        } catch (err) {
          setErrorObj({
            title: "Phiên đăng nhập hết hạn",
            message: "Không thể xác thực tài khoản. Vui lòng đăng nhập lại.",
            type: "auth",
          });
          setLoading(false);
          return;
        }
        const res = await showtimesApi.watchPremiere(id);

        if (res.success && res.status === "live") {
          const roomInfo = res.data;
          const isPremiereMovie =
            roomInfo.is_premiere || roomInfo.movie_is_premium;

          if (isPremiereMovie && !userProfile.is_premium) {
            setErrorObj({
              title: "Nội dung Đặc quyền VIP",
              message:
                "Suất chiếu Công chiếu (Premiere) chỉ dành cho thành viên Premium. Vui lòng nâng cấp tài khoản để tiếp tục trải nghiệm.",
              type: "premium",
            });
            return; 
          }
          setRoomData(roomInfo);
        } else if (res.status === "scheduled") {
          setErrorObj({
            title: "Chưa tới giờ chiếu",
            message: res.message || "Phim chưa bắt đầu, vui lòng quay lại sau.",
            type: "wait",
          });
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          "Lỗi truy cập hệ thống. Vui lòng thử lại sau.";
        setErrorObj({
          title: "Không thể truy cập",
          message: errorMsg,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    initRoom();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, floatingEmojis]);

  useEffect(() => {
    if (!roomData) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6)
        handleDropEmoji(
          EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)],
        );
    }, 3000);
    return () => clearInterval(interval);
  }, [roomData]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userName = currentUser?.username || "Bạn";
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: userName, text: chatInput, isSystem: false },
    ]);
    setChatInput("");
  };

  const handleDropEmoji = (emojiIcon) => {
    const emojiId = Date.now() + Math.random();
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis((prev) => [
      ...prev,
      { id: emojiId, icon: emojiIcon, left: randomLeft },
    ]);
    setTimeout(
      () => setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId)),
      2500,
    );
  };
  if (loading)
    return (
      <div className="h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );

  if (errorObj) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <div className="w-20 h-20 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[24px] flex items-center justify-center mb-6">
          {errorObj.type === "wait" && (
            <Clock size={36} className="text-slate-400" />
          )}
          {errorObj.type === "premium" && (
            <Crown size={36} className="text-amber-500" />
          )}
          {(errorObj.type === "error" || errorObj.type === "auth") && (
            <ShieldAlert size={36} className="text-rose-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
          {errorObj.title}
        </h1>
        <p className="text-slate-500 text-[15px] mb-8 text-center max-w-sm leading-relaxed">
          {errorObj.message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/showtimes")}
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            Xem lịch chiếu
          </button>

          {errorObj.type === "premium" ? (
            <button
              onClick={() => navigate("/premium")}
              className="px-6 py-3 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Crown size={16} /> Nâng cấp Premium
            </button>
          ) : errorObj.type === "auth" ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
            >
              Đăng nhập ngay
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const defaultStream = roomData.streams[0];
  return (
    <div className="h-screen bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-120px) scale(1); opacity: 0; }
        }
        .emoji-float { animation: floatUp 2.5s ease-out forwards; pointer-events: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `,
        }}
      />
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
        <button
          onClick={() => navigate("/showtimes")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm hidden sm:block">Trở về</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-slate-900 text-[15px] font-bold tracking-tight">
            {roomData.movie_name}
          </h1>
          <span className="text-[12px] text-slate-400 font-medium">
            {roomData.episode_name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
          <Radio size={14} className="text-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">
            Live
          </span>
        </div>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-6 max-w-400 mx-auto w-full">
        <div className="flex-1 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2.5 flex flex-col relative">
          <div className="flex-1 bg-black rounded-[24px] overflow-hidden relative shadow-inner">
            <div className="absolute inset-0">
              {defaultStream.link_m3u8 ? (
                <VideoPlayer
                  url={defaultStream.link_m3u8}
                  startTime={roomData.current_offset || 0}
                  isPremiere={true}
                />
              ) : (
                <iframe
                  src={defaultStream.link_embed}
                  className="w-full h-full"
                  allowFullScreen
                  title="embed"
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-100 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col shrink-0 h-[50vh] lg:h-auto relative overflow-hidden">
          <div className="h-17 border-b border-slate-50 flex items-center justify-between px-6 shrink-0 bg-white z-10">
            <div>
              <h3 className="text-slate-900 text-[15px] font-bold tracking-tight">
                Thảo luận
              </h3>
              <p className="text-[12px] text-slate-400 font-medium">
                Cộng đồng DevChill
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <Users size={14} />
              <span className="text-[12px] font-semibold">99+</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar relative z-0 bg-[#FCFCFD]">
            {messages.map((msg) => {
              const isMe = msg.user === (currentUser?.username || "Bạn");
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSystem ? "items-center" : isMe ? "items-end" : "items-start"}`}
                >
                  {msg.isSystem ? (
                    <span className="text-[11px] font-medium bg-white text-slate-400 px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                      {msg.text}
                    </span>
                  ) : (
                    <div
                      className={`flex flex-col gap-1 max-w-[85%] ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[11px] font-bold text-slate-400 px-1">
                        {isMe ? "Bạn" : msg.user}
                      </span>
                      <div
                        className={`text-[14px] px-4 py-3 leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-slate-900 text-white rounded-[20px] rounded-tr-lg"
                            : "bg-white border border-slate-100 text-slate-700 rounded-[20px] rounded-tl-lg"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />

            {floatingEmojis.map((item) => (
              <div
                key={item.id}
                className="absolute bottom-4 text-3xl emoji-float filter drop-shadow-md"
                style={{ left: `${item.left}%` }}
              >
                {item.icon}
              </div>
            ))}
          </div>

          <div className="bg-white shrink-0 z-10 pb-2">
            <div className="flex items-center px-4 py-2 bg-transparent">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleDropEmoji(emoji)}
                  className="flex-1 h-10 flex items-center justify-center hover:bg-slate-50 hover:scale-110 rounded-xl transition-all text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="px-4 pb-4 pt-1 relative flex items-center"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập bình luận..."
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl pl-5 pr-14 py-3.5 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-6 p-2 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-black transition-colors shadow-sm"
              >
                <Send size={16} className="-ml-0.5 mt-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
