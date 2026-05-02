/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Pencil,
  Play,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { askDevChillAI } from "../../api/aiAPI";

export default function DevChillBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const sessionKey = token ? `devchill_chat_user` : `devchill_chat_guest`;

  useEffect(() => {
    const savedChat = localStorage.getItem(sessionKey);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages([
        {
          id: Date.now(),
          sender: "bot",
          type: "text",
          content:
            "Chào bạn! Mình là AI của DevChill. Bạn muốn mở phim hay tìm phim gì hôm nay?",
        },
      ]);
    }
  }, [sessionKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(sessionKey, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, sessionKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    localStorage.removeItem(sessionKey);
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: "Đã làm mới cuộc trò chuyện. Mình bắt đầu lại nhé!",
      },
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      type: "text",
      content: message.trim(),
    };
    const chatHistory = messages.slice(-6).map((m) => {
      let text = m.content || "";
      if (m.type === "movies" && m.payload) {
        const movieNames = m.payload.map((p) => p.name || p.title).join(", ");
        text = `[Hệ thống đã trả về danh sách phim: ${movieNames}]`;
      }
      return {
        role: m.sender === "user" ? "user" : "assistant",
        content: text,
      };
    });

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await askDevChillAI(userMsg.content, chatHistory);
      let botMsg = { id: Date.now() + 1, sender: "bot" };

      if (response.action === "redirect_play") {
        botMsg.type = "text";
        botMsg.content = response.message;
        setMessages((prev) => [...prev, botMsg]);

        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/watch/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "redirect_detail") {
        botMsg.type = "text";
        botMsg.content = response.message;
        setMessages((prev) => [...prev, botMsg]);

        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "ask_user") {
        botMsg.type = "text";
        botMsg.content = response.message;
      } else if (response.action === "show_detail") {
        botMsg.type = "movies";
        botMsg.content = "Đây là thông tin chi tiết phim bạn cần:";
        botMsg.payload = response.payload;
      } else if (Array.isArray(response)) {
        if (response.length === 0) {
          botMsg.type = "text";
          botMsg.content =
            "Mình đã tìm kỹ nhưng không thấy phim nào khớp. Bạn thử đổi từ khóa xem sao nhé!";
        } else {
          botMsg.type = "movies";
          botMsg.content = "DevChill tìm thấy các kết quả này cho bạn:";
          botMsg.payload = response.slice(0, 10);
        }
      } else {
        botMsg.type = "text";
        botMsg.content = response.message || "Đã xử lý xong yêu cầu của bạn!";
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          type: "text",
          content:
            "Đường truyền tới hệ thống AI đang gián đoạn, bạn chờ chút nhé!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <div
        className={`mb-4 w-87.5 sm:w-100 h-137.5 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-50 opacity-0 translate-y-10 pointer-events-none absolute"
        }`}
      >
        <div className="bg-slate-900 p-4 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px] tracking-wide flex items-center gap-1.5">
                DevChill AI <Sparkles size={14} className="text-yellow-400" />
              </h3>
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Trực tuyến
              </span>
            </div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
              onClick={handleClearChat}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
              title="Làm mới cuộc trò chuyện"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-slate-200 text-slate-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } max-w-[80%]`}
              >
                {msg.content && (
                  <div
                    className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-black border border-slate-200 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}

                {msg.type === "movies" && msg.payload && (
                  <div className="mt-2 space-y-3 w-65 max-h-87.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1">
                    {msg.payload.map((movie, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm"
                      >
                        <img
                          src={
                            movie.thumb_url ||
                            movie.poster_url ||
                            "https://placehold.co/100x150/png"
                          }
                          alt={movie.name}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                        <div className="flex flex-col flex-1 py-0.5 min-w-0">
                          <span
                            className="text-[14px] font-bold text-black line-clamp-1"
                            title={movie.name || movie.title}
                          >
                            {movie.name || movie.title}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            {movie.year || "2024"} •{" "}
                            {movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
                          </span>

                          <div className="mt-auto flex gap-1.5 pt-2">
                            <button
                              onClick={() =>
                                navigate(`/movies/watch/${movie.slug}`)
                              }
                              className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md transition-colors"
                            >
                              <Play size={10} fill="currentColor" /> Phát
                            </button>
                            <button
                              onClick={() => navigate(`/movies/${movie.slug}`)}
                              className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-black text-[10px] font-bold rounded-md transition-colors"
                            >
                              <Info size={10} /> Chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 flex-row items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập yêu cầu của bạn..."
              disabled={isTyping}
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!message.trim() || isTyping}
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300 text-white rounded-xl transition-colors"
            >
              {isTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="ml-0.5" />
              )}
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group animate-floating transition-transform duration-300 ${
          isOpen ? "scale-0 absolute" : "scale-100"
        }`}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl text-white transform group-hover:-translate-y-1 transition-all duration-300 border-2 border-white/10">
          <Sparkles
            size={16}
            className="absolute top-3 right-3 text-yellow-300"
          />
          <Bot size={30} className="text-white" />
        </div>
      </button>
    </div>
  );
}
