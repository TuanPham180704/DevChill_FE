/* eslint-disable no-unused-vars */
// cspell:disable
import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link } from "react-router-dom";
import { Star, Play, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DevChillApp from "./DevChillApp";
import { getLifecycleStatus } from "../utils/getLifecycleStatus";
import LoadingSkeleton from "../components/LoadingSkeleton";



const countrySlugs = ["han-quoc", "trung-quoc", "viet-nam"];
const unwrap = (res) => res?.data?.data ?? res?.data ?? [];
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [newestMovies, setNewestMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moviesByCountry, setMoviesByCountry] = useState({});
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [cartoonMovies, setCartoonMovies] = useState([]);
  const [top10Weekly, setTop10Weekly] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, cateRes, upcomingRes, cartoonRes, top10Res] =
          await Promise.all([
            getPublicMovies({ page: 1, limit: 5 }),
            getCategories(),
            getPublicMovies({
              lifecycle_status: "upcoming",
              page: 1,
              limit: 10,
            }),
            getPublicMovies({ category: "hoat-hinh", page: 1, limit: 12 }),
            getPublicMovies({ page: 1, limit: 20 }),
          ]);

        setNewestMovies(unwrap(movieRes) || []);
        setCategories(unwrap(cateRes) || []);
        setUpcomingMovies(unwrap(upcomingRes) || []);
        setCartoonMovies(unwrap(cartoonRes) || []);
        const rawTop10 = unwrap(top10Res) || [];
        const validTop10 = rawTop10
          .filter((m) => m.lifecycle_status !== "upcoming")
          .slice(0, 10);
        setTop10Weekly(validTop10);

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-x-hidden font-sans selection:bg-red-500 selection:text-white">
      <section className="relative w-full h-[70vh] lg:h-[85vh] flex items-center overflow-hidden bg-[#0B1121]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12, ease: "easeOut" }}
              src={activeMovie?.thumb_url || activeMovie?.poster_url}
              className="w-full h-full object-cover object-[center_20%] opacity-80"
              alt={activeMovie?.name}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0B1121] via-[#0B1121]/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#F8FAFC] via-transparent to-[#0B1121]/20 opacity-100" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-6 lg:px-16">
          <motion.div
            key={`content-${activeMovie?.id}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                Spotlight
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              {activeMovie?.name}
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-300 line-clamp-3 max-w-lg leading-relaxed font-light">
              {activeMovie?.content ||
                "Khám phá siêu phẩm điện ảnh với chất lượng đỉnh cao và nội dung lôi cuốn ngay hôm nay trên nền tảng của chúng tôi."}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <Link
                to={`/movies/${activeMovie?.slug}`}
                className="group relative flex items-center gap-3 bg-red-600 text-white px-8 py-3.5 rounded-xl text-sm font-semibold overflow-hidden shadow-lg shadow-red-600/20 hover:shadow-red-500/40 transition-all duration-300 active:scale-95"
              >
                <Play fill="currentColor" size={14} className="relative z-10" />
                <span className="relative z-10 tracking-wider uppercase">
                  Xem Ngay
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 right-6 lg:right-16 flex items-end gap-3 z-20">
          {newestMovies.map((movie, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={movie.id || idx}
                onClick={() => setActiveSlide(idx)}
                className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-out outline-none ${
                  isActive
                    ? "w-24 md:w-32 aspect-video ring-2 ring-red-500 opacity-100 transform -translate-y-1"
                    : "w-16 md:w-20 aspect-video opacity-40 hover:opacity-100"
                }`}
              >
                <img
                  src={movie.thumb_url || movie.poster_url}
                  className="w-full h-full object-cover"
                  alt={movie.name}
                />
              </button>
            );
          })}
        </div>
      </section>
      <section className="relative z-20 mt-12 mb-14">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cate, index) => (
              <motion.div
                key={cate.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <Link
                  to={`/movies/category/${cate.slug}`}
                  className="
                    group relative flex flex-col items-center justify-center
                    py-6 px-4 rounded-2xl
                    border border-red-100
                    bg-red-50/40
                    shadow-sm
                    transition-all duration-300
                    hover:bg-slate-100
                    hover:border-slate-200
                    hover:shadow-md
                    hover:-translate-y-1
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      absolute inset-0
                      bg-linear-to-br from-red-100/60 to-transparent
                      opacity-80
                      group-hover:opacity-0
                      transition duration-300
                    "
                  />
                  <span
                    className="
                      relative text-[12px] font-bold uppercase tracking-widest
                      text-red-500
                      group-hover:text-slate-600
                      transition-colors
                      text-center
                    "
                  >
                    {cate.name}
                  </span>
                  <div
                    className="
                      relative h-0.5 w-0 mt-2
                      bg-red-500
                      group-hover:bg-slate-400
                      group-hover:w-8
                      transition-all duration-300 rounded-full
                    "
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="space-y-20 pb-16">
        {top10Weekly.length > 0 && <Top10WeeklySection movies={top10Weekly} />}
        {countrySlugs.map((slug) => (
          <section key={slug} className="container mx-auto px-6 lg:px-16">
            <SectionHeader
              title={`Phim ${slug.replace("-", " ")}`}
              link={`/movies?country=${slug}`}
            />
            <MovieGrid movies={moviesByCountry[slug]} />
          </section>
        ))}
        {cartoonMovies.length > 0 && (
          <section className="container mx-auto px-6 lg:px-16">
            <SectionHeader
              title="Phim Hoạt Hình"
              link="/movies?category=hoat-hinh"
            />
            <MovieGrid movies={cartoonMovies} />
          </section>
        )}
      </div>
      <div className="container mx-auto px-6 lg:px-16 mb-24 mt-10">
        <section className="py-20 bg-[#0B1121] text-white overflow-hidden relative rounded-[2.5rem] border border-slate-800/40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-125 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-16 mb-16">
            <div className="flex items-end justify-between group">
              <div className="flex items-center gap-4 text-left">
                <div className="w-1.5 h-8 bg-linear-to-b from-red-500 to-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={12} className="text-red-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                    Siêu Phẩm Sắp Chiếu
                  </h2>
                </div>
              </div>
              <Link
                to="/movies?lifecycle_status=upcoming"
                className="flex items-center gap-2 font-semibold text-[12px] text-slate-400 hover:text-red-400 transition-all uppercase tracking-wider"
              >
                Xem tất cả
                <span className="bg-slate-800 p-1.5 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all">
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative h-96 w-full flex items-center justify-center perspective-distant z-10">
            <Upcoming3DCarousel movies={upcomingMovies} />
          </div>
        </section>
      </div>

      {/* APP PROMO SECTION */}
      <div className="py-16 bg-white border-t border-slate-100">
        <DevChillApp />
      </div>

      {/* Tùy chỉnh CSS cho hiệu ứng Dòng Sông (Marquee) mượt mà */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </div>
  );
}
function Top10WeeklySection({ movies }) {
  if (!movies?.length) return null;
  const top10 = movies.slice(0, 10);

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center shadow-inner">
            <TrendingUp size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              Top 10 Phim Tuần Này
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Lựa chọn nhiều nhất
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
        <div className="flex w-max animate-marquee py-10">
          <div className="flex gap-8 md:gap-14 pr-8 md:pr-14 pl-6 md:pl-16">
            {top10.map((movie, index) => (
              <Top10Card key={`1-${movie.id}`} movie={movie} rank={index + 1} />
            ))}
          </div>
          <div className="flex gap-8 md:gap-14 pr-8 md:pr-14">
            {top10.map((movie, index) => (
              <Top10Card key={`2-${movie.id}`} movie={movie} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Top10Card({ movie, rank }) {
  return (
    <div className="relative flex items-end justify-end w-70 md:w-85 group cursor-pointer">
      <div className="absolute left-0 -bottom-3 md:-bottom-5 text-[140px] md:text-[200px] font-black leading-none z-0 select-none text-[#F8FAFC] drop-shadow-sm transition-all duration-500 [-webkit-text-stroke:3px_#CBD5E1] tracking-[-0.08em] group-hover:[-webkit-text-stroke:4px_#EF4444] group-hover:-translate-x-2">
        {rank}
      </div>
      <Link
        to={`/movies/${movie.slug}`}
        className="block relative z-10 w-45 md:w-55 rounded-[1.2rem] overflow-hidden shadow-lg shadow-slate-300/40 bg-white border border-slate-100 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-red-500/30"
      >
        <div className="aspect-2/3 relative bg-slate-100">
          <img
            src={movie.poster_url || "/fallback.jpg"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={movie.name}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play fill="#fff" size={16} className="ml-1 text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 p-4 w-full z-10">
            <div className="flex items-center gap-2 mb-2">
              {movie.is_premium && (
                <span className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-md px-1.5 py-0.5 rounded-md shadow-sm">
                  <Star size={10} className="fill-white text-white" />
                </span>
              )}
              <span className="text-[9px] font-bold text-white/90 bg-white/20 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md uppercase tracking-wider">
                {movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight tracking-tight shadow-sm drop-shadow-md">
              {movie.name}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
function SectionHeader({ title, link }) {
  return (
    <div className="flex items-end justify-between mb-8 group">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-linear-to-b from-red-500 to-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
        <h2 className="text-2xl lg:text-3xl font-bold capitalize tracking-tight text-slate-800">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-2 font-semibold text-[12px] text-slate-400 hover:text-red-600 transition-all uppercase tracking-wider"
        >
          Xem tất cả
          <span className="bg-slate-100 p-1.5 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all">
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </Link>
      )}
    </div>
  );
}

function MovieGrid({ movies }) {
  if (!movies?.length)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-2/3 bg-slate-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {movies.map((movie) => {
        const status = getLifecycleStatus(movie.lifecycle_status);
        return (
          <motion.div
            key={movie.id || movie.slug}
            whileHover={{ y: -6 }}
            className="group flex flex-col h-full"
          >
            <Link to={`/movies/${movie.slug}`} className="flex flex-col flex-1">
              <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40 transition-all duration-500 group-hover:shadow-xl">
                <img
                  src={movie.poster_url || "/fallback.jpg"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={movie.name}
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span
                    className={`${status.color} backdrop-blur-md bg-opacity-90 text-white text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-wider`}
                  >
                    {status.label}
                  </span>
                </div>
                {movie.is_premium && (
                  <div className="absolute top-2.5 right-2.5 bg-yellow-400/90 backdrop-blur-md p-1.2 rounded-md z-20">
                    <Star size={10} className="text-white fill-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0B1121]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Play fill="#fff" size={16} className="ml-0.5 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-3.5 flex-1">
                <h3 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors tracking-tight">
                  {movie.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-normal truncate uppercase tracking-tighter">
                  {movie.origin_name || "Đang cập nhật"}
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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => setRotation((prev) => prev - 72), 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  if (!movies?.length) return null;
  const displayMovies = movies.slice(0, 5);
  const radius = window.innerWidth < 768 ? 200 : 300;

  return (
    <motion.div
      animate={{ rotateY: rotation }}
      transition={{ type: "spring", stiffness: 40, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-44 md:w-52 h-64 md:h-72"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayMovies.map((movie, idx) => {
        const angle = idx * 72;
        return (
          <div
            key={movie.id}
            className="absolute inset-0 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-white/5"
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
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                alt={movie.name}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/40 to-transparent p-4">
                <h4 className="text-white font-bold text-xs md:text-sm truncate">
                  {movie.name}
                </h4>
              </div>
            </Link>
          </div>
        );
      })}
    </motion.div>
  );
}
