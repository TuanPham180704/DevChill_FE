/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link } from "react-router-dom";
import { Star, ChevronRight, Play } from "lucide-react";
import DevChillApp from "./DevChillApp";
import { getLifecycleStatus } from "../utils/getLifecycleStatus";

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

        setNewestMovies(unwrap(movieRes) || []);
        setCategories(unwrap(cateRes) || []);
        setUpcomingMovies(unwrap(upcomingRes) || []);

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
          countryData[slug] = unwrap(results[idx]) || [];
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

  useEffect(() => {
    if (!newestMovies?.length) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        setPrevSlide(prev);
        return (prev + 1) % newestMovies.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [newestMovies]);

  const goToSlide = (index) => {
    setPrevSlide(activeSlide);
    setActiveSlide(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400 text-sm">
          Loading cinematic experience...
        </div>
      </div>
    );
  }

  const activeMovie = newestMovies?.[activeSlide];
  const prevMovie = newestMovies?.[prevSlide];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <div className="relative w-full h-155 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl z-0" />

        {activeMovie ? (
          <>
            <img
              src={activeMovie.thumb_url || activeMovie.poster_url}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-white via-white/70 to-transparent z-10" />

            <div className="absolute inset-0 z-20 flex items-center">
              <div className="px-20 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold leading-snug tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] max-w-3xl">
                  {activeMovie.name}
                </h1>

                <p className="text-gray-600 mt-4 line-clamp-3">
                  {activeMovie.content}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/movies/${activeMovie.slug}`}
                    className="flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full shadow-xl hover:scale-105 transition"
                  >
                    <Play size={18} />
                    Xem ngay
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Đang cập nhật phim mới...
          </div>
        )}

        {/* THUMB SLIDER */}
        {newestMovies?.length > 0 && (
          <div className="absolute bottom-6 right-6 z-30 flex gap-2">
            {newestMovies.map((movie, index) =>
              movie ? (
                <div
                  key={movie.id || index}
                  onClick={() => goToSlide(index)}
                  className={`w-20 h-12 rounded-lg overflow-hidden cursor-pointer border ${
                    index === activeSlide
                      ? "border-red-500 scale-105"
                      : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={movie.poster_url || "/fallback.jpg"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* CATEGORY */}
      <Section title="Thể loại">
        {categories?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((cate) =>
              cate ? (
                <Link
                  key={cate.id || cate.slug}
                  to={`/movies/category/${cate.slug}`}
                  className="group p-5 rounded-2xl bg-white border hover:border-red-400 transition shadow-sm hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold group-hover:text-red-500">
                    {cate.name}
                  </h3>
                  <span className="text-xs text-gray-400">Khám phá →</span>
                </Link>
              ) : null,
            )}
          </div>
        ) : (
          <Empty text="Đang cập nhật thể loại..." />
        )}
      </Section>

      {/* COUNTRY */}
      {countrySlugs.map((slug) => {
        const movies = moviesByCountry?.[slug] || [];

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

      {/* UPCOMING */}
      <Section
        title="Phim sắp chiếu"
        action={{
          text: "Xem tất cả",
          to: "/movies?lifecycle_status=upcoming",
        }}
      >
        <MovieGrid movies={upcomingMovies} />
      </Section>

      <DevChillApp />
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-500 rounded-full" />
          <h2 className="text-2xl font-bold capitalize">{title}</h2>
          <div className="flex-1 h-px bg-gray-200 ml-4" />
        </div>

        {action && (
          <Link
            to={action.to}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
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

function Empty({ text }) {
  return (
    <div className="text-center py-10 text-gray-400 text-sm">
      {text || "Đang cập nhật..."}
    </div>
  );
}

function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return <Empty text="Đang cập nhật phim..." />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {movies.map((movie) => {
        if (!movie) return null;

        const status = getLifecycleStatus(movie.lifecycle_status);

        return (
          <Link
            key={movie.id || movie.slug}
            to={`/movies/${movie.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-white hover:-translate-y-1 hover:shadow-xl transition"
          >
            <img
              src={movie.poster_url || "/fallback.jpg"}
              className="h-64 w-full object-cover group-hover:scale-105 transition"
            />

            {movie.lifecycle_status && (
              <div
                className={`absolute top-3 left-3 text-white text-[10px] px-2 py-1 rounded ${status.color}`}
              >
                {status.label}
              </div>
            )}

            <div className="absolute bottom-0 p-3 text-white opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-sm font-semibold line-clamp-2">
                {movie.name}
              </h3>
            </div>

            {movie.is_premium && (
              <div className="absolute top-3 right-3 bg-white/20 px-2 py-1 rounded-full">
                <Star size={12} className="text-yellow-400" />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
