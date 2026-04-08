import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Play, Filter, LayoutGrid } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-24">
      <div className="pt-24 sm:pt-32 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
         
         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
               <p className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-3 shadow-sm animate-fade-in-up">
                 Thư viện phim
               </p>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
                 {displayTitle}
               </h1>
            </div>
            
            <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 shadow-sm">
                  <Filter className="w-4 h-4" /> Bọ lọc
               </button>
               <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none hover:shadow-md transition-all shadow-sm appearance-none cursor-pointer pr-8 w-40 active:scale-95">
                  <option>Mới nhất</option>
                  <option>Phổ biến nhất</option>
                  <option>Đánh giá cao</option>
               </select>
               <div className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300 transition-colors">
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
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  className="flex flex-col gap-3 group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${(index % 6) * 50}ms` }}
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 transform group-hover:-translate-y-2 ring-1 ring-black/5 group-hover:ring-blue-500/40">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-75 shadow-lg">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                       </div>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                       <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-black shadow-sm tracking-wider">
                          HD
                       </span>
                    </div>
                  </div>
                  
                  <div className="px-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{movie.title}</h4>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                       <p className="text-[11px] sm:text-xs text-gray-500 font-bold">{movie.year}</p>
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       <p className="text-[11px] sm:text-xs text-gray-500 font-bold">{movie.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="py-20 text-center text-gray-500 font-semibold">Chưa có phim nào trong thể loại này.</div>
         )}
         
         {/* Load More Button */}
         {movies.length > 0 && (
           <div className="flex justify-center mt-16 sm:mt-20">
              <button className="px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-800 rounded-xl font-black tracking-wider uppercase text-sm hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-sm active:scale-95 group">
                 Tải Thêm Phim
              </button>
           </div>
         )}

      </div>
    </div>
  );
}
