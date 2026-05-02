/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RefreshCw,
  Play,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { askDevChillAI } from "../../api/aiAPI";
import { getToken } from "../../utils/auth";
import { getProfile } from "../../api/userAPI";

const INITIAL_OPTIONS = [
  "Gợi ý phim hay",
  "Tư vấn gói Premium",
  "Lỗi thanh toán",
  "Hỗ trợ tài khoản",
];

export default function DevChillBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const [sessionKey, setSessionKey] = useState(() => {
    const t = getToken();
    return t ? `devchill_chat_${t.slice(-15)}` : "devchill_chat_guest";
  });

  const [userName, setUserName] = useState(() => {
    return "bạn";
  });

  const personalizeText = (text) => {
    if (!text || userName.toLowerCase() === "bạn") return text;
    return text
      .replace(/Chào bạn/gi, `Chào ${userName}`)
      .replace(/cho bạn/gi, `cho ${userName}`)
      .replace(/của bạn/gi, `của ${userName}`)
      .replace(/Bạn muốn/g, `${userName} muốn`)
      .replace(/Bạn cần/g, `${userName} cần`)
      .replace(/Bạn chưa/g, `${userName} chưa`)
      .replace(/Bạn kiểm tra/g, `${userName} kiểm tra`)
      .replace(/bạn vui lòng/gi, `${userName} vui lòng`)
      .replace(/bạn chờ/gi, `${userName} chờ`)
      .replace(/bạn xem/gi, `${userName} xem`)
      .replace(/bạn thích/gi, `${userName} thích`);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (getToken()) {
          const data = await getProfile();
          const name =
            data?.username || data?.name || data?.data?.username || "bạn";
          setUserName(name);
        } else {
          setUserName("bạn");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };
    fetchUser();
  }, [sessionKey]);
  useEffect(() => {
    const checkTokenChange = () => {
      const currentToken = getToken();
      const newKey = currentToken
        ? `devchill_chat_${currentToken.slice(-15)}`
        : "devchill_chat_guest";

      if (newKey !== sessionKey) {
        setSessionKey(newKey);
      }
    };

    checkTokenChange();
    window.addEventListener("storage", checkTokenChange);
    const interval = setInterval(checkTokenChange, 1000);

    return () => {
      window.removeEventListener("storage", checkTokenChange);
      clearInterval(interval);
    };
  }, [sessionKey]);
  useEffect(() => {
    const savedChat = localStorage.getItem(sessionKey);
    const displayDanhXung = userName && userName !== "bạn" ? userName : "bạn";

    if (savedChat) {
      let parsed = JSON.parse(savedChat);
      if (parsed.length > 0 && parsed[0].sender === "bot" && parsed[0].id) {
        parsed[0].content = `Chào ${userName || "bạn"}! Mình là AI của DevChill. ${displayDanhXung} đang cần hỗ trợ vấn đề gì nào?`;
        if (parsed.length === 1) {
          parsed[0].options = INITIAL_OPTIONS;
        }
      }
      setMessages(parsed);
    } else {
      setMessages([
        {
          id: Date.now(),
          sender: "bot",
          type: "text",
          content: `Chào ${userName || "bạn"}! Mình là AI của DevChill. ${displayDanhXung} đang cần hỗ trợ vấn đề gì nào?`,
          options: INITIAL_OPTIONS,
        },
      ]);
    }
  }, [sessionKey, userName]);
  useEffect(() => {
    if (messages.length > 0) {
      const messagesToSave = messages.map((m) => ({
        ...m,
        options: undefined,
      }));
      localStorage.setItem(sessionKey, JSON.stringify(messagesToSave));
    }
    scrollToBottom();
  }, [messages, sessionKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    localStorage.removeItem(sessionKey);
    const displayDanhXung = userName !== "bạn" ? userName : "Bạn";
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: ` Chào ${userName} đang cần hỗ trợ gì nào?`,
        options: INITIAL_OPTIONS,
      },
    ]);
  };

  const handleActionSend = async (textToProcess) => {
    if (!textToProcess.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      type: "text",
      content: textToProcess.trim(),
    };

    let currentMessages = [];

    setMessages((prev) => {
      currentMessages = [...prev];
      return [...prev.map((m) => ({ ...m, options: undefined })), userMsg];
    });

    setIsTyping(true);

    const chatHistory = currentMessages.slice(-6).map((m) => {
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

    try {
      const response = await askDevChillAI(userMsg.content, chatHistory);
      let botMsg = { id: Date.now() + 1, sender: "bot" };

      if (response.action === "redirect_play") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/watch/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "redirect_detail") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "redirect_premium") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/premium`);
        }, 2000);
        return;
      }

      if (response.action === "redirect_support") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/profile/support`);
        }, 2000);
        return;
      }

      if (response.action === "ask_user") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
      } else if (response.action === "show_detail") {
        botMsg.type = "movies";
        botMsg.content = "Đây là thông tin chi tiết phim bạn cần:";
        botMsg.payload = response.payload;
      } else if (response.action === "suggest_movies") {
        botMsg.type = "movies";
        botMsg.content = personalizeText(response.message);
        botMsg.payload = response.payload;
        botMsg.watchedMovie = response.watchedMovie;
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
        botMsg.content =
          personalizeText(response.message) || "Đã xử lý xong yêu cầu của bạn!";
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = message;
    setMessage("");
    handleActionSend(text);
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
        {/* HEADER */}
        <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-slate-800 font-bold text-[15px] tracking-wide flex items-center gap-1.5">
                DevChill AI <Sparkles size={14} className="text-blue-500" />
              </h3>
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Trực tuyến
              </span>
            </div>
          </div>

          <div className="flex gap-2 relative z-10">
            <button
              onClick={handleClearChat}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-blue-100 hover:text-blue-700 transition-all"
              title="Làm mới cuộc trò chuyện"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-blue-100 hover:text-red-500 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
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
                {msg.options && (
                  <div className="mt-3 flex flex-col items-start gap-2 pr-1 w-full">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionSend(opt)}
                        disabled={isTyping}
                        className="px-4 py-2 bg-white text-blue-600 text-[13px] font-semibold rounded-xl border border-blue-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all disabled:opacity-50 text-left w-fit"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "movies" && (
                  <div className="mt-2 space-y-3 w-65 pr-1">
                    {msg.watchedMovie && (
                      <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-200 shadow-sm flex gap-3 mb-4">
                        <img
                          src={
                            msg.watchedMovie.thumb_url ||
                            "https://placehold.co/100x150/png"
                          }
                          alt={msg.watchedMovie.movie_name}
                          className="w-12 h-16 object-cover rounded-md border border-blue-100"
                        />
                        <div className="flex flex-col flex-1 py-0.5 justify-center">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Play size={10} fill="currentColor" /> Phim{" "}
                            {userName !== "bạn" ? userName : "bạn"} vừa cày
                          </span>
                          <span className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-tight">
                            {msg.watchedMovie.movie_name}
                          </span>
                        </div>
                      </div>
                    )}

                    {msg.payload &&
                      msg.payload.map((movie, idx) => (
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
                                onClick={() =>
                                  navigate(`/movies/${movie.slug}`)
                                }
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
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:hover:bg-slate-300 text-white rounded-xl transition-colors"
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

        <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl text-white transform group-hover:-translate-y-1 transition-all duration-300 border-2 border-white/10">
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
