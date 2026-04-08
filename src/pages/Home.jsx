import React, { useState, useEffect } from 'react';
import { Play, ChevronRight, ChevronLeft, Star, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { actionMovies, romanceMovies, animatedMovies, suggestions } from '../data/mockMovies';

const Home = () => {
  const navigate = useNavigate();
  // Lấy phim nổi bật từ data (phim đầu tiên trong suggestions)
  const [featuredMovie, setFeaturedMovie] = useState(suggestions[0]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 pb-20 font-sans">
      {/* Epic Full-Screen Hero Section */}
      <div className="relative min-h-[85vh] lg:min-h-screen w-full group overflow-hidden bg-black selection:bg-blue-600 selection:text-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={featuredMovie.backdrop || featuredMovie.image}
            alt="Hero Background"
            className="w-full h-full object-cover object-top opacity-80 transform scale-100 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
          />
          {/* Subtle vignette and cinematic gradient */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/90 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 bg-gradient-to-r from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end px-4 sm:px-8 lg:px-16 pb-28 sm:pb-36 lg:pb-40 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 z-10 min-h-[85vh] lg:min-h-screen">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-extrabold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/30 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Phim Nổi Bật
            </div>
            
            <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-gray-900 drop-shadow-md leading-[1.05] animate-fade-in-up" style={{animationDelay: '100ms'}}>
              {featuredMovie.title.split(' (')[0]}
            </h2>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-gray-700 animate-fade-in-up" style={{animationDelay: '150ms'}}>
               <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" /> {featuredMovie.rating}
               </div>
               <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
                  <Calendar className="w-4 h-4 text-gray-500" /> {featuredMovie.year}
               </div>
               <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
                  <Clock className="w-4 h-4 text-gray-500" /> {featuredMovie.duration}
               </div>
               <span className="bg-gray-900 text-white px-2 py-1 rounded text-[10px] uppercase tracking-wider font-extrabold">HD</span>
            </div>

            <p className="text-base lg:text-lg text-gray-700 max-w-xl font-medium leading-relaxed animate-fade-in-up line-clamp-3 md:line-clamp-4" style={{animationDelay: '200ms'}}>
              {featuredMovie.desc}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
              <button 
                onClick={() => navigate(`/movie-view/${featuredMovie.id}`)}
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gray-900/30 active:scale-95 font-black text-sm tracking-widest uppercase">
                <Play className="w-5 h-5 fill-current" />
                <span>Xem Ngay</span>
              </button>
              <button 
                onClick={() => navigate(`/movies/${featuredMovie.id}`)}
                className="flex items-center justify-center gap-2 bg-white/80 text-gray-900 border border-gray-300 backdrop-blur-xl px-8 py-4 rounded-2xl hover:bg-white transition-all duration-300 hover:scale-[1.03] active:scale-95 font-black text-sm uppercase tracking-widest shadow-lg">
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
            <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <p className="text-blue-600 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1">
                Dành riêng cho bạn
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Gợi ý thông minh
              </h3>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="p-3 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 border-2 border-gray-200 bg-white shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 border-2 border-gray-200 bg-white shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {suggestions.map((movie, index) => (
              <div 
                key={movie.id} 
                onClick={() => navigate(`/movies/${movie.id}`)}
                className="group relative aspect-[16/10] md:aspect-video rounded-[32px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 transition-all duration-500 bg-gray-900 border-4 border-white animate-fade-in-up"
                style={{animationDelay: `${500 + index * 100}ms`}}
              >
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

                <div className="absolute top-5 left-5 z-10 transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 font-black text-white text-[11px] px-4 py-2 rounded-xl shadow-lg border border-white/20">
                    {movie.match}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg tracking-tight">{movie.title.split(' (')[0]}</h4>
                  <p className="text-sm text-gray-300 font-bold line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {movie.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full my-8"></div>

        {/* Movie Rows */}
        <MovieRow title="Phim Hành Động" indicatorColor="bg-blue-600" movies={actionMovies} navigate={navigate} categorySlug="hanh-dong" />
        <MovieRow title="Phim Tình Cảm" indicatorColor="bg-pink-500" movies={romanceMovies} navigate={navigate} categorySlug="tinh-cam" />
        <MovieRow title="Phim Hoạt Hình" indicatorColor="bg-yellow-500" movies={animatedMovies} navigate={navigate} categorySlug="hoat-hinh" />
      </div>
    </div>
  );
};

export default Home;

// --- Components ---

const MovieRow = ({ title, indicatorColor, movies, navigate, categorySlug }) => {
  return (
    <section className="space-y-6 pt-2">
      <div 
        className="flex items-center justify-between group cursor-pointer w-full"
        onClick={() => navigate(`/movies${categorySlug ? `?category=${categorySlug}` : ''}`)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-2 h-8 rounded-full transform group-hover:scale-y-125 transition-transform duration-300 ${indicatorColor} shadow-md`}></div>
          <h3 className="text-2xl sm:text-3xl md:text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] sm:text-sm font-black text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 px-4 rounded-full shadow-sm tracking-wider uppercase transition-colors group-hover:text-blue-700 border border-blue-100">
          Khám phá <ChevronRight className="w-4 h-4 ml-0.5" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-8 pb-4 md:pb-0 px-1 py-4">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="flex flex-col gap-4 group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden bg-gray-200 shadow-md hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 transform group-hover:-translate-y-3 ring-1 ring-black/5 group-hover:ring-blue-500/40">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Play Icon Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl border border-white/40">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                 </div>
              </div>

              {/* Tag Rating */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                 <span className="bg-white/90 backdrop-blur-md text-gray-900 font-black text-[11px] px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 border border-gray-200">
                    <Star className="w-3 h-3 text-yellow-500 fill-current"/> {movie.rating} 
                 </span>
              </div>
            </div>
            
            <div className="px-2 text-center sm:text-left">
              <h4 className="font-extrabold text-sm md:text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{movie.title.split(' (')[0]}</h4>
              <p className="text-[11px] md:text-sm text-gray-500 mt-1.5 font-bold flex items-center justify-center sm:justify-start gap-2 object-cover">
                <span>{movie.year}</span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span>{movie.duration}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
