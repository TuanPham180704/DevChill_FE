import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showtimesApi } from "../../../api/showtimeApi";
import { CalendarDays, Crown, Clock, Film } from "lucide-react";

const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ShowtimesSchedule() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString(new Date()),
  );
  const getWeekDays = () => {
    const curr = new Date();
    const first =
      curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const todayStr = getLocalDateString(new Date());

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(curr.setDate(first + i));
      const dateStr = getLocalDateString(date);
      return {
        dateStr,
        dayName: i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`,
        shortDate: `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`,
        isToday: dateStr === todayStr,
      };
    });
  };
  const weekDays = getWeekDays();

  const fetchShowtimes = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await showtimesApi.getAllPublic();
      if (res.success) setShowtimes(res.data);
    } catch (error) {
      console.error("Lỗi tải lịch chiếu", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
    const interval = setInterval(() => fetchShowtimes(true), 60000);
    return () => clearInterval(interval);
  }, []);
  const filteredShowtimes = showtimes.filter((item) => {
    return getLocalDateString(new Date(item.start_time)) === selectedDate;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-b from-blue-100/60 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>

      <div className="max-w-5xl mx-auto px-5 pt-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-5 text-gray-800">
            <CalendarDays size={26} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0B1221] tracking-tight mb-3">
            Lịch Phát Sóng
          </h1>
          <p className="text-gray-500 font-medium text-[15px] max-w-md">
            Khám phá các khung giờ công chiếu nội dung độc quyền và phim bộ mới
            nhất trên hệ thống.
          </p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-6 mb-10 custom-scrollbar justify-start md:justify-center px-2">
          {weekDays.map((day) => {
            const isActive = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`relative shrink-0 flex flex-col items-center justify-center w-25 h-25 rounded-3xl transition-all duration-300 border ${
                  isActive
                    ? "bg-[#0B1221] border-[#0B1221] text-white shadow-[0_10px_20px_rgba(11,18,33,0.2)] -translate-y-1"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                {day.isToday && !isActive && (
                  <div className="absolute -top-2 bg-blue-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    Hôm nay
                  </div>
                )}

                <span
                  className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${isActive ? "text-gray-400" : "text-gray-400"}`}
                >
                  {day.dayName}
                </span>
                <span
                  className={`text-2xl font-black tracking-tight ${isActive ? "text-white" : "text-gray-900"}`}
                >
                  {day.shortDate}
                </span>

                {isActive && day.isToday && (
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                )}
              </button>
            );
          })}
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-[#0B1221] rounded-full animate-spin"></div>
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center">
            <Film size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
            <p className="text-gray-800 font-bold text-lg">
              Không có lịch chiếu
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Hôm nay không có nội dung nào được lên lịch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredShowtimes.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/showtimes/${movie.id}`)}
                className="group bg-white rounded-[28px] p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex gap-5"
              >
                {/* Poster Card */}
                <div className="w-30 h-42.5 rounded-2xl overflow-hidden shrink-0 relative bg-gray-100 shadow-inner">
                  <img
                    src={movie.poster_url}
                    alt={movie.movie_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {movie.movie_is_premium && (
                    <div className="absolute top-2 left-2 bg-linear-to-r from-yellow-400 to-amber-500 px-2 py-1 rounded-lg shadow-md flex items-center gap-1 border border-yellow-300/50">
                      <Crown size={12} className="text-white drop-shadow-sm" />
                      <span className="text-[10px] font-black text-white drop-shadow-sm tracking-wide">
                        VIP
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="flex flex-col py-2 pr-2 justify-between flex-1">
                  <div>
                    {movie.status === "live" ? (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">
                          Đang phát
                        </span>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border border-gray-100 bg-gray-50 px-2.5 py-1 rounded-md">
                          Sắp chiếu
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-[#0B1221] leading-tight mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {movie.movie_name}
                    </h3>
                    <p className="text-[13px] text-gray-500 font-medium">
                      {movie.episode_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 bg-gray-50 w-max px-3 py-1.5 rounded-xl border border-gray-100/50">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-[14px] font-bold text-gray-700 tracking-tight">
                      {new Date(movie.start_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
