import { Link } from "react-router-dom";
import { Play, Droplet } from "lucide-react";

export default function Top10WeeklySection({ movies }) {
  if (!movies || movies.length === 0) return null;
  const doubledMovies = [...movies, ...movies];

  return (
    <section className="w-full overflow-hidden relative py-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* CSS cho Marquee (giữ nguyên) */
          .my-marquee-track {
            width: max-content;
            animation: scroll-marquee 40s linear infinite;
            will-change: transform;
          }
          
          .my-marquee-track:hover {
            animation-play-state: paused;
          }

          @keyframes scroll-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1.75rem)); }
          }

          /* CSS cho Thẻ Bùa Mệnh Thủy */
          @keyframes sway-water {
            0%, 100% { transform: rotate(-1.5deg) translateY(0px); }
            50% { transform: rotate(1.5deg) translateY(-6px); }
          }
          @keyframes wave-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .talisman-sway {
            animation: sway-water 5s ease-in-out infinite;
            transform-origin: top center;
            will-change: transform;
          }
          .water-wave-effect {
            background-size: 200% 200%;
            animation: wave-bg 6s ease-in-out infinite;
          }
        `,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col items-start perspective-1000">
          <div className="flex flex-col items-center talisman-sway relative ml-2 w-fit group">
            <div className="w-0.5 h-20 bg-linear-to-b from-transparent via-blue-400/60 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] -mt-1 z-10" />
            <div className="relative water-wave-effect bg-linear-to-br from-blue-100/90 via-cyan-50/90 to-blue-200/90 backdrop-blur-md border border-white/60 px-6 md:px-8 py-3 min-w-50 text-center shadow-[0_8px_30px_rgba(37,99,235,0.15)] -mt-0.5 overflow-hidden rounded-sm">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400/60"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400/60"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400/60"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400/60"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_2s_infinite]"></div>

              <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.08em] relative z-10 flex items-center gap-2 md:gap-3 text-slate-800 drop-shadow-sm">
                <Droplet
                  size={20}
                  className="text-blue-500 animate-[pulse_3s_ease-in-out_infinite] fill-blue-200"
                />
                Top 10 Xem Nhiều Nhất
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
        </div>
      </div>
      <div className="relative flex overflow-hidden w-full group">
        <div className="my-marquee-track flex gap-10 md:gap-14 pl-4 md:pl-10 pb-12 pt-8 items-end">
          {doubledMovies.map((movie, idx) => (
            <Link
              to={`/movies/${movie.slug}`}
              key={`${movie.id}-${idx}`}
              className="relative flex items-end justify-end w-42.5 md:w-55 aspect-4/3 shrink-0 group/card outline-none"
            >
              <span
                className="absolute -left-3.75 md:-left-6.25 -bottom-2.5 md:-bottom-5 text-[100px] md:text-[140px] font-black leading-none text-[#F0F6FC] z-0 select-none drop-shadow-md tracking-tighter opacity-40 translate-x-4 origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:opacity-100 group-hover/card:-translate-x-4 group-hover/card:-translate-y-2 group-hover/card:-rotate-6 group-hover/card:scale-105"
                style={{
                  WebkitTextStroke: "3px #2563EB",
                  textShadow: "4px 4px 0px rgba(37,99,235,0.2)",
                }}
              >
                {(idx % movies.length) + 1}
              </span>
              <div className="relative w-32.5 md:w-40 aspect-2/3 rounded-xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10 border border-white/80 origin-bottom-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:translate-x-2 group-hover/card:-translate-y-6 group-hover/card:rotate-3 group-hover/card:scale-105 group-hover/card:shadow-2xl bg-slate-200">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] scale-75 group-hover/card:scale-100 transition-transform duration-500">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                  <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 text-center drop-shadow-md leading-tight">
                    {movie.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
