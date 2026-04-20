import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function Top10WeeklySection({ movies }) {
  if (!movies || movies.length === 0) return null;
  const doubledMovies = [...movies, ...movies];
  return (
    <section className="w-full overflow-hidden relative py-8">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 md:h-7 bg-blue-600 rounded-sm" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 uppercase">
            Top 10 Xem Nhiều Nhất
          </h2>
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
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] scale-75 group-hover/card:scale-100 transition-transform duration-500">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
            100% { transform: translateX(calc(-50% - 1.75rem)); } /* Đã bù trừ gap (14 = 3.5rem / 2) */
          }
        `,
        }}
      />
    </section>
  );
}
