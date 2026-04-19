/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link } from "react-router-dom";
import { Star, Play, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DevChillApp from "./DevChillApp";
import { getLifecycleStatus } from "../utils/getLifecycleStatus";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [newestMovies, setNewestMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moviesByCountry, setMoviesByCountry] = useState({});
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const countrySlugs = ["han-quoc", "trung-quoc", "viet-nam"];
  const unwrap = (res) => res?.data?.data ?? res?.data ?? [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, cateRes, upcomingRes] = await Promise.all([
          getPublicMovies({ page: 1, limit: 5 }),
          getCategories(),
          getPublicMovies({ lifecycle_status: "upcoming", page: 1, limit: 10 }),
        ]);

        setNewestMovies(unwrap(movieRes) || []);
        setCategories(unwrap(cateRes) || []);
        setUpcomingMovies(unwrap(upcomingRes) || []);
        const results = await Promise.all(
          countrySlugs.map((slug) =>
            getPublicMovies({ country: slug, page: 1, limit: 12 }),
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
      setActiveSlide((prev) => (prev + 1) % newestMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [newestMovies]);

  if (loading) return <LoadingSkeleton />;

  const activeMovie = newestMovies?.[activeSlide];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-red-500 selection:text-white">
      <section className="relative w-full h-[65vh] lg:h-[75vh] flex items-center overflow-hidden bg-white">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeMovie?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeMovie?.thumb_url || activeMovie?.poster_url}
              className="w-full h-full object-cover object-[center_20%]"
              alt={activeMovie?.name}
            />
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/70 to-white/10" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                Spotlight
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold italic text-slate-950 leading-[1.1] tracking-tight">
              {activeMovie?.name}
            </h1>
            <p className="mt-5 text-base text-slate-600 line-clamp-3 max-w-md leading-relaxed font-medium">
              {activeMovie?.content}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to={`/movies/${activeMovie?.slug}`}
                className="group flex items-center gap-2 bg-slate-950 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
              >
                <Play
                  fill="currentColor"
                  size={14}
                  className="group-hover:scale-110 transition-transform"
                />
                XEM CHI TIẾT
              </Link>

              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all">
                <Info size={18} />
                Thông tin
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-14">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cate) => (
              <Link
                key={cate.id}
                to={`/movies/category/${cate.slug}`}
                className="group relative py-5 px-3 text-center rounded-2xl bg-white border border-red-100 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide transition-colors duration-300 group-hover:text-red-600">
                  {cate.name}
                </span>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 ease-out group-hover:w-8" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="space-y-20 pb-20">
        {countrySlugs.map((slug) => (
          <section key={slug} className="container mx-auto px-6 lg:px-16">
            <SectionHeader
              title={`Phim ${slug.replace("-", " ")}`}
              link={`/movies?country=${slug}`}
            />
            <MovieGrid movies={moviesByCountry[slug]} />
          </section>
        ))}
      </div>
      <section className="py-20 bg-sky-50 border-sky-100 text-sky-600/60 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 mb-10 text-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 mb-2">
            Coming Soon
          </h2>
          <div className="h-1 w-12 bg-red-500 mx-auto" />
        </div>
        <div className="relative h-100 w-full flex items-center justify-center perspective-distant">
          <Upcoming3DCarousel movies={upcomingMovies} />
        </div>
      </section>

      <div className="py-16">
        <DevChillApp />
      </div>
    </div>
  );
}
function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-8 border-l-4 border-red-600 pl-5 py-2">
      <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
        {title}
      </h2>
      {link && (
        <Link
          to={link}
          className="group flex items-center gap-1 font-bold text-[11px] text-slate-400 hover:text-red-600 transition-all uppercase tracking-widest"
        >
          Xem tất cả{" "}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}

function MovieGrid({ movies }) {
  if (!movies?.length)
    return (
      <div className="h-40 flex items-center text-slate-300 text-xs tracking-widest uppercase">
        Loading...
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {movies.map((movie) => {
        const status = getLifecycleStatus(movie.lifecycle_status);
        return (
          <motion.div
            key={movie.id || movie.slug}
            whileHover={{ y: -6 }}
            className="group"
          >
            <Link to={`/movies/${movie.slug}`}>
              <div className="relative aspect-10/14.5 rounded-lg overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                <img
                  src={movie.poster_url || "/fallback.jpg"}
                  className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  alt={movie.name}
                />

                <div className="absolute top-2 left-2">
                  <span
                    className={`${status.color} text-white text-[7px] font-bold px-1.5 py-0.5 rounded-sm uppercase`}
                  >
                    {status.label}
                  </span>
                </div>

                {movie.is_premium && (
                  <div className="absolute top-2 right-2 bg-yellow-400 p-0.5 rounded-sm shadow-sm">
                    <Star size={8} className="text-white fill-white" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play fill="#fff" size={14} className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-[12px] text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                  {movie.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate italic">
                  {movie.origin_name || "HD Vietsub"}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function Upcoming3DCarousel({ movies }) {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setRotation((prev) => prev - 72), 5000);
    return () => clearInterval(timer);
  }, []);

  if (!movies?.length) return null;
  const displayMovies = movies.slice(0, 5);
  const radius = 320;

  return (
    <motion.div
      animate={{ rotateY: rotation }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-44 h-64"
    >
      {displayMovies.map((movie, idx) => {
        const angle = idx * 72;
        return (
          <div
            key={movie.id}
            className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200/50"
            style={{
              transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <Link
              to={`/movies/${movie.slug}`}
              className="block h-full relative group"
            >
              <img
                src={movie.poster_url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={movie.name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[9px] font-bold border border-white/40 px-3 py-1 rounded-full backdrop-blur-md uppercase">
                  Review
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </motion.div>
  );
}
