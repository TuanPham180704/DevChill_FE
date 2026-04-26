/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  X,
  Pencil,
  Clapperboard,
  Calendar,
  Film,
  Video,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getShowtimeByIdAdmin,
  createShowtimeAdmin,
  updateShowtimeAdmin,
} from "../../../api/showtimeAdminApi";
import { getAllMovies, getMovieById } from "../../../api/moviesAdminApi";

export default function ShowtimeModal({
  isOpen,
  showtimeId,
  mode,
  onClose,
  onReload,
}) {
  const [formData, setFormData] = useState({
    movie_id: "",
    episode_id: "",
    start_time: "",
    status: "scheduled",
    is_premiere: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moviesList, setMoviesList] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const formatDateTimeForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMovies();

      if (mode === "create") {
        setFormData({
          movie_id: "",
          episode_id: "",
          start_time: "",
          status: "scheduled",
          is_premiere: true,
        });
        setEpisodesList([]);
        setIsEditing(true);
      } else if (mode === "edit" && showtimeId) {
        fetchShowtimeDetails();
        setIsEditing(false);
      }
    }
  }, [isOpen, showtimeId, mode]);

  const fetchMovies = async () => {
    try {
      const res = await getAllMovies({ limit: 100 });
      setMoviesList(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách phim", err);
      toast.error("Không tải được danh sách phim");
    }
  };

  const fetchShowtimeDetails = async () => {
    try {
      setLoading(true);
      const res = await getShowtimeByIdAdmin(showtimeId);
      const data = res?.data || res;
      setFormData({
        ...data,
        start_time: formatDateTimeForInput(data.start_time),
      });
    } catch (err) {
      toast.error("Lỗi khi lấy chi tiết suất chiếu");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!formData.movie_id) {
        setEpisodesList([]);
        return;
      }

      try {
        setLoadingEpisodes(true);
        const res = await getMovieById(formData.movie_id);
        const movieDetail = res.data;

        if (movieDetail && movieDetail.episodes) {
          setEpisodesList(movieDetail.episodes);
        } else {
          setEpisodesList([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tập:", error);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    fetchEpisodes();
  }, [formData.movie_id]);

  const handleSave = async () => {
    if (!formData.movie_id || !formData.episode_id || !formData.start_time) {
      toast.error("Vui lòng điền đầy đủ Phim, Tập và Giờ chiếu!");
      return;
    }

    try {
      const payload = {
        movie_id: Number(formData.movie_id),
        episode_id: Number(formData.episode_id),
        start_time: new Date(formData.start_time).toISOString(),
        status: formData.status,
        is_premiere:
          formData.is_premiere === true ||
          String(formData.is_premiere) === "true",
      };

      if (mode === "create") {
        await createShowtimeAdmin(payload);
        toast.success("Tạo suất chiếu mới thành công!");
      } else {
        await updateShowtimeAdmin(showtimeId, payload);
        toast.success("Cập nhật suất chiếu thành công!");
      }

      onReload();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Lưu thất bại",
      );
    }
  };

  if (!isOpen) return null;

  const inputStyle =
    "w-full px-4 py-2.5 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border";
  const activeInputStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 cursor-pointer";
  const disabledStyle =
    "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed opacity-80";
  const isLive = formData.status === "live";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Clapperboard size={20} className="text-blue-500" />
            {mode === "create" ? "Tạo Lịch Công Chiếu" : "Chi Tiết & Cập Nhật"}
          </h3>

          <div className="flex items-center gap-2">
            {mode === "edit" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  isEditing
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Pencil size={14} strokeWidth={2.5} />
                {isEditing ? "Đang sửa" : "Chỉnh sửa"}
              </button>
            )}
            {mode === "edit" && (
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 gap-6">
            {mode === "edit" && isEditing && (
              <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-xl flex gap-3 items-start text-[13px]">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p>
                  <strong>Lưu ý:</strong> Giờ kết thúc (End Time) được hệ thống
                  tự tính dựa trên thời lượng phim. Bạn chỉ cần sửa{" "}
                  <strong>Giờ bắt đầu</strong>, hệ thống sẽ tự tịnh tiến thời
                  gian kết thúc.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                  <Film size={14} /> Chọn Phim
                </label>
                <select
                  value={formData.movie_id || ""}
                  disabled={!isEditing || isLive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      movie_id: e.target.value,
                      episode_id: "",
                    })
                  }
                  className={`${inputStyle} h-11 appearance-none ${isEditing && !isLive ? activeInputStyle : disabledStyle}`}
                >
                  <option value="" disabled>
                    -- Vui lòng chọn phim --
                  </option>
                  {moviesList.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.name} {movie.is_premium ? "(VIP)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                  <Video size={14} /> Chọn Tập Phim
                </label>
                <select
                  value={formData.episode_id || ""}
                  disabled={
                    !isEditing ||
                    !formData.movie_id ||
                    loadingEpisodes ||
                    isLive
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, episode_id: e.target.value })
                  }
                  className={`${inputStyle} h-11 appearance-none ${isEditing && formData.movie_id && !isLive ? activeInputStyle : disabledStyle}`}
                >
                  <option value="" disabled>
                    {!formData.movie_id
                      ? "Vui lòng chọn phim trước"
                      : loadingEpisodes
                        ? "Đang tải danh sách tập..."
                        : "-- Chọn tập phim --"}
                  </option>
                  {episodesList.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      {ep.name ? `${ep.name}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                  <Calendar size={14} /> Giờ Bắt Đầu (Start Time)
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_time || ""}
                  disabled={!isEditing || isLive}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  className={`${inputStyle} h-11 ${isEditing && !isLive ? activeInputStyle : disabledStyle}`}
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                  Loại hình chiếu
                </label>
                <select
                  value={formData.is_premiere}
                  disabled={!isEditing || isLive}
                  onChange={(e) =>
                    setFormData({ ...formData, is_premiere: e.target.value })
                  }
                  className={`${inputStyle} h-11 appearance-none ${isEditing && !isLive ? activeInputStyle : disabledStyle}`}
                >
                  <option value={true}>🔥 Công chiếu (Live Premiere)</option>
                  <option value={false}>Chờ Process</option>
                </select>
              </div>
            </div>
            {mode === "edit" && (
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                  Trạng thái suất chiếu
                </label>
                <select
                  value={formData.status}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`${inputStyle} h-11 appearance-none ${isEditing ? activeInputStyle : disabledStyle}`}
                >
                  <option value="scheduled">Sắp chiếu (Scheduled)</option>
                  <option value="live">Đang Live (Live)</option>
                  <option value="ended">Đã kết thúc (Ended)</option>
                  <option value="cancelled">Đã Hủy (Cancelled)</option>
                </select>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-5 h-10 text-[13.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
          >
            Đóng
          </button>
          {(isEditing || mode === "create") && (
            <button
              onClick={handleSave}
              className="px-6 h-10 text-[13.5px] font-bold rounded-xl transition-all bg-slate-800 text-white hover:bg-slate-700 shadow-md shadow-slate-200"
            >
              {mode === "create" ? "Tạo Lịch Chiếu" : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
