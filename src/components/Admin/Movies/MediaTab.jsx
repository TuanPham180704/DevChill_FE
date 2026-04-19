import { FaPlus } from "react-icons/fa";
import MediaInput from "../../MediaInput";
import Input from "../../Input";
import Select from "../../Select";

/* ===== PRESET ===== */
const SERVER_OPTIONS = [
  { label: "-- Chọn server --", value: "" }, 
  { label: "#Hà Nội (Vietsub)", value: "hn_vietsub" },
  { label: "#Hà Nội (Lồng Tiếng)", value: "hn_dub" },
  { label: "#Hà Nội (Thuyết Minh)", value: "hn_voice" },
  { label: "Hà Nội (Vietsub)", value: "hn_vietsub_2" },
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
    <div className="space-y-4">
      <MediaInput
        label="Poster"
        mode={edit.poster_mode}
        onChange={(v) => handleChange("poster_url", v)}
        onFile={(f) => handleFileChange("poster_url", f)}
        onMode={(v) => handleChange("poster_mode", v)}
      />
      {edit.poster_url && (
        <img src={edit.poster_url} alt="poster" className="w-32 mt-2 rounded" />
      )}
      <MediaInput
        label="Thumb"
        mode={edit.thumb_mode}
        onChange={(v) => handleChange("thumb_url", v)}
        onFile={(f) => handleFileChange("thumb_url", f)}
        onMode={(v) => handleChange("thumb_mode", v)}
      />
      {edit.thumb_url && (
        <img src={edit.thumb_url} alt="thumb" className="w-32 mt-2 rounded" />
      )}
      <Input
        label="Trailer"
        value={edit.trailer_url || ""}
        onChange={(v) => handleChange("trailer_url", v)}
      />
      <div>
        <h3 className="font-bold mb-2">Episodes</h3>

        {edit.episodes?.map((ep, i) => (
          <div key={i} className="border p-3 mb-3 rounded">
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Season"
                value={ep.season || ""}
                onChange={(v) => updateEpisode(i, "season", v)}
              />
              <Input
                label="Episode"
                value={ep.episode_number || ""}
                onChange={(v) => updateEpisode(i, "episode_number", v)}
              />
              <Input
                label="Name"
                value={ep.name || ""}
                onChange={(v) => updateEpisode(i, "name", v)}
              />
            </div>
            {ep.streams?.map((s, j) => (
              <div key={j} className="grid grid-cols-3 gap-2 mt-3">
                <Select
                  label="Server Name"
                  value={s.server_name || ""}
                  options={SERVER_OPTIONS}
                  onChange={(v) => updateStream(i, j, "server_name", v)}
                />
                <Input
                  label="Quality"
                  value={s.quality || ""}
                  onChange={(v) => updateStream(i, j, "quality", v)}
                />
                <Select
                  label="Lang"
                  value={s.lang || ""}
                  options={LANG_OPTIONS}
                  onChange={(v) => updateStream(i, j, "lang", v)}
                />
                <Input
                  label="Embed"
                  value={s.link_embed || ""}
                  onChange={(v) => updateStream(i, j, "link_embed", v)}
                />
                <Input
                  label="M3U8"
                  value={s.link_m3u8 || ""}
                  onChange={(v) => updateStream(i, j, "link_m3u8", v)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addStream(i)}
              className="text-blue-500 flex items-center gap-1 mt-2"
            >
              <FaPlus /> Add Stream
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEpisode}
          className="text-green-500 flex items-center gap-1"
        >
          <FaPlus /> Add Episode
        </button>
      </div>
    </div>
  );
}
