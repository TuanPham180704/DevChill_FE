/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Play, Droplet } from "lucide-react";

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
  const smoothTransition = { type: "spring", bounce: 0, duration: 0.7 };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 my-12"
    >
      <style>{`
        @keyframes sway-water {
          0%, 100% { transform: rotate(-1.5deg) translateY(0px); }
          50% { transform: rotate(1.5deg) translateY(-6px); }
        }
        @keyframes sway-water-reverse {
          0%, 100% { transform: rotate(2deg) translateY(-4px); }
          50% { transform: rotate(-1.5deg) translateY(2px); }
        }
        @keyframes wave-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes premiumProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .talisman-sway {
          animation: sway-water 5s ease-in-out infinite;
          transform-origin: top center;
          will-change: transform;
        }
        .talisman-sway-reverse {
          animation: sway-water-reverse 6s ease-in-out infinite;
          transform-origin: top center;
          will-change: transform;
        }
        .water-wave-effect {
          background-size: 200% 200%;
          animation: wave-bg 6s ease-in-out infinite;
        }
      `}</style>
      <div className="flex items-start justify-between mb-10 group relative perspective-1000">
        <div className="flex flex-col items-center talisman-sway relative ml-2">
          <div className="w-0.5 h-20 bg-linear-to-b from-transparent via-blue-400/60 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] -mt-1 z-10" />
          <div className="relative water-wave-effect bg-linear-to-br from-blue-100/90 via-cyan-50/90 to-blue-200/90 backdrop-blur-md border border-white/60 px-6 md:px-8 py-3 min-w-55 text-center shadow-[0_8px_30px_rgba(37,99,235,0.15)] -mt-0.5 overflow-hidden rounded-sm">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400/60"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400/60"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400/60"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400/60"></div>

            <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_2s_infinite]"></div>

            <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.08em] relative z-10 flex items-center justify-center gap-2 md:gap-3 text-slate-800 drop-shadow-sm">
              <Crown
                size={22}
                className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-pulse"
              />
              Phim Độc Quyền
              <Droplet
                size={20}
                className="text-blue-500 animate-[pulse_3s_ease-in-out_infinite] fill-blue-200"
              />
            </h2>
          </div>

          <div className="flex gap-4 mt-1 opacity-60">
            <div className="w-1.5 h-10 bg-linear-to-b from-blue-300/80 to-transparent rounded-b-full"></div>
            <div className="w-1.5 h-16 bg-linear-to-b from-blue-400/80 to-transparent mt-2 rounded-b-full"></div>
            <div className="w-1.5 h-10 bg-linear-to-b from-blue-300/80 to-transparent rounded-b-full"></div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center talisman-sway-reverse mt-4 mr-2">
          <div className="w-px h-14 bg-linear-to-b from-transparent to-blue-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 -mt-0.5 z-10" />

          <Link
            to="/movies?is_premium=true"
            className="relative water-wave-effect bg-linear-to-br from-blue-50/90 via-white/80 to-cyan-50/90 backdrop-blur-sm border border-white/80 px-4 py-2 hover:border-blue-300 transition-all duration-300 flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.1)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.2)] -mt-px rounded-sm group/link overflow-hidden"
          >
            <span className="font-bold text-[11px] text-slate-800 group-hover/link:text-blue-700 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5 relative z-10">
              Khám phá
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform duration-300 text-blue-500"
              />
            </span>
          </Link>

          <div className="w-3 h-6 border-x border-b border-blue-200/80 rounded-b-full mt-1 bg-linear-to-b from-blue-100/50 to-transparent"></div>
        </div>
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
              transition={smoothTransition}
              className={`relative overflow-hidden group flex flex-col justify-end will-change-transform
                ${
                  isHero
                    ? "col-span-2 lg:col-span-4 h-64 lg:h-85 rounded-[1.5rem] bg-slate-900 shadow-xl shadow-blue-900/20 border border-blue-200/20 z-10"
                    : "col-span-1 h-24 lg:h-32 rounded-xl bg-slate-800 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400/50 border border-transparent transition-all duration-300 ease-out z-0"
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
                className="absolute inset-0 bg-linear-to-t from-[#040b16] via-[#040b16]/50 to-transparent z-10 pointer-events-none"
              />
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-[#040b16]/95 via-black/40 to-transparent z-10 pointer-events-none group-hover:from-blue-950/90 transition-colors duration-500"
              />
              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-5 lg:p-8 w-full z-20 pointer-events-none flex flex-col items-start"
              >
                {isHero && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-100 border border-blue-400/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">
                      <Crown
                        size={11}
                        className="text-yellow-500"
                        strokeWidth={2.5}
                      />
                      Đỉnh Cao
                    </span>
                  </div>
                )}
                <h3 className="text-white text-2xl lg:text-4xl font-black mb-2.5 leading-tight tracking-tight drop-shadow-lg">
                  {movie.name}
                </h3>
                <p
                  className="text-blue-100/80 text-xs lg:text-sm max-w-xl font-normal mb-5 tracking-wide leading-relaxed hidden md:block drop-shadow-md"
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
                <div className="inline-flex items-center gap-1.5 bg-white text-blue-600 px-5 py-2.5 rounded-full text-xs font-bold pointer-events-auto transition-transform duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Play fill="currentColor" size={12} />
                  Trải nghiệm VIP
                </div>
              </motion.div>

              {/* Small Card Content */}
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-2.5 lg:p-3 w-full z-20 pointer-events-none"
              >
                {!isHero && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Crown
                        size={10}
                        className="text-yellow-500 drop-shadow-md"
                      />
                      <span className="text-[8px] font-bold text-blue-300 uppercase tracking-widest drop-shadow-md">
                        Premium
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-[11px] lg:text-xs line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
                      {movie.name}
                    </h4>
                  </>
                )}
              </motion.div>
              {isHero && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10 z-30 backdrop-blur-sm">
                  <div
                    key={`progress-${movie.id}`}
                    className={`h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-[premiumProgress_5s_linear_forwards] ${
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
