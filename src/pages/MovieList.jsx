import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Play, Filter, LayoutGrid, Star } from 'lucide-react';
import { allMovies } from '../data/mockMovies';

export default function MovieList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // Lọc data theo category
    if (category) {
       // eslint-disable-next-line react-hooks/immutability
       const keyTitle = getTitle();
       setMovies(allMovies.filter(m => m.category === keyTitle || m.category?.toLowerCase().includes(keyTitle.toLowerCase())));
    } else {
       setMovies(allMovies);
    }
  }, [category]);
  
  const getTitle = () => {
     switch(category) {
       case 'hanh-dong': return 'Hành động';
       case 'tinh-cam': return 'Tình cảm';
       case 'hoat-hinh': return 'Hoạt hình';
       default: return 'Tất Cả Phim';
     }
  };

  const displayTitle = category ? `Phim ${getTitle()}` : 'Tất Cả Phim';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 selection:bg-blue-200 selection:text-blue-900">
      <div className="pt-24 sm:pt-32 px-4 sm:px-8 lg:px-16 max-w-400 mx-auto">
         
         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
               <p className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 font-extrabold text-[10px] uppercase tracking-widest rounded-full mb-3 shadow-sm animate-fade-in-up border border-blue-200">
                 Thư viện phim
               </p>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
                 {displayTitle}
               </h1>
            </div>
            
            <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm">
                  <Filter className="w-4 h-4" /> Bộ lọc
               </button>
               <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 hover:bg-slate-50 transition-all shadow-sm appearance-none cursor-pointer pr-8 w-40 active:scale-95">
                  <option>Mới nhất</option>
                  <option>Phổ biến nhất</option>
                  <option>Đánh giá cao</option>
               </select>
               <div className="hidden sm:flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors">
                  <LayoutGrid className="w-5 h-5"/>
               </div>
            </div>
         </div>

         {/* Movie Grid */}
         {movies.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 lg:gap-8">
              {movies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  onClick={() => {
                     navigate(`/movies/${movie.id}`);
                     window.scrollTo(0, 0);
                  }}
                  className="flex flex-col gap-4 group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${(index % 6) * 50}ms` }}
                >
                  <div className="relative aspect-2/3 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-900/15 transition-all duration-500 transform group-hover:-translate-y-2 ring-1 ring-black/5 group-hover:ring-blue-500/30">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-75 shadow-lg">
                          <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                       </div>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                       <span className="bg-amber-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-extrabold shadow-sm flex items-center gap-1 border border-white/20">
                          <Star className="w-3 h-3 fill-current"/> {movie.rating || '4.8'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="px-1 text-center sm:text-left transition-transform duration-300 group-hover:translate-x-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{movie.title.split(' (')[0]}</h4>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1 text-slate-500 font-bold text-[11px] sm:text-xs">
                       <span>{movie.year}</span>
                       <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                       <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="py-20 text-center text-slate-500 font-semibold text-lg bg-white border border-slate-200 rounded-3xl shadow-sm">Chưa có phim nào trong thể loại này.</div>
         )}
         
         {/* Load More Button */}
         {movies.length > 0 && (
           <div className="flex justify-center mt-16 sm:mt-20">
              <button className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-extrabold tracking-wider uppercase text-sm hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300 shadow-sm active:scale-95 group">
                 Tải Thêm Phim
              </button>
           </div>
         )}

      </div>
    </div>
  );
}
