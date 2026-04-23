/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useRef } from "react";
import { Send, Users } from "lucide-react";

const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "🔥", "✨"];

export default function ChatRoom({ currentUser, roomData }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Hệ thống",
      text: "Phòng chiếu đã sẵn sàng!",
      isSystem: true,
    },
  ]);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, floatingEmojis]);
  useEffect(() => {
    if (!roomData) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        handleDropEmoji(
          EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)],
        );
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [roomData]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: currentUser?.username || "Bạn",
        text: chatInput,
        isSystem: false,
      },
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
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId));
    }, 2500);
  };

  return (
    <div className="w-full lg:w-100 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col shrink-0 h-[45vh] lg:h-[calc(100vh-112px)] overflow-hidden relative font-sans">
      <div className="h-16 border-b border-slate-50 flex items-center justify-between px-6 shrink-0 bg-white z-20">
        <div>
          <h3 className="text-slate-900 font-bold">Thảo luận</h3>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
          <Users size={14} />
          <span>99+</span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-[#FCFCFD]">
        <div
          ref={chatContainerRef}
          className="absolute inset-0 overflow-y-auto p-6 space-y-5 custom-scrollbar scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isSystem ? "items-center" : "items-end"} relative z-10`}
            >
              {msg.isSystem ? (
                <span className="text-[11px] bg-white text-slate-400 px-4 py-1.5 rounded-full border shadow-sm">
                  {msg.text}
                </span>
              ) : (
                <div className="bg-slate-900 text-white text-[14px] px-4 py-3 rounded-[20px] rounded-tr-sm max-w-[85%] leading-relaxed shadow-md">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="absolute bottom-0 text-[32px] emoji-float filter drop-shadow-lg z-0 pointer-events-none"
              style={{ left: `${item.left}%` }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t border-slate-50 shrink-0 z-20 pb-2">
        <div className="flex items-center px-4 py-1.5 bg-transparent">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleDropEmoji(emoji)}
              className="flex-1 h-10 flex items-center justify-center hover:bg-slate-50 hover:scale-125 rounded-xl transition-all text-xl"
            >
              {emoji}
            </button>
          ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="px-4 pb-2 relative flex items-center"
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-5 pr-14 py-3.5 outline-none font-medium placeholder:text-slate-400 focus:ring-2 ring-slate-200 transition-all"
            placeholder="Nhập bình luận..."
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-6 p-2 bg-slate-900 text-white rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
          >
            <Send size={16} className="-ml-0.5 mt-0.5" />
          </button>
        </form>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatUp {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-150px) scale(1); opacity: 0; }
        }
        .emoji-float { animation: floatUp 2.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
