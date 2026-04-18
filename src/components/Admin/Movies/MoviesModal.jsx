/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FaTimes, FaSave, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getMovieById,
  updateMovieInfo,
  updateMovieMeta,
  updateMovieMedia,
  updateMovieSetting,
  createMovie,
} from "../../../api/moviesAdminApi";

import { getContracts } from "../../../api/contractApi";

const TAB = {
  INFO: "info",
  META: "meta",
  MEDIA: "media",
  SETTING: "setting",
};

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Hidden", value: "hidden" },
];
const LIFECYCLE_OPTIONS = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];
const PRODUCTION_OPTIONS = [
  { label: "Planning", value: "planning" },
  { label: "Filming", value: "filming" },
  { label: "Post Production", value: "post-production" },
];
export default function MoviesModal({
  movieId,
  mode = "edit",
  onClose,
  onReload,
}) {
  const [activeTab, setActiveTab] = useState(TAB.INFO);
  // eslint-disable-next-line no-unused-vars
  const [movie, setMovie] = useState(null);
  const [edit, setEdit] = useState({});
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchContracts();
  }, []);

  useEffect(() => {
    if (mode === "edit" && movieId) {
      // eslint-disable-next-line react-hooks/immutability
      fetchMovie();
    }

    if (mode === "create") {
      setMovie({});
      setEdit({
        name: "",
        origin_name: "",
        year: "",
        type: "",
        duration: "",
        episode_total: "",
        content: "",
        contract_id: "",
        status: "draft",
        lifecycle_status: "ongoing",
        production_status: "",
        source: "",
        is_available: false,
        is_premium: false,
        categories: [],
        countries: [],
        people: [],
        episodes: [],
        poster_mode: "url",
        thumb_mode: "url",
      });
    }
  }, [movieId, mode]);

  const fetchContracts = async () => {
    try {
      const res = await getContracts();
      setContracts(res.data || []);
    } catch {
      toast.error("Lỗi khi tải hợp đồng");
    }
  };

  const fetchMovie = async () => {
    try {
      const res = await getMovieById(movieId);
      setMovie(res.data);

      setEdit({
        ...res.data,
        poster_mode: "url",
        thumb_mode: "url",
      });
    } catch {
      toast.error("Lỗi khi tải phim");
    }
  };

  const handleChange = (field, value) => {
    setEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (mode === "create") {
        await createMovie(edit);
        toast.success("Thêm Phim Thành Công");
        onReload();
        onClose();
        return;
      }

      if (activeTab === TAB.INFO) {
        await updateMovieInfo(movieId, edit);
      }

      if (activeTab === TAB.META) {
        await updateMovieMeta(movieId, {
          categories: edit.categories,
          countries: edit.countries,
          people: edit.people,
        });
      }

      if (activeTab === TAB.MEDIA) {
        await updateMovieMedia(movieId, {
          poster_url: edit.poster_url,
          thumb_url: edit.thumb_url,
          trailer_url: edit.trailer_url,
          episodes: edit.episodes,
        });
      }

      if (activeTab === TAB.SETTING) {
        await updateMovieSetting(movieId, {
          status: edit.status,
          lifecycle_status: edit.lifecycle_status,
          production_status: edit.production_status,
          is_available: edit.is_available,
          is_premium: edit.is_premium,
          source: edit.source,
        });
      }

      toast.success("Cập Nhật Thành Công");
      fetchMovie();
      onReload();
      onClose();
    } catch {
      toast.error(mode === "create" ? "Create failed" : "Update failed");
    }
  };
  function addEpisode() {
    setEdit((prev) => ({
      ...prev,
      episodes: [
        ...(prev.episodes || []),
        { season: 1, episode_number: 1, name: "", streams: [] },
      ],
    }));
  }

  function updateEpisode(i, field, value) {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      eps[i] = { ...eps[i], [field]: value };
      return { ...prev, episodes: eps };
    });
  }

  function addStream(i) {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];

      eps[i].streams = [
        ...(eps[i].streams || []),
        {
          server_name: "",
          quality: "",
          lang: "",
          link_embed: "",
          link_m3u8: "",
        },
      ];

      return { ...prev, episodes: eps };
    });
  }

  function updateStream(i, j, field, value) {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      const streams = [...(eps[i].streams || [])];

      streams[j] = { ...streams[j], [field]: value };

      eps[i] = { ...eps[i], streams };

      return { ...prev, episodes: eps };
    });
  }
  function handleFileChange(field, file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      handleChange(field, reader.result);
    };

    reader.readAsDataURL(file);
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-275 h-175 rounded-xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {mode === "create" ? "Create Movie" : "Movie Detail"}
          </h2>
          <FaTimes onClick={onClose} className="cursor-pointer" />
        </div>
        <div className="flex border-b">
          {Object.values(TAB).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 p-3 ${activeTab === t ? "bg-gray-200" : ""}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {activeTab === TAB.INFO && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={edit.name}
                onChange={(v) => handleChange("name", v)}
              />

              <Input
                label="Origin Name"
                value={edit.origin_name}
                onChange={(v) => handleChange("origin_name", v)}
              />

              <Input
                label="Year"
                value={edit.year}
                onChange={(v) => handleChange("year", v)}
              />

              <Input
                label="Type"
                value={edit.type}
                onChange={(v) => handleChange("type", v)}
              />

              <Input
                label="Duration"
                value={edit.duration}
                onChange={(v) => handleChange("duration", v)}
              />

              <Input
                label="Episode Total"
                value={edit.episode_total}
                onChange={(v) => handleChange("episode_total", v)}
              />

              <div>
                <label className="text-sm font-semibold">Contract</label>
                <select
                  className="w-full border p-2 mt-1 rounded"
                  value={edit.contract_id || ""}
                  onChange={(e) => handleChange("contract_id", e.target.value)}
                >
                  <option value="">Select contract</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Content"
                value={edit.content}
                onChange={(v) => handleChange("content", v)}
              />
            </div>
          )}
          {activeTab === TAB.META && (
            <div className="space-y-4">
              <MetaInput
                label="Categories"
                data={edit.categories || []}
                onChange={(v) => handleChange("categories", v)}
              />
              <MetaInput
                label="Countries"
                data={edit.countries || []}
                onChange={(v) => handleChange("countries", v)}
              />
              <MetaInput
                label="People"
                data={edit.people || []}
                hasRole
                onChange={(v) => handleChange("people", v)}
              />
            </div>
          )}
          {activeTab === TAB.MEDIA && (
            <div className="space-y-4">
              <MediaInput
                label="Poster"
                mode={edit.poster_mode}
                onChange={(v) => handleChange("poster_url", v)}
                onFile={(f) => handleFileChange("poster_url", f)}
                onMode={(v) => handleChange("poster_mode", v)}
              />
              {edit.poster_url && (
                <img
                  src={edit.poster_url}
                  alt="poster"
                  className="w-32 mt-2 rounded"
                />
              )}

              <MediaInput
                label="Thumb"
                mode={edit.thumb_mode}
                onChange={(v) => handleChange("thumb_url", v)}
                onFile={(f) => handleFileChange("thumb_url", f)}
                onMode={(v) => handleChange("thumb_mode", v)}
              />
              {edit.thumb_url && (
                <img
                  src={edit.thumb_url}
                  alt="poster"
                  className="w-32 mt-2 rounded"
                />
              )}

              <Input
                label="Trailer"
                value={edit.trailer_url}
                onChange={(v) => handleChange("trailer_url", v)}
              />

              <div>
                <h3 className="font-bold mb-2">Episodes</h3>

                {edit.episodes?.map((ep, i) => (
                  <div key={i} className="border p-3 mb-3 rounded">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Season"
                        value={ep.season}
                        onChange={(v) => updateEpisode(i, "season", v)}
                      />
                      <Input
                        label="Episode"
                        value={ep.episode_number}
                        onChange={(v) => updateEpisode(i, "episode_number", v)}
                      />
                      <Input
                        label="Name"
                        value={ep.name}
                        onChange={(v) => updateEpisode(i, "name", v)}
                      />
                    </div>

                    {ep.streams?.map((s, j) => (
                      <div key={j} className="grid grid-cols-3 gap-2 mt-2">
                        <Input
                          label="Server Name"
                          value={s.server_name}
                          onChange={(v) => updateStream(i, j, "server_name", v)}
                        />
                        <Input
                          label="Quality"
                          value={s.quality}
                          onChange={(v) => updateStream(i, j, "quality", v)}
                        />
                        <Input
                          label="Lang"
                          value={s.lang}
                          onChange={(v) => updateStream(i, j, "lang", v)}
                        />
                        <Input
                          label="Embed"
                          value={s.link_embed}
                          onChange={(v) => updateStream(i, j, "link_embed", v)}
                        />
                        <Input
                          label="M3U8"
                          value={s.link_m3u8}
                          onChange={(v) => updateStream(i, j, "link_m3u8", v)}
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => addStream(i)}
                      className="text-blue-500 flex items-center gap-1 mt-2"
                    >
                      <FaPlus /> Add Stream
                    </button>
                  </div>
                ))}

                <button
                  onClick={addEpisode}
                  className="text-green-500 flex items-center gap-1"
                >
                  <FaPlus /> Add Episode
                </button>
              </div>
            </div>
          )}
          {activeTab === TAB.SETTING && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                value={edit.status}
                options={STATUS_OPTIONS}
                onChange={(v) => handleChange("status", v)}
              />

              <Select
                label="Lifecycle"
                value={edit.lifecycle_status}
                options={LIFECYCLE_OPTIONS}
                onChange={(v) => handleChange("lifecycle_status", v)}
              />

              <Select
                label="Production"
                value={edit.production_status}
                options={PRODUCTION_OPTIONS}
                onChange={(v) => handleChange("production_status", v)}
              />

              <Input
                label="Source"
                value={edit.source}
                onChange={(v) => handleChange("source", v)}
              />
              <Checkbox
                label="Available"
                checked={edit.is_available}
                onChange={(v) => handleChange("is_available", v)}
              />

              <Checkbox
                label="Premium"
                checked={edit.is_premium}
                onChange={(v) => handleChange("is_premium", v)}
              />
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
          >
            <FaSave /> {mode === "create" ? "Create" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        className="w-full border p-2 rounded mt-1"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <textarea
        className="w-full border p-2 rounded mt-1"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </div>
  );
}
function MetaInput({ label, data, onChange, hasRole }) {
  const update = (i, field, value) => {
    const arr = [...data];
    arr[i][field] = value;
    onChange(arr);
  };

  const add = () => {
    onChange([...data, hasRole ? { name: "", role: "actor" } : { name: "" }]);
  };

  return (
    <div>
      <h4 className="font-bold">{label}</h4>

      {data.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="border p-2 flex-1"
            value={item.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          {hasRole && (
            <input
              className="border p-2"
              value={item.role}
              onChange={(e) => update(i, "role", e.target.value)}
            />
          )}
        </div>
      ))}

      <button className="text-blue-500 flex items-center gap-1" onClick={add}>
        <FaPlus /> Add
      </button>
    </div>
  );
}
function MediaInput({ label, value, mode, onChange, onFile, onMode }) {
  return (
    <div>
      <label className="font-semibold">{label}</label>

      <div className="flex gap-2 mt-1">
        <select
          className="border p-2"
          value={mode || "url"}
          onChange={(e) => onMode(e.target.value)}
        >
          <option value="url">URL</option>
          <option value="folder">Folder</option>
        </select>

        {mode === "folder" ? (
          <input
            type="file"
            className="border p-2 flex-1"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        ) : (
          <input
            className="border p-2 flex-1"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
function Select({ label, value, options = [], onChange, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm text-gray-500">{label}</label>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
