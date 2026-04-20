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

  const springConfig = { type: "spring", bounce: 0.1, duration: 0.8 };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 my-14"
    >
      <div className="flex items-center justify-between mb-5 group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shadow-inner border border-amber-500/20">
            <Crown
              size={20}
              className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              Phim Độc Quyền <Sparkles size={14} className="text-amber-400" />
            </h2>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
              Chỉ có tại DevChill
            </p>
          </div>
        </div>
        <Link
          to="/movies?is_premium=true"
          className="flex items-center gap-1.5 font-semibold text-[11px] text-slate-400 hover:text-amber-600 transition-all uppercase tracking-wider"
        >
          Khám phá
          <span className="bg-slate-100 p-1 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-all">
            <ArrowRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </Link>
      </div>

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
              transition={springConfig}
              className={`relative overflow-hidden group flex flex-col justify-end
                ${
                  isHero
                    ? "col-span-2 lg:col-span-4 h-62.5 lg:h-87.5 rounded-[1.5rem] bg-[#0B1121] shadow-xl z-10 border border-amber-500/20"
                    : "col-span-1 h-25 lg:h-32.5 rounded-xl bg-slate-800 shadow-sm z-0 cursor-pointer hover:shadow-lg hover:border-amber-400/50 border border-transparent transition-colors"
                }`}
            >
              <Link
                to={`/movies/${movie.slug}`}
                className="absolute inset-0 z-40"
              />

              <motion.img
                layout
                transition={springConfig}
                src={movie.thumb_url || movie.poster_url}
                alt={movie.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />

              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 0.9 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-[#0B1121] via-[#0B1121]/50 to-transparent z-10 pointer-events-none"
              />
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none group-hover:from-amber-900/90 transition-colors duration-500"
              />

              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-5 lg:p-8 w-full z-20 pointer-events-none flex flex-col items-start"
              >
                {isHero && (
                  <div className="mb-3 overflow-hidden rounded-md">
                    <span className="relative flex items-center gap-1 bg-linear-to-r from-amber-500 to-yellow-400 text-slate-900 text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-lg">
                      <Crown size={10} strokeWidth={3} />
                      Đỉnh Cao
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2.5s_infinite]" />
                    </span>
                  </div>
                )}
                <h3 className="text-white text-2xl lg:text-3xl font-black mb-2 leading-tight drop-shadow-md tracking-tight">
                  {movie.name}
                </h3>
                <p className="text-slate-300 text-xs lg:text-sm line-clamp-2 max-w-xl font-light mb-4 tracking-wide leading-relaxed hidden md:block">
                  {movie.content ||
                    "Tác phẩm điện ảnh độc quyền với chất lượng vượt trội. Trải nghiệm ngay thước phim đẳng cấp nhất."}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold pointer-events-auto transition-all duration-300 hover:bg-white hover:text-slate-900">
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
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">
                        Premium
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-xs lg:text-sm line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                      {movie.name}
                    </h4>
                  </>
                )}
              </motion.div>

              {isHero && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-amber-900/40 z-30">
                  <div
                    key={`progress-${movie.id}`}
                    className={`h-full bg-linear-to-r from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-[premiumProgress_5s_linear_forwards] ${
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
