/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link } from "react-router-dom";
import { Star, ChevronRight, Play } from "lucide-react";
import DevChillApp from "./DevChillApp";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [newestMovies, setNewestMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moviesByCountry, setMoviesByCountry] = useState({});
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const countrySlugs = ["han-quoc", "trung-quoc", "viet-nam"];
  const unwrap = (res) => res?.data?.data ?? res?.data ?? [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [movieRes, cateRes, upcomingRes] = await Promise.all([
          getPublicMovies({ page: 1, limit: 5 }),
          getCategories(),
          getPublicMovies({
            lifecycle_status: "upcoming",
            page: 1,
            limit: 10,
          }),
        ]);

        setNewestMovies(unwrap(movieRes));
        setCategories(unwrap(cateRes));
        setUpcomingMovies(unwrap(upcomingRes));

        // FIX: parallel fetch countries correctly
        const results = await Promise.all(
          countrySlugs.map((slug) =>
            getPublicMovies({
              country: slug,
              page: 1,
              limit: 6,
            }),
          ),
        );

        const countryData = {};
        countrySlugs.forEach((slug, idx) => {
          countryData[slug] = unwrap(results[idx]);
        });

        setMoviesByCountry(countryData);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     SLIDESHOW FIX (IMPORTANT)
  ========================= */
  useEffect(() => {
    if (!newestMovies.length) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        setPrevSlide(prev);
        return (prev + 1) % newestMovies.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [newestMovies.length]);

  const goToSlide = (index) => {
    setPrevSlide(activeSlide);
    setActiveSlide(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-white">
        Đang tải dữ liệu...
      </div>
    );
  }

  const activeMovie = newestMovies[activeSlide];
  const prevMovie = newestMovies[prevSlide];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="relative w-full h-130 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent z-10" />
        {prevMovie && (
          <img
            src={prevMovie.thumb_url || prevMovie.poster_url}
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-700"
          />
        )}
        {activeMovie && (
          <img
            key={activeSlide}
            src={activeMovie.thumb_url || activeMovie.poster_url}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          />
        )}
        {activeMovie && (
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="px-16 max-w-2xl text-white">
              <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
                {activeMovie.name}
              </h1>

              <div className="flex items-center gap-3 text-sm text-white/70 mt-3">
                {activeMovie.year && <span>{activeMovie.year}</span>}
                {activeMovie.duration && (
                  <span>• {activeMovie.duration} phút</span>
                )}
                {activeMovie.episode_total && (
                  <span>• {activeMovie.episode_total} tập</span>
                )}
              </div>

              <p className="text-sm text-white/80 line-clamp-3 mt-4 leading-relaxed">
                {activeMovie.content}
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/movies/${activeMovie.slug}`}
                  className="inline-flex items-center gap-2 bg-red-600 px-6 py-3 rounded-full hover:bg-red-500 transition shadow-lg"
                >
                  <Play size={18} />
                  Xem ngay
                </Link>

                <Link
                  to={`/movies/${activeMovie.slug}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/20 transition"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-6 right-6 z-30 w-85">
          <div
            className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 shadow-2xl grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(
                newestMovies.length,
                5,
              )}, 1fr)`,
            }}
          >
            {newestMovies.map((movie, index) => (
              <div
                key={movie.id || index}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 ${
                  index === activeSlide
                    ? "border-red-500 scale-105"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={movie.poster_url || "/fallback.jpg"}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Section title="Thể loại">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.slice(0, 5).map((cate, idx) => {
            const gradients = [
              "from-rose-500/90 to-red-600/90",
              "from-blue-500/90 to-indigo-600/90",
              "from-emerald-500/90 to-green-600/90",
              "from-yellow-400/90 to-orange-500/90",
              "from-purple-500/90 to-pink-600/90",
            ];

            return (
              <Link
                key={cate.id || cate.slug}
                to={`/movies/category/${cate.slug}`}
                className="group relative h-36 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${
                    gradients[idx % gradients.length]
                  }`}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <h3 className="text-lg font-semibold group-hover:translate-x-1 transition">
                    {cate.name}
                  </h3>
                  <span className="text-xs opacity-90 group-hover:translate-x-2 transition">
                    Khám phá →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
      {countrySlugs.map((slug) => {
        const movies = moviesByCountry[slug] || [];

        return (
          <Section
            key={slug}
            title={slug.replaceAll("-", " ")}
            action={{
              text: "Xem tất cả",
              to: `/movies?country=${slug}`,
            }}
          >
            <MovieGrid movies={movies} />
          </Section>
        );
      })}
      <Section
        title="Phim sắp chiếu"
        action={{
          text: "Xem tất cả",
          to: "/movies?lifecycle_status=upcoming",
        }}
      >
        <MovieGrid movies={upcomingMovies} showStatus />
      </Section>

      <DevChillApp />
    </div>
  );
}
function Section({ title, action, children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold capitalize tracking-tight">
          {title}
        </h2>

        {action && (
          <Link
            to={action.to}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition"
          >
            {action.text}
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}
function MovieGrid({ movies, showStatus }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {!movies?.length && (
        <div className="col-span-full h-60 rounded-2xl bg-gray-50 border flex items-center justify-center text-gray-400 text-sm">
          Đang cập nhật
        </div>
      )}
      {movies?.map((movie) => (
        <Link
          key={movie.id || movie.slug}
          to={`/movies/${movie.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition duration-300"
        >
          <img
            src={movie.poster_url || "/fallback.jpg"}
            className="h-64 w-full object-cover group-hover:scale-110 transition duration-500"
          />

          <div className="p-3">
            <h3 className="text-sm font-medium truncate group-hover:text-red-500 transition">
              {movie.name}
            </h3>

            {showStatus && (
              <p className="text-xs text-gray-500 mt-1">Sắp chiếu</p>
            )}
          </div>

          {movie.is_premium && (
            <div className="absolute top-3 right-3 bg-yellow-400 p-1.5 rounded-full shadow">
              <Star size={14} className="text-black" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
