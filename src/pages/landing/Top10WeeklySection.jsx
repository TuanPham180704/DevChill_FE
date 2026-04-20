import { Link } from "react-router-dom";
import { TrendingUp, Play, Star } from "lucide-react";

function Top10Card({ movie, rank }) {
  return (
    <div className="relative flex items-end justify-end w-48 md:w-60 group cursor-pointer">
      <div className="absolute left-0 -bottom-2 md:-bottom-3 text-[100px] md:text-[140px] font-black leading-none z-0 select-none text-[#F8FAFC] drop-shadow-sm transition-all duration-500 [-webkit-text-stroke:2px_#CBD5E1] tracking-[-0.08em] group-hover:[-webkit-text-stroke:3px_#3B82F6] group-hover:-translate-x-1">
        {rank}
      </div>
      <Link
        to={`/movies/${movie.slug}`}
        className="block relative z-10 w-32 md:w-40 rounded-xl overflow-hidden shadow-md shadow-slate-300/40 bg-white border border-slate-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-500/30"
      >
        <div className="aspect-2/3 relative bg-slate-100">
          <img
            src={movie.poster_url || "/fallback.jpg"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={movie.name}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play fill="#fff" size={14} className="ml-1 text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-3 w-full z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              {movie.is_premium && (
                <span className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-md px-1 py-0.5 rounded shadow-sm">
                  <Star size={8} className="fill-white text-white" />
                </span>
              )}
              <span className="text-[8px] font-bold text-white/90 bg-white/20 backdrop-blur-md border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                {movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
              </span>
            </div>
            <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 leading-tight tracking-tight shadow-sm drop-shadow-md">
              {movie.name}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Top10WeeklySection({ movies }) {
  if (!movies?.length) return null;
  const top10 = movies.slice(0, 10);

  return (
    <section className="py-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shadow-inner">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight">
              Top 10 Phim Tuần Này
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Lựa chọn nhiều nhất
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-r from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-linear-to-l from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
        <div className="flex w-max animate-marquee py-6">
          <div className="flex gap-6 md:gap-10 pr-6 md:pr-10 pl-4 md:pl-8">
            {top10.map((movie, index) => (
              <Top10Card key={`1-${movie.id}`} movie={movie} rank={index + 1} />
            ))}
          </div>
          <div className="flex gap-6 md:gap-10 pr-6 md:pr-10">
            {top10.map((movie, index) => (
              <Top10Card key={`2-${movie.id}`} movie={movie} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
