/* eslint-disable no-unused-vars */
// cspell:disable
import { useEffect, useState } from "react";
import { getPublicMovies, getCategories } from "../api/moviesPublicApi";
import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // Đã import toast
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
  const navigate = useNavigate();
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
  const handleWatchClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isPremiumUser = user?.is_premium === true;

    if (!token) {
      toast.warning("Bạn cần đăng nhập để xem phim");
      navigate("/login");
      return;
    }
    if (activeMovie?.is_premium && !isPremiumUser) {
      toast.error("Phim này yêu cầu tài khoản Premium");
      return;
    }
    navigate(`/movies/watch/${activeMovie?.slug}`);
  };

  return (
    <div className="relative min-h-screen bg-[#F0F6FC] text-slate-800 overflow-x-hidden font-['Be_Vietnam_Pro',sans-serif] antialiased selection:bg-blue-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex gap-1 md:gap-3 -rotate-6 select-none pointer-events-none">
          {"DEVCHILL".split("").map((char, index) => (
            <span
              key={index}
              className="text-[6rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter text-blue-900 opacity-[0.06] animate-wave-flag inline-block"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <section className="relative z-10 w-full h-[65vh] lg:h-[85vh] flex items-center overflow-hidden bg-[#060A14]">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeMovie?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: "easeOut" }}
              src={activeMovie?.thumb_url || activeMovie?.poster_url}
              className="w-full h-full object-cover object-[center_20%] opacity-80"
              alt={activeMovie?.name}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#060A14] via-[#060A14]/70 to-transparent w-[80%] md:w-[60%]" />
            <div className="absolute inset-0 bg-linear-to-t from-[#F0F6FC] via-[#F0F6FC]/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full flex items-center h-full">
          <motion.div
            key={`content-${activeMovie?.id}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl mt-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-white text-[10px] md:text-xs font-bold tracking-widest uppercase">
                Phim Mới Nổi Bật
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl mb-6">
              {activeMovie?.name}
            </h1>

            <p className="text-base md:text-lg text-slate-300 line-clamp-3 leading-relaxed font-normal max-w-xl drop-shadow-md">
              {activeMovie?.content ||
                "Khám phá siêu phẩm điện ảnh với chất lượng đỉnh cao và nội dung lôi cuốn ngay hôm nay trên nền tảng của chúng tôi."}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleWatchClick}
                className="group relative flex items-center gap-3 bg-white text-slate-900 px-8 py-3.5 rounded-full text-sm md:text-base font-bold overflow-hidden shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Play fill="currentColor" size={18} className="relative z-10" />
                <span className="relative z-10 tracking-wider">Xem Ngay</span>
              </button>

              <Link
                to={`/movies/${activeMovie?.slug}`}
                className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-slate-500/40 text-white hover:bg-slate-500/60 backdrop-blur-md border border-white/10 transition-all duration-300 text-sm md:text-base font-bold"
              >
                <Info size={18} />
                <span className="tracking-wider">Chi Tiết</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-4 lg:right-8 flex items-end gap-2 z-20">
          {newestMovies.map((movie, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={movie.id || idx}
                onClick={() => setActiveSlide(idx)}
                className={`relative overflow-hidden rounded-md transition-all duration-500 ease-out outline-none bg-slate-900 ${
                  isActive
                    ? "w-20 md:w-28 h-12 md:h-16 ring-2 ring-white shadow-2xl scale-110"
                    : "w-12 md:w-16 h-8 md:h-12 opacity-50 hover:opacity-100"
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
      <div className="relative z-10 pt-8">
        <section className="mb-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-5">
              {categories.slice(0, 6).map((cate, index) => (
                <motion.div
                  key={cate.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/movies/category/${cate.slug}`}
                    className="group flex items-center justify-between py-6 px-7 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-300 border-2 border-blue-400 hover:border-blue-600"
                  >
                    <span className="text-xs lg:text-sm font-semibold tracking-wide uppercase text-slate-600 group-hover:text-blue-600">
                      {cate.name}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {premiumMovies.length > 0 && (
          <PremiumExclusiveSection movies={premiumMovies} />
        )}

        <div className="space-y-16 pb-12">
          {top10Weekly.length > 0 && (
            <Top10WeeklySection movies={top10Weekly} />
          )}

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
        <div className="max-w-7xl mx-auto px-4 mb-20 mt-12">
          <section className="py-12 lg:py-16 bg-white border border-slate-200/50 text-slate-800 overflow-hidden relative rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="px-6 lg:px-12 mb-10 relative z-20">
              <div className="flex items-end justify-between group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-1.5 h-10 bg-blue-500 rounded-sm" />
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800 mb-1">
                      Siêu Phẩm Chờ Chiếu
                    </h2>
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">
                      Sắp đổ bộ trên DevChill
                    </span>
                  </div>
                </div>
                <Link
                  to="/movies?lifecycle_status=upcoming"
                  className="hidden sm:flex items-center gap-1.5 font-medium text-xs text-slate-600 hover:text-blue-600 transition-all uppercase tracking-widest bg-slate-100/50 hover:bg-slate-100 px-4 py-2 rounded-full shadow-inner"
                >
                  Xem tất cả
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            <div className="relative h-64 lg:h-80 w-full flex items-center justify-center perspective-distant z-10">
              <Upcoming3DCarousel movies={upcomingMovies} />
            </div>
          </section>
        </div>

        <div className="py-12 bg-white/50 backdrop-blur-md border-t border-slate-200/50 relative z-20">
          <DevChillApp />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Chữ lá cờ tung bay */
        @keyframes flagWave {
          0%, 100% { transform: translateY(0px) skewY(0deg); }
          25% { transform: translateY(-20px) skewY(-2deg); }
          75% { transform: translateY(20px) skewY(2deg); }
        }
        
        .animate-wave-flag {
          animation: flagWave 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          will-change: transform;
        }

        /* Phục hồi thanh Timeline Premium */
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