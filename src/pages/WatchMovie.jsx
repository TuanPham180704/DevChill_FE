import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { watchMovie } from "../api/moviesPublicApi";

export default function WatchMovie() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const ep = Number(searchParams.get("ep") || 1);
  const server = searchParams.get("server");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const res = await watchMovie(slug, {
          ep,
          server,
        });
        const payload = res?.data?.data || res?.data;

        if (payload?.locked) {
          setData(payload);
          return;
        }
        setData(payload);
        const streams = payload?.streams || [];
        const defaultStream =
          streams.find((s) => String(s.id) === String(server)) ||
          payload.currentStream ||
          null;

        setSelectedStream(defaultStream);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, ep, server]);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        Not found
      </div>
    );
  }

  if (data.locked) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-center">
        <h1 className="text-2xl font-semibold mb-2">🔒 Nội dung bị khóa</h1>
        <p className="text-gray-500 mb-6">{data.message}</p>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-black text-white rounded-full"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const movie = data.movie;
  const episode = data.episode;
  const episodes = data.episodes || [];
  const streams = data.streams || [];

  const changeServer = (stream) => {
    setSelectedStream(stream);

    setSearchParams({
      ep,
      server: stream.id,
    });
  };

  const changeEpisode = (newEp) => {
    setSearchParams({
      ep: newEp,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full bg-black aspect-video relative">
        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">
            Loading stream...
          </div>
        )}

        {selectedStream?.link_embed ? (
          <iframe
            src={selectedStream.link_embed}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <video
            src={selectedStream?.link_m3u8}
            controls
            className="w-full h-full"
          />
        )}
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{movie.name}</h1>

            <p className="text-gray-500 text-sm mt-1">
              {episode.name} • Tập {episode.episode_number}
            </p>
          </div>
          <button
            onClick={() => navigate(`/movies/${movie.slug}`)}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            ← Chi tiết phim
          </button>
        </div>
        <div className="bg-gray-50 border rounded-2xl p-5 space-y-3">
          <h3 className="text-sm text-gray-600">Chọn tập</h3>
          <div className="grid grid-cols-10 gap-2">
            {episodes.map((epItem) => (
              <button
                key={epItem.id}
                onClick={() => changeEpisode(epItem.episode_number)}
                className={`py-2 rounded text-sm border transition ${
                  epItem.episode_number === ep
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {epItem.name}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 border rounded-2xl p-5 space-y-3">
          <h3 className="text-sm text-gray-600">Chọn server</h3>

          <div className="flex flex-wrap gap-2">
            {streams.map((s) => (
              <button
                key={s.id}
                onClick={() => changeServer(s)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  selectedStream?.id === s.id
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {s.server_name}
              </button>
            ))}
          </div>
        </div>
        {selectedStream && (
          <div className="text-sm text-gray-500 flex flex-wrap gap-4">
            <span>🎬 Quality: {selectedStream.quality}</span>
            <span>🌐 Lang: {selectedStream.lang}</span>
          </div>
        )}
      </div>
    </div>
  );
}
