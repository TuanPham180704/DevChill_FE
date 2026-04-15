import React, { useState } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  actionMovies,
  romanceMovies,
  animatedMovies,
  suggestions,
} from "../data/mockMovies";

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie] = useState(suggestions[0]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Epic Full-Screen Hero Section */}
      <div className="relative min-h-[85vh] lg:min-h-screen w-full group overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={featuredMovie.backdrop || featuredMovie.image}
            alt="Hero Background"
            className="w-full h-full object-cover object-top opacity-[0.85] transform scale-100 group-hover:scale-105 transition-transform duration-[20s] ease-linear mix-blend-overlay"
          />
          {/* Subtle vignette and cinematic gradient for light theme blending */}
          <div className="absolute inset-x-0 bottom-0 lg:h-[120%] -bottom-[20%] bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent flex items-center" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end px-4 sm:px-8 lg:px-16 pb-28 sm:pb-36 lg:pb-40 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 z-10 min-h-[85vh] lg:min-h-screen">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-extrabold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>{" "}
              Phim Nổi Bật
            </div>

            <h2
              className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-slate-900 drop-shadow-sm leading-[1.05] animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {featuredMovie.title.split(" (")[0]}
            </h2>

            {/* Meta Tags */}
            <div
              className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-slate-700 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-current" />{" "}
                {featuredMovie.rating}
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <Calendar className="w-4 h-4 text-blue-500" />{" "}
                {featuredMovie.year}
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <Clock className="w-4 h-4 text-blue-500" />{" "}
                {featuredMovie.duration}
              </div>
              <span className="bg-slate-900 text-white px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-extrabold shadow-sm">
                HD
              </span>
            </div>

            <p
              className="text-base lg:text-lg text-slate-600 max-w-xl font-medium leading-relaxed animate-fade-in-up line-clamp-3 md:line-clamp-4"
              style={{ animationDelay: "200ms" }}
            >
              {featuredMovie.desc}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 pt-4 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <button
                onClick={() => navigate(`/movie-view/${featuredMovie.id}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all duration-300 font-extrabold text-sm tracking-widest uppercase"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Xem Ngay</span>
              </button>
              <button
                onClick={() => navigate(`/movies/${featuredMovie.id}`)}
                className="flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-200 px-8 py-3.5 rounded-2xl hover:bg-slate-100 transition-all duration-300 hover:scale-[1.03] active:scale-95 font-extrabold text-sm uppercase tracking-widest shadow-sm"
              >
                <span>Chi Tiết</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 px-4 sm:px-8 lg:px-16 space-y-16 sm:space-y-24 -mt-16 sm:-mt-24">
        {/* Smart Suggestions */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <p className="text-blue-600 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1">
                Dành riêng cho bạn
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Gợi ý thông minh
              </h3>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="p-3 rounded-full hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 border border-slate-200 bg-white shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 border border-slate-200 bg-white shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {suggestions.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => {
                  navigate(`/movies/${movie.id}`);
                  window.scrollTo(0, 0);
                }}
                className="group flex flex-col gap-4 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className="relative aspect-[16/10] md:aspect-video rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 transform group-hover:-translate-y-2 ring-1 ring-black/5 group-hover:ring-blue-500/30">
                  <img
                    src={movie.backdrop}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-500" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-6 h-6 text-indigo-600 fill-indigo-600 ml-1" />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 font-black text-white text-[11px] px-3 py-1.5 rounded-lg shadow-sm border border-white/20">
                      {movie.match}
                    </span>
                  </div>
                </div>

                <div className="px-2 transition-transform duration-300 group-hover:translate-x-1">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors drop-shadow-sm tracking-tight line-clamp-1">
                    {movie.title.split(" (")[0]}
                  </h4>
                  <p className="text-sm text-slate-500 font-bold line-clamp-1 mt-1">
                    {movie.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full my-8"></div>

        {/* Movie Rows */}
        <MovieRow
          title="Phim Hành Động"
          indicatorColor="bg-blue-600"
          movies={actionMovies}
          navigate={navigate}
          categorySlug="hanh-dong"
        />
        <MovieRow
          title="Phim Tình Cảm"
          indicatorColor="bg-pink-500"
          movies={romanceMovies}
          navigate={navigate}
          categorySlug="tinh-cam"
        />
        <MovieRow
          title="Phim Hoạt Hình"
          indicatorColor="bg-amber-500"
          movies={animatedMovies}
          navigate={navigate}
          categorySlug="hoat-hinh"
        />
      </div>
    </div>
  );
};

export default Home;

// --- Components ---

const MovieRow = ({
  title,
  indicatorColor,
  movies,
  navigate,
  categorySlug,
}) => {
  return (
    <section className="space-y-6 pt-2">
      <div
        className="flex items-center justify-between group cursor-pointer w-full"
        onClick={() => {
          navigate(`/movies${categorySlug ? `?category=${categorySlug}` : ""}`);
          window.scrollTo(0, 0);
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-8 rounded-full transform group-hover:scale-y-125 transition-transform duration-300 ${indicatorColor} shadow-sm`}
          ></div>
          <h3 className="text-2xl sm:text-3xl md:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 hover:text-blue-600 py-2 px-4 rounded-full shadow-sm tracking-wider uppercase transition-colors border border-slate-200">
          Khám phá <ChevronRight className="w-4 h-4 ml-0.5" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 lg:gap-8 pb-4 md:pb-0 py-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => {
              navigate(`/movies/${movie.id}`);
              window.scrollTo(0, 0);
            }}
            className="flex flex-col gap-4 group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-900/15 transition-all duration-500 transform group-hover:-translate-y-2 ring-1 ring-black/5 group-hover:ring-blue-500/30">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play Icon Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                  <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                </div>
              </div>

              {/* Tag Rating */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                <span className="bg-amber-500/90 backdrop-blur-sm text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 border border-white/20">
                  <Star className="w-3 h-3 text-white fill-current" />{" "}
                  {movie.rating}
                </span>
              </div>
            </div>

            <div className="px-1 text-center sm:text-left transition-transform duration-300 group-hover:translate-x-1">
              <h4 className="font-extrabold text-sm md:text-base text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {movie.title.split(" (")[0]}
              </h4>
              <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-bold flex items-center justify-center sm:justify-start gap-1.5">
                <span>{movie.year}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                <span>{movie.duration}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
