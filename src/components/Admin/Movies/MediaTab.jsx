import {
  FaPlus,
  FaPlayCircle,
  FaFilm,
  FaListUl,
  FaServer,
  FaLink,
  FaImage,
} from "react-icons/fa";
import MediaInput from "../../MediaInput";
import Input from "../../Input";
import Select from "../../Select";
const SERVER_OPTIONS = [
  { label: "-- Chọn server --", value: "" },
  { label: "#Hà Nội (Vietsub)", value: "#Hà Nội (Vietsub)" },
  { label: "#Hà Nội (Lồng Tiếng)", value: "#Hà Nội (Lồng Tiếng)" },
  { label: "#Hà Nội (Thuyết Minh)", value: "#Hà Nội (Thuyết Minh)" },
];

const LANG_OPTIONS = [
  { label: "-- Chọn ngôn ngữ --", value: "" },
  { label: "Vietsub", value: "vietsub" },
  { label: "Dub", value: "dub" },
  { label: "Raw", value: "raw" },
];

export default function MediaTab({
  edit,
  handleChange,
  handleFileChange,
  addEpisode,
  updateEpisode,
  addStream,
  updateStream,
}) {
  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex items-center gap-2.5">
          <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
            <FaFilm size={14} />
          </div>
          <h3 className="text-base font-bold text-slate-700 tracking-tight">
            Thông tin Media
          </h3>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4 hover:border-blue-200 transition-colors">
              <MediaInput
                label="Poster"
                mode={edit.poster_mode}
                onChange={(v) => handleChange("poster_url", v)}
                onFile={(f) => handleFileChange("poster_url", f)}
                onMode={(v) => handleChange("poster_mode", v)}
              />
              {edit.poster_url && (
                <div className="relative mt-4 flex justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-blue-300 transition-colors">
                  <img
                    src={edit.poster_url}
                    alt="poster"
                    className="w-28 h-40 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                      <FaImage className="text-blue-500" /> Poster Preview
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="group bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4 hover:border-blue-200 transition-colors">
              <MediaInput
                label="Thumbnail"
                mode={edit.thumb_mode}
                onChange={(v) => handleChange("thumb_url", v)}
                onFile={(f) => handleFileChange("thumb_url", f)}
                onMode={(v) => handleChange("thumb_mode", v)}
              />
              {edit.thumb_url && (
                <div className="relative mt-4 flex justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-blue-300 transition-colors">
                  <img
                    src={edit.thumb_url}
                    alt="thumb"
                    className="w-full max-w-50 h-28 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                      <FaImage className="text-blue-500" /> Thumb Preview
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 hover:border-red-200 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <FaPlayCircle className="text-red-500" size={16} />
              <span className="text-sm font-bold text-slate-700">
                Trailer URL
              </span>
            </div>
            <Input
              value={edit.trailer_url || ""}
              onChange={(v) => handleChange("trailer_url", v)}
              placeholder="VD: https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100/50 rounded-lg text-indigo-600">
              <FaListUl size={14} />
            </div>
            <h3 className="text-base font-bold text-slate-700 tracking-tight">
              Danh sách Tập phim
            </h3>
          </div>
          <button
            type="button"
            onClick={addEpisode}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl 
            bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 
            transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <FaPlus size={12} /> Thêm tập mới
          </button>
        </div>

        <div className="p-6 space-y-6 bg-slate-50/30">
          {edit.episodes?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <FaListUl size={20} />
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Chưa có tập phim nào.
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Hãy nhấn "Thêm tập mới" để bắt đầu.
              </p>
            </div>
          )}

          {edit.episodes?.map((ep, i) => (
            <div
              key={i}
              className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden hover:border-indigo-300 transition-colors"
            >
              <div className="bg-linear-to-r from-indigo-50/50 to-white border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-full">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    Thông tin tập phim
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input
                    label="Season"
                    value={ep.season || ""}
                    onChange={(v) => updateEpisode(i, "season", v)}
                    placeholder="VD: 1"
                  />
                  <Input
                    label="Tập số"
                    value={ep.episode_number || ""}
                    onChange={(v) => updateEpisode(i, "episode_number", v)}
                    placeholder="VD: 1, 2, 3..."
                  />
                  <Input
                    label="Tên tập (Không bắt buộc)"
                    value={ep.name || ""}
                    onChange={(v) => updateEpisode(i, "name", v)}
                    placeholder="VD: Khởi đầu mới"
                  />
                </div>
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaServer className="text-slate-400" size={14} />
                    <span className="text-sm font-bold text-slate-700">
                      Nguồn phát (Streams)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {ep.streams?.map((s, j) => (
                      <div
                        key={j}
                        className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-5 relative group hover:border-blue-200 transition-colors"
                      >
                        <div className="absolute -top-3 -left-3 bg-white border border-slate-200 text-slate-600 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                          {j + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <Select
                            label="Server"
                            value={s.server_name || ""}
                            options={SERVER_OPTIONS}
                            onChange={(v) =>
                              updateStream(i, j, "server_name", v)
                            }
                          />
                          <Input
                            label="Chất lượng"
                            value={s.quality || ""}
                            onChange={(v) => updateStream(i, j, "quality", v)}
                            placeholder="VD: 1080p, 720p..."
                          />
                          <Select
                            label="Ngôn ngữ"
                            value={s.lang || ""}
                            options={LANG_OPTIONS}
                            onChange={(v) => updateStream(i, j, "lang", v)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                              <FaLink className="text-slate-400" /> Embed URL
                            </label>
                            <Input
                              value={s.link_embed || ""}
                              onChange={(v) =>
                                updateStream(i, j, "link_embed", v)
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                              <FaLink className="text-slate-400" /> M3U8 URL
                            </label>
                            <Input
                              value={s.link_m3u8 || ""}
                              onChange={(v) =>
                                updateStream(i, j, "link_m3u8", v)
                              }
                              placeholder="https://...m3u8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addStream(i)}
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all w-full active:scale-[0.99]"
                  >
                    <FaPlus size={12} /> Thêm nguồn phát (Add Stream)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
