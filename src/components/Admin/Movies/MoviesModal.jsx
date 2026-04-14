
import { useEffect, useState } from "react";
import { FaTimes, FaSave, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getMovieById,
  updateMovieInfo,
  updateMovieMeta,
  updateMovieMedia,
  updateMovieSetting,
} from "../../../api/moviesApi";

const TAB = {
  INFO: "info",
  META: "meta",
  MEDIA: "media",
  SETTING: "setting",
};

export default function MoviesModal({ movieId, onClose, onReload }) {
  const [activeTab, setActiveTab] = useState(TAB.INFO);
  const [movie, setMovie] = useState(null);

  const [edit, setEdit] = useState({});

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const res = await getMovieById(movieId);
      setMovie(res.data);
      setEdit(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Load movie failed");
    }
  };

  const handleChange = (field, value) => {
    setEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (activeTab === TAB.INFO) {
        await updateMovieInfo(movieId, {
          name: edit.name,
          origin_name: edit.origin_name,
          content: edit.content,
          type: edit.type,
          contract_id: edit.contract_id,
          year: edit.year,
          duration: edit.duration,
          episode_total: edit.episode_total,
          created_by: edit.created_by,
        });
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
          is_available: edit.is_available,
          is_premium: edit.is_premium,
          source: edit.source,
          tmdb_id: edit.tmdb_id,
        });
      }

      toast.success("Updated successfully");
      fetchMovie();
      onReload();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[1100px] h-[650px] rounded-xl flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Movie Detail</h2>
          <FaTimes className="cursor-pointer" onClick={onClose} />
        </div>

        {/* TAB */}
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

        {/* CONTENT FIX HEIGHT */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === TAB.INFO && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={edit.name}
                onChange={(v) => handleChange("name", v)}
              />
              <Input
                label="Origin"
                value={edit.origin_name}
                onChange={(v) => handleChange("origin_name", v)}
              />
              <Input
                label="Type"
                value={edit.type}
                onChange={(v) => handleChange("type", v)}
              />
              <Input
                label="Year"
                value={edit.year}
                onChange={(v) => handleChange("year", v)}
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
              <Input
                label="Contract"
                value={edit.contract_id}
                onChange={(v) => handleChange("contract_id", v)}
              />
              <Input
                label="Created By"
                value={edit.created_by}
                onChange={(v) => handleChange("created_by", v)}
              />
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
              <Input
                label="Poster"
                value={edit.poster_url}
                onChange={(v) => handleChange("poster_url", v)}
              />
              <Input
                label="Thumb"
                value={edit.thumb_url}
                onChange={(v) => handleChange("thumb_url", v)}
              />
              <Input
                label="Trailer"
                value={edit.trailer_url}
                onChange={(v) => handleChange("trailer_url", v)}
              />

              {/* EPISODES */}
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

                    <div className="mt-2">
                      {ep.streams?.map((s, j) => (
                        <div key={j} className="grid grid-cols-3 gap-2 mb-2">
                          <Input
                            label="Server"
                            value={s.server_id}
                            onChange={(v) => updateStream(i, j, "server_id", v)}
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
                            onChange={(v) =>
                              updateStream(i, j, "link_embed", v)
                            }
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
                        className="text-blue-500"
                      >
                        <FaPlus /> Add Stream
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={addEpisode} className="text-green-500">
                  <FaPlus /> Add Episode
                </button>
              </div>
            </div>
          )}

          {activeTab === TAB.SETTING && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Status"
                value={edit.status}
                onChange={(v) => handleChange("status", v)}
              />
              <Input
                label="Source"
                value={edit.source}
                onChange={(v) => handleChange("source", v)}
              />
              <Input
                label="TMDB"
                value={edit.tmdb_id}
                onChange={(v) => handleChange("tmdb_id", v)}
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

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
          >
            <FaSave /> Lưu
          </button>
        </div>
      </div>
    </div>
  );

  function addEpisode() {
    handleChange("episodes", [
      ...(edit.episodes || []),
      { season: 1, episode_number: 1, name: "", streams: [] },
    ]);
  }

  function updateEpisode(i, field, value) {
    const eps = [...edit.episodes];
    eps[i][field] = value;
    handleChange("episodes", eps);
  }

  function addStream(i) {
    const eps = [...edit.episodes];
    eps[i].streams.push({
      server_id: "",
      quality: "",
      lang: "",
      link_embed: "",
      link_m3u8: "",
    });
    handleChange("episodes", eps);
  }

  function updateStream(i, j, field, value) {
    const eps = [...edit.episodes];
    eps[i].streams[j][field] = value;
    handleChange("episodes", eps);
  }
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
    <div className="col-span-2">
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
      <button onClick={add} className="text-blue-500">
        <FaPlus /> Add
      </button>
    </div>
  );
}
