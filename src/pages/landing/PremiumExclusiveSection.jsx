/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Sparkles, ArrowRight, Star, Play } from "lucide-react";

export default function PremiumExclusiveSection({ movies }) {
  const [queue, setQueue] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (movies?.length) {
      setQueue(movies.slice(0, 5));
    }
  }, [movies]);

  useEffect(() => {
    if (queue.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setQueue((prev) => {
        const next = [...prev];
        const first = next.shift();
        next.push(first);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [queue.length, isHovered]);

  if (!queue?.length) return null;

  // Đổi sang cấu hình trượt siêu mượt (bỏ độ nảy bounce)
  const smoothTransition = { type: "spring", bounce: 0, duration: 0.7 };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 my-12"
    >
      {/* Header Section - Đã thu nhỏ gọn gàng hơn */}
      <div className="flex items-end justify-between mb-6 group">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-linear-to-br from-yellow-400/20 to-amber-600/5 rounded-xl flex items-center justify-center border border-yellow-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent" />
            <Crown
              size={18}
              className="text-yellow-500 drop-shadow-md relative z-10"
            />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Phim Độc Quyền{" "}
              <Sparkles size={14} className="text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">
              Chỉ có tại DevChill
            </p>
          </div>
        </div>
        <Link
          to="/movies?is_premium=true"
          className="hidden sm:flex items-center gap-1.5 font-semibold text-[11px] text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full shadow-sm"
        >
          Khám phá
          <ArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Grid Layout */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {queue.map((movie, index) => {
          const isHero = index === 0;

          return (
            <motion.div
              layout
              key={movie.id}
              transition={smoothTransition}
              className={`relative overflow-hidden group flex flex-col justify-end will-change-transform
                ${
                  isHero
                    ? 
                      "col-span-2 lg:col-span-4 h-64 lg:h-85 rounded-[1.5rem] bg-slate-900 shadow-xl shadow-slate-900/10 border border-slate-200/50 z-10"
                    : 
                      "col-span-1 h-24 lg:h-32 rounded-xl bg-slate-800 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-yellow-500/30 border border-transparent transition-all duration-300 ease-out z-0"
                }`}
            >
              <Link
                to={`/movies/${movie.slug}`}
                className="absolute inset-0 z-40"
              />
              <motion.img
                layout
                transition={smoothTransition}
                src={movie.thumb_url || movie.poster_url}
                alt={movie.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-[#060A14] via-[#060A14]/50 to-transparent z-10 pointer-events-none"
              />
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none group-hover:from-slate-900/90 transition-colors duration-500"
              />

              {/* Hero Content - Thu nhỏ text và padding */}
              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-5 lg:p-8 w-full z-20 pointer-events-none flex flex-col items-start"
              >
                {isHero && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">
                      <Crown size={10} strokeWidth={2.5} />
                      Đỉnh Cao
                    </span>
                  </div>
                )}
                <h3 className="text-white text-2xl lg:text-4xl font-black mb-2.5 leading-tight tracking-tight drop-shadow-lg">
                  {movie.name}
                </h3>
                <p
                  className="text-slate-300 text-xs lg:text-sm max-w-xl font-normal mb-5 tracking-wide leading-relaxed hidden md:block drop-shadow-md"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {movie.content ||
                    "Tác phẩm điện ảnh độc quyền với chất lượng vượt trội. Trải nghiệm ngay thước phim đẳng cấp nhất."}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold pointer-events-auto transition-transform duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Play fill="currentColor" size={12} />
                  Trải nghiệm VIP
                </div>
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-2.5 lg:p-3 w-full z-20 pointer-events-none"
              >
                {!isHero && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Star
                        size={8}
                        className="fill-yellow-400 text-yellow-400 drop-shadow-md"
                      />
                      <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest drop-shadow-md">
                        Premium
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-[11px] lg:text-xs line-clamp-2 leading-snug group-hover:text-yellow-400 transition-colors">
                      {movie.name}
                    </h4>
                  </>
                )}
              </motion.div>
              {isHero && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10 z-30 backdrop-blur-sm">
                  <div
                    key={`progress-${movie.id}`}
                    className={`h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-[premiumProgress_5s_linear_forwards] ${
                      isHovered ? "[animation-play-state:paused]" : ""
                    }`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
