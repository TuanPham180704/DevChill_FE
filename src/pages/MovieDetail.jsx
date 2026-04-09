import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Star, Clock, Calendar, Heart, Share2, Film } from 'lucide-react';
import { allMovies } from '../data/mockMovies';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundMovie = allMovies.find(m => m.id.toString() === id?.toString());
    setMovie(foundMovie || allMovies[0]);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      {/* Hero Backdrop Overlay */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full group overflow-hidden bg-slate-900">
         <img 
            src={movie.backdrop || movie.image} 
            className="w-full h-full object-cover opacity-70 transform group-hover:scale-105 transition-transform duration-[20s] ease-linear mix-blend-overlay" 
            alt="Backdrop" 
         />
         {/* Lớp gradient sắc nét phai màu dần xuống nền trắng */}
         <div className="absolute inset-x-0 bottom-0 lg:h-[120%] -bottom-[20%] bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
         
         {/* Top Navbar Area for Back button */}
         <div className="absolute top-0 left-0 w-full p-6 sm:p-8 z-20 flex justify-between items-center bg-gradient-to-b from-slate-900/60 to-transparent">
            <button 
               onClick={() => navigate(-1)} 
               className="flex items-center gap-2 text-white hover:text-blue-300 transition-all bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-bold text-sm border border-white/20 hover:border-white/40 shadow-sm"
            >
               <ChevronLeft className="w-5 h-5" /> Trở lại
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-sm">
               <Share2 className="w-5 h-5"/>
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 -mt-32 sm:-mt-48 flex flex-col lg:flex-row gap-10 lg:gap-16">
         {/* Left Poster */}
         <div className="w-60 sm:w-72 lg:w-1/3 max-w-[340px] shrink-0 mx-auto lg:mx-0">
             <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-blue-900/15 ring-4 ring-white relative group animate-float-in">
                <img 
                   src={movie.image} 
                   alt="Poster" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                       onClick={() => navigate(`/movie-view/${movie.id}`)}
                       className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:bg-white"
                    >
                        <Play className="w-10 h-10 text-blue-600 fill-blue-600 ml-2" />
                    </button>
                </div>
             </div>
         </div>

         {/* Right Details */}
         <div className="flex-1 mt-6 lg:mt-24 space-y-7 animate-float-in delay-1">
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                 {movie.category || 'Phim rạp'}
              </span>
              <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                 Siêu phẩm
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight drop-shadow-sm">
               {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 animate-float-in delay-2 py-2">
               <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 shadow-sm transition-transform hover:-translate-y-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-slate-800 font-black text-base">{movie.rating || '4.8'}</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <Clock className="w-4 h-4 text-blue-500" /> <span className="font-bold">{movie.duration}</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-blue-500" /> <span className="font-bold">{movie.year}</span>
               </div>
               <span className="border-2 border-slate-300 px-3 py-1.5 rounded-lg text-xs font-black text-slate-600 tracking-widest bg-slate-50 shadow-sm">
                  16+
               </span>
            </div>

            <p className="text-slate-600 leading-relaxed text-base sm:text-lg text-justify font-medium animate-float-in delay-3 py-2">
               {movie.desc}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-float-in delay-4">
               <button 
                  onClick={() => navigate(`/movie-view/${movie.id}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all duration-300 font-extrabold text-[15px] tracking-widest uppercase"
               >
                  <Play className="w-5 h-5 fill-current" /> XEM NGAY
               </button>
               <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-red-200 hover:text-red-500 active:scale-95 transition-all duration-300 font-extrabold text-[15px] tracking-widest uppercase shadow-sm group">
                  <Heart className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" /> Yêu Thích 
               </button>
            </div>
            
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 animate-float-in delay-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-2">Đạo diễn</h4>
                  <p className="font-extrabold text-slate-800 text-lg">{movie.director || 'Đang cập nhật'}</p>
               </div>
               <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-2">Diễn viên</h4>
                  <p className="font-extrabold text-slate-800 text-lg leading-tight">{movie.cast || 'Đang cập nhật'}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Trailer/More Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-20 sm:mt-28 animate-float-in delay-6">
         <div className="flex items-center gap-3 mb-8">
            <Film className="w-7 h-7 text-indigo-500" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trích đoạn & Hình ảnh</h3>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video rounded-3xl overflow-hidden bg-white relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 transition-all duration-500 transform">
               <img src={movie.backdrop} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Trailer 1" />
               <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform shadow-lg">
                     <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                  </div>
               </div>
            </div>
            {/* videos demo */}
            <div className="aspect-video rounded-3xl overflow-hidden bg-white relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 transition-all duration-500 transform">
               <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2672&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Trailer 2" />
               <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform shadow-lg">
                     <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                  </div>
               </div>
            </div>
            <div className="aspect-video rounded-3xl overflow-hidden bg-white relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 transition-all duration-500 transform hidden lg:block">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Trailer 3" />
               <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform shadow-lg">
                     <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
