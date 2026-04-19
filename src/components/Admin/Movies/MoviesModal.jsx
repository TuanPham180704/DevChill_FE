/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
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

import InfoTab from "./InfoTab";
import MetaTab from "./MetaTab";
import MediaTab from "./MediaTab";
import SettingTab from "./SettingTab";

const TAB = {
  INFO: "info",
  META: "meta",
  MEDIA: "media",
  SETTING: "setting",
};

export default function MoviesModal({
  movieId,
  mode = "edit",
  onClose,
  onReload,
}) {
  const [activeTab, setActiveTab] = useState(TAB.INFO);
  const [movie, setMovie] = useState(null);
  const [edit, setEdit] = useState({});
  const [contracts, setContracts] = useState([]);
  const [errors, setErrors] = useState({});

  const streamLocks = useRef({});
  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (mode === "edit" && movieId) {
      fetchMovie();
    }

    if (mode === "create") {
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
        poster_url: "",
        thumb_url: "",
        trailer_url: "",
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
  const cleanEpisodes = (episodes = []) =>
    episodes
      .map((ep) => {
        const season = Number(ep.season);
        const episode_number = Number(ep.episode_number);

        if (Number.isNaN(season) || Number.isNaN(episode_number)) return null;

        const streams = (ep.streams || [])
          .map((s) => ({
            server_name: s.server_name || "",
            quality: s.quality || "",
            lang: s.lang || "",
            link_embed: s.link_embed || "",
            link_m3u8: s.link_m3u8 || "",
          }))
          .filter((s) => s.link_embed || s.link_m3u8);

        return streams.length
          ? { season, episode_number, name: ep.name, streams }
          : null;
      })
      .filter(Boolean);
  const handleChange = (field, value) => {
    setEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(field, reader.result);
    };
    reader.readAsDataURL(file);
  };
  const addEpisode = () => {
    setEdit((prev) => ({
      ...prev,
      episodes: [
        ...(prev.episodes || []),
        {
          season: 1,
          episode_number: 1,
          name: "",
          streams: [],
        },
      ],
    }));
  };

  const updateEpisode = (i, field, value) => {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      eps[i] = { ...eps[i], [field]: value };
      return { ...prev, episodes: eps };
    });
  };

  const addStream = (i) => {
    if (streamLocks.current[i]) return;

    streamLocks.current[i] = true;

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

    setTimeout(() => {
      streamLocks.current[i] = false;
    }, 0);
  };

  const updateStream = (i, j, field, value) => {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      const streams = [...(eps[i].streams || [])];

      streams[j] = { ...streams[j], [field]: value };
      eps[i] = { ...eps[i], streams };

      return { ...prev, episodes: eps };
    });
  };
  const validateInfo = () => {
    const err = {};

    if (!edit.name?.trim()) err.name = "Tên Phim Là Bắt Buộc";
    if (!edit.contract_id) err.contract_id = "Chọn Hợp Đồng Là Bắt Buộc";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (activeTab === TAB.INFO) {
      if (!validateInfo()) return;
      setActiveTab(TAB.META);
    } else if (activeTab === TAB.META) {
      setActiveTab(TAB.MEDIA);
    } else if (activeTab === TAB.MEDIA) {
      setActiveTab(TAB.SETTING);
    }
  };

  const handleSaveAll = async () => {
    try {
      if (!validateInfo()) {
        setActiveTab(TAB.INFO);
        return;
      }
      const cleanedEpisodes = cleanEpisodes(edit.episodes);
      if (mode === "create") {
        await createMovie({
          name: edit.name,
          origin_name: edit.origin_name,
          year: edit.year,
          type: edit.type,
          duration: edit.duration,
          episode_total: edit.episode_total,
          content: edit.content,
          contract_id: edit.contract_id,

          categories: edit.categories,
          countries: edit.countries,
          people: edit.people,

          poster_url: edit.poster_url,
          thumb_url: edit.thumb_url,
          trailer_url: edit.trailer_url,
          episodes: cleanedEpisodes,

          status: edit.status,
          lifecycle_status: edit.lifecycle_status,
          production_status: edit.production_status,
          is_available: edit.is_available,
          is_premium: edit.is_premium,
          source: edit.source,
        });
      } else {
        if (!movieId) {
          toast.error("Thiếu movieId");
          return;
        }
        await updateMovieInfo(movieId, {
          name: edit.name,
          origin_name: edit.origin_name,
          year: edit.year,
          type: edit.type,
          duration: edit.duration,
          episode_total: edit.episode_total,
          content: edit.content,
          contract_id: edit.contract_id,
        });

        await Promise.all([
          updateMovieMeta(movieId, {
            categories: edit.categories,
            countries: edit.countries,
            people: edit.people,
          }),

          updateMovieMedia(movieId, {
            poster_url: edit.poster_url,
            thumb_url: edit.thumb_url,
            trailer_url: edit.trailer_url,
            episodes: cleanedEpisodes,
          }),

          updateMovieSetting(movieId, {
            status: edit.status,
            lifecycle_status: edit.lifecycle_status,
            production_status: edit.production_status,
            is_available: edit.is_available,
            is_premium: edit.is_premium,
            source: edit.source,
          }),
        ]);
      }
      toast.success("Lưu Thành Công");
      if (mode === "edit") {
        await fetchMovie();
      }
      onReload();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Lưu Thất Bại");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-275 h-175 rounded-xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">
            {mode === "create" ? "Create Movie" : "Movie Detail"}
          </h2>
          <FaTimes onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex border-b">
          {Object.values(TAB).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 p-3 ${
                activeTab === t ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === TAB.INFO && (
            <InfoTab
              edit={edit}
              onChange={handleChange}
              contracts={contracts}
              errors={errors}
            />
          )}
          {activeTab === TAB.META && (
            <MetaTab edit={edit} onChange={handleChange} />
          )}
          {activeTab === TAB.MEDIA && (
            <MediaTab
              edit={edit}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              addEpisode={addEpisode}
              updateEpisode={updateEpisode}
              addStream={addStream}
              updateStream={updateStream}
            />
          )}
          {activeTab === TAB.SETTING && (
            <SettingTab edit={edit} onChange={handleChange} />
          )}
        </div>

        <div className="p-4 border-t flex justify-between">
          <button onClick={onClose}>Hủy</button>

          <div className="flex gap-2">
            {activeTab !== TAB.SETTING && (
              <button onClick={handleNext}>Next</button>
            )}

            <button
              onClick={handleSaveAll}
              className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <FaSave /> Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
