/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicMovieBySlug } from "../api/moviesPublicApi";
import { getProfile } from "../api/userApi";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { getToken } from "../utils/auth";

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const EP_PER_PAGE = 10;

  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);

  const [showTrailer, setShowTrailer] = useState(false);

  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await getPublicMovieBySlug(slug);
        const data = movieRes?.data?.data || movieRes?.data;

        setMovie(data);
        if (token) {
          try {
            const profileRes = await getProfile();
            setProfile(profileRes?.data || profileRes);
          } catch (err) {
            console.log("Profile error ignore");
          }
        }

        if (data?.episodes?.length) {
          setSelectedEpisode(data.episodes[0]);
          setSelectedServer(data.episodes[0]?.streams?.[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        Not found
      </div>
    );
  }
  const isPremiumUser = profile?.is_premium === true;
  const handleWatch = () => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để xem phim");
      navigate("/login");
      return;
    }
    if (movie.is_premium && !isPremiumUser) {
      toast.error("Hãy nâng cấp gói premium để thưởng thức phim");
      return;
    }
    navigate(`/movies/watch/${movie.slug}`);
  };
  const isUpcoming = movie.lifecycle_status === "upcoming";
  const episodes = movie.episodes || [];
  const totalPages = Math.ceil(episodes.length / EP_PER_PAGE);
  const start = (currentPage - 1) * EP_PER_PAGE;
  const currentEpisodes = episodes.slice(start, start + EP_PER_PAGE);
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const id = url.split("v=")[1];
    return `https://www.youtube.com/embed/${id}`;
  };
  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="relative h-[78vh] w-full overflow-hidden">
        <img
          src={movie.poster_url}
          className="absolute w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-10 flex flex-col justify-end pb-14">
          <h1 className="text-5xl font-bold text-white">{movie.name}</h1>

          <p className="text-gray-200 mt-2">{movie.origin_name}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowTrailer(true)}
              className="px-6 py-3 bg-white text-black rounded-full font-semibold"
            >
              ▶ Trailer
            </button>

            {!isUpcoming && (
              <button
                onClick={handleWatch}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold"
              >
                Xem phim
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="grid md:grid-cols-3 gap-10">
          <img src={movie.poster_url} className="rounded-xl" />

          <div className="md:col-span-2 space-y-6">
            <p className="text-gray-700">{movie.content}</p>

            <div className="flex flex-wrap gap-2">
              {movie.categories?.map((c) => (
                <span
                  key={c.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <b>Năm:</b> {movie.year}
              </div>
              <div>
                <b>Thời lượng:</b> {movie.duration} phút
              </div>
              <div>
                <b>Số Tập:</b> {movie.episode_total}
              </div>
              <div>
                <b>Quốc gia:</b>{" "}
                {movie.countries?.map((c) => c.name).join(", ")}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Diễn viên</h2>
          <div className="flex flex-wrap gap-2">
            {movie.people?.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {p.name} ({p.role})
              </span>
            ))}
          </div>
        </div>
        {!isUpcoming && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Danh Sách Tập</h2>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {currentEpisodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEpisode(ep);
                    setSelectedServer(ep.streams?.[0]);
                  }}
                  className={`py-2 rounded border ${
                    selectedEpisode?.id === ep.id
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {ep.name}
                </button>
              ))}
            </div>

            {totalPages >= 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="w-[90%] max-w-5xl aspect-video">
            <iframe
              src={getYoutubeEmbed(movie.trailer_url)}
              className="w-full h-full rounded-xl"
              allowFullScreen
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="mt-4 px-5 py-2 bg-red-600 text-white rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
