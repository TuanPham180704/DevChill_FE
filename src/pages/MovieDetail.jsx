import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Star, Clock, Calendar, Heart, Share2, Info } from 'lucide-react';
import { allMovies } from '../data/mockMovies';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundMovie = allMovies.find(m => m.id.toString() === id?.toString());
    // Hiển thị phim tìm được hoặc fallback về phim đầu tiên đê demo
    setMovie(foundMovie || allMovies[0]);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20">
      {/* Hero Backdrop Overlay */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full bg-gray-900 group">
         <img 
            src={movie.backdrop || movie.image} 
            className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[15s] ease-linear" 
            alt="Backdrop" 
         />
         <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent" />
         
         {/* Top Navbar Area for Back button */}
         <div className="absolute top-0 left-0 w-full p-6 sm:p-8 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
            <button 
               onClick={() => navigate(-1)} 
               className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-bold text-sm"
            >
               <ChevronLeft className="w-5 h-5" /> Trở lại
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
               <Share2 className="w-5 h-5"/>
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 -mt-32 sm:-mt-48 flex flex-col md:flex-row gap-8 lg:gap-14">
         {/* Left Poster */}
         <div className="w-56 sm:w-64 md:w-1/3 max-w-[320px] shrink-0 mx-auto md:mx-0">
             <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 ring-4 ring-white bg-gray-200 relative group animate-fade-in-up">
                <img 
                   src={movie.image} 
                   alt="Poster" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                       onClick={() => navigate(`/movie-view/${movie.id}`)}
                       className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-75 shadow-xl hover:bg-white/50"
                    >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </button>
                </div>
             </div>
         </div>

         {/* Right Details */}
         <div className="flex-1 mt-4 md:mt-16 sm:mt-12 space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-wrap gap-2.5 mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-blue-500/30 uppercase tracking-widest">
                 {movie.category || 'Phim rạp'}
              </span>
              <span className="bg-white text-gray-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-gray-300 shadow-sm uppercase tracking-wider">
                 Siêu phẩm
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight drop-shadow-sm">
               {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-bold text-gray-600">
               <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-200">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-gray-900 font-black text-base">{movie.rating || '4.8'}</span>
               </div>
               <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <Clock className="w-4 h-4 text-gray-400" /> {movie.duration}
               </div>
               <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-gray-400" /> {movie.year}
               </div>
               <span className="border-2 border-gray-400 px-2 py-1 rounded-md text-xs font-black text-gray-500 tracking-wider">
                  16+
               </span>
            </div>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-medium text-justify">
               {movie.desc}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
               <button 
                  onClick={() => navigate(`/movie-view/${movie.id}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95 transition-all duration-300 font-black text-base tracking-wide"
               >
                  <Play className="w-5 h-5 fill-current" /> Tận Hưởng
               </button>
               <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-2xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-300 font-bold text-base group shadow-sm">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" /> Yêu Thích 
               </button>
            </div>
            
            <div className="pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
               <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1.5">Đạo diễn</h4>
                  <p className="font-bold text-gray-900 text-lg">{movie.director || 'Chưa cập nhật'}</p>
               </div>
               <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1.5">Diễn viên</h4>
                  <p className="font-bold text-gray-900 text-lg leading-tight">{movie.cast || 'Chưa cập nhật'}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Trailer/More Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-16 sm:mt-24">
         <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Multimedia & Trailers</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-4 border-white">
               <img src={movie.backdrop} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trailer 1" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform">
                     <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
               </div>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-4 border-white">
               <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2672&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trailer 2" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform">
                     <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
               </div>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-4 border-white hidden lg:block">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trailer 3" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform">
                     <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
