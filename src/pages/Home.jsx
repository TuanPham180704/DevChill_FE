/* eslint-disable no-unused-vars */
// cspell:disable
import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DevChillApp from "./DevChillApp";
import LoadingSkeleton from "../components/LoadingSkeleton";

// Đã import các Component bóc tách
import SectionHeader from "./landing/SectionHeader";
import MovieGrid from "./landing/MovieGrid";
import Upcoming3DCarousel from "./landing/Upcoming3DCarousel";
import Top10WeeklySection from "./landing/Top10WeeklySection";
import PremiumExclusiveSection from "./landing/PremiumExclusiveSection";

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
  const [premiumMovies, setPremiumMovies] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          movieRes,
          cateRes,
          upcomingRes,
          cartoonRes,
          top10Res,
          premiumRes,
        ] = await Promise.all([
          getPublicMovies({ page: 1, limit: 5 }),
          getCategories(),
          getPublicMovies({ lifecycle_status: "upcoming", page: 1, limit: 10 }),
          getPublicMovies({ category: "hoat-hinh", page: 1, limit: 12 }),
          getPublicMovies({ page: 1, limit: 20 }),
          getPublicMovies({ is_premium: true, page: 1, limit: 5 }),
        ]);

        setNewestMovies(unwrap(movieRes) || []);
        setCategories(unwrap(cateRes) || []);
        setUpcomingMovies(unwrap(upcomingRes) || []);
        setCartoonMovies(unwrap(cartoonRes) || []);
        setPremiumMovies(unwrap(premiumRes) || []);

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-x-hidden font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* HERO SLIDER */}
      <section className="relative w-full h-[50vh] lg:h-[65vh] flex items-center overflow-hidden bg-[#0B1121]">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div
            key={`content-${activeMovie?.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 text-[9px] font-bold tracking-[0.2em] uppercase">
                Spotlight
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              {activeMovie?.name}
            </h1>

            <p className="mt-4 text-sm md:text-base text-slate-300 line-clamp-3 max-w-lg leading-relaxed font-light">
              {activeMovie?.content ||
                "Khám phá siêu phẩm điện ảnh với chất lượng đỉnh cao và nội dung lôi cuốn ngay hôm nay trên nền tảng của chúng tôi."}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                to={`/movies/${activeMovie?.slug}`}
                className="group relative flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-semibold overflow-hidden shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 transition-all duration-300 active:scale-95"
              >
                <Play fill="currentColor" size={12} className="relative z-10" />
                <span className="relative z-10 tracking-wider uppercase">
                  Xem Ngay
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-6 right-4 lg:right-8 xl:right-[calc((100vw-80rem)/2)] flex items-end gap-2.5 z-20">
          {newestMovies.map((movie, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={movie.id || idx}
                onClick={() => setActiveSlide(idx)}
                className={`relative overflow-hidden rounded-md transition-all duration-500 ease-out outline-none ${
                  isActive
                    ? "w-20 md:w-28 aspect-video ring-2 ring-blue-500 opacity-100 transform -translate-y-1"
                    : "w-14 md:w-16 aspect-video opacity-40 hover:opacity-100"
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

      {/* CATEGORIES SECTION */}
      {/* CATEGORIES SECTION (Đã làm to khối & thêm viền xanh nhẹ) */}
      <section className="relative z-20 mt-8 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories.slice(0, 6).map((cate, index) => (
              <motion.div
                key={cate.id}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/movies/category/${cate.slug}`}
                  className="group relative flex flex-col items-center justify-center py-5 lg:py-6 px-4 rounded-2xl border border-blue-200/60 bg-blue-50/40 shadow-sm transition-all duration-300 hover:bg-white hover:border-blue-400 hover:shadow-md hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-100/40 to-transparent opacity-80 group-hover:opacity-0 transition duration-300" />
                  <span className="relative text-xs lg:text-sm font-bold uppercase tracking-widest text-slate-600 group-hover:text-blue-600 transition-colors text-center">
                    {cate.name}
                  </span>
                  <div className="relative h-0.5 w-0 mt-2 bg-blue-600 group-hover:w-8 transition-all duration-300 rounded-full" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {premiumMovies.length > 0 && (
        <PremiumExclusiveSection movies={premiumMovies} />
      )}
      <div className="space-y-12 pb-12">
        {top10Weekly.length > 0 && <Top10WeeklySection movies={top10Weekly} />}
        {countrySlugs.map((slug) => (
          <section key={slug} className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title={`Phim ${slug.replace("-", " ")}`}
              link={`/movies?country=${slug}`}
            />
            <MovieGrid movies={moviesByCountry[slug]} />
          </section>
        ))}
        {cartoonMovies.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title="Phim Hoạt Hình"
              link="/movies?category=hoat-hinh"
            />
            <MovieGrid movies={cartoonMovies} />
          </section>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-16 mt-6">
        <section className="py-12 lg:py-16 bg-[#0B1121] text-white overflow-hidden relative rounded-[1.5rem] lg:rounded-[2rem] shadow-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="px-6 lg:px-12 mb-10 relative z-20">
            <div className="flex items-end justify-between group">
              <div className="flex items-center gap-3 text-left">
                <div className="w-1 h-6 bg-linear-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles size={10} className="text-blue-300" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-white">
                    Siêu Phẩm Sắp Chiếu
                  </h2>
                </div>
              </div>
              <Link
                to="/movies?lifecycle_status=upcoming"
                className="flex items-center gap-1.5 font-semibold text-[11px] text-slate-400 hover:text-blue-400 transition-all uppercase tracking-wider"
              >
                Xem tất cả
                <span className="bg-slate-800 p-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </Link>
            </div>
          </div>
          <div className="relative h-64 lg:h-72 w-full flex items-center justify-center perspective-distant z-10">
            <Upcoming3DCarousel movies={upcomingMovies} />
          </div>
        </section>
      </div>
      <div className="py-12 bg-white border-t border-slate-100">
        <DevChillApp />
      </div>
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
        @keyframes shimmer {
          100% { transform: translateX(400%) skewX(-12deg); }
        }
        @keyframes premiumProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `,
        }}
      />
    </div>
  );
}
