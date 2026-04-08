import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, AlertCircle, MonitorPlay, Heart, Star, Sparkles, Play, Clock, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { allMovies } from '../data/mockMovies';

export default function MovieView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [activeServer, setActiveServer] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Tìm phim đúng chuẩn ID (phát phim trên id)
    const foundMovie = allMovies.find(m => m.id.toString() === id?.toString());
    setMovie(foundMovie || allMovies[0]);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans pb-16 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Floating Header */}
      <header className="fixed top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
         <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-xl font-bold text-sm border border-white/10 shadow-lg group"
         >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Quay về</span>
         </button>
         
         <div className="flex items-center gap-2 text-white font-black tracking-widest text-xs sm:text-sm uppercase drop-shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Đang Phát Phần Chính
         </div>

         <div className="flex gap-2 sm:gap-3">
             <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white backdrop-blur-xl transition-colors border border-white/10" title="Báo cáo lỗi">
                <AlertCircle className="w-4 h-4"/>
             </button>
             <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white backdrop-blur-xl transition-colors border border-white/10" title="Chia sẻ">
                <Share2 className="w-4 h-4"/>
             </button>
         </div>
      </header>

      <main className="relative z-10 pt-16 sm:pt-20 lg:pt-24 max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-8">
         
         {/* Video Player Section */}
         <div className="w-full relative animate-fade-in-up">
            {/* Ambient Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-none sm:rounded-[32px] blur-sm opacity-20 hidden sm:block"></div>
            
            <div className="relative w-full aspect-video bg-black sm:rounded-3xl overflow-hidden shadow-2xl border-y sm:border border-white/10 z-10">
               {/* Giả lập iframe Player - Trong thực tế src có thể đổi theo trạng thái activeServer và movie.id */}
               <iframe 
                 width="100%" 
                 height="100%" 
                 src="https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&rel=0&modestbranding=1" 
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
                 className="absolute inset-0 w-full h-full object-cover"
               ></iframe>
            </div>
         </div>

         {/* Content Grid Below Player */}
         <div className="mt-8 sm:mt-12 flex flex-col xl:flex-row gap-8 lg:gap-10 px-4 sm:px-6 xl:px-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            {/* Left Column: Movie Info, Server & Comments */}
            <div className="flex-1 space-y-8">
               
               {/* Title & Core Meta */}
               <div className="pb-8 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
                     <span className="text-blue-400">{movie.category}</span>
                     <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                     <span>{movie.year}</span>
                     <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                     <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {movie.duration}</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                     {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-2xl text-yellow-500 font-black text-lg">
                        <Star className="w-5 h-5 fill-current" /> {movie.rating}
                     </div>
                     <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 rounded-2xl text-white font-bold transition-colors">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" /> Thêm Yêu thích
                     </button>
                  </div>
               </div>

               {/* Server Selection */}
               <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-white font-bold mb-6 text-sm uppercase tracking-widest">
                     <MonitorPlay className="w-5 h-5 text-indigo-400" /> Bản dịch & Lồng tiếng
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {/* Server Button 1: Vietsub */}
                     <button 
                        onClick={() => setActiveServer(1)}
                        className={`relative p-5 rounded-2xl border overflow-hidden text-left transition-all ${
                           activeServer === 1 
                           ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] text-white' 
                           : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        <div className="font-black mb-1.5 text-lg">Phụ Đề Vietsub</div>
                        <div className="text-xs font-semibold opacity-70">Phụ đề tiếng Việt cực chuẩn, giữ trọn âm gốc</div>
                        {activeServer === 1 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-5 w-6 h-6 text-blue-500" />}
                     </button>
                     
                     {/* Server Button 2: Lồng Tiếng */}
                     <button 
                        onClick={() => setActiveServer(2)}
                        className={`relative p-5 rounded-2xl border overflow-hidden text-left transition-all ${
                           activeServer === 2 
                           ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] text-white' 
                           : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        <div className="font-black mb-1.5 text-lg">Lồng Tiếng</div>
                        <div className="text-xs font-semibold opacity-70">Thuyết minh + Lồng tiếng Việt nam</div>
                        {activeServer === 2 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-5 w-6 h-6 text-blue-500" />}
                     </button>
                  </div>
               </div>

               {/* Comments Section (Replacing Description) */}
               <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-3xl p-6 sm:p-8">
                  <h3 className="font-extrabold text-xl text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
                     <MessageSquare className="w-5 h-5 text-blue-500" /> Bình luận ({movie.rating > 4.5 ? '128' : '42'})
                  </h3>
                  
                  {/* Nhập bình luận */}
                  <div className="flex gap-3 sm:gap-4 mb-8">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
                        You
                     </div>
                     <div className="flex-1 relative">
                        <textarea 
                           className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-14 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors resize-none text-sm sm:text-base font-medium"
                           placeholder="Hãy chia sẻ cảm nghĩ của bạn về phim này..."
                           rows="2"
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-md">
                           <Send className="w-4 h-4"/>
                        </button>
                     </div>
                  </div>

                  {/* Danh sách bình luận */}
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
                           <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 w-full">
                           <div className="flex items-baseline gap-2 mb-1.5">
                              <h5 className="font-bold text-gray-200">Hoàng Phúc</h5>
                              <span className="text-xs text-gray-500 font-semibold">2 giờ trước</span>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed">Phim quá đỉnh! Chờ bao ngày cuối cùng cũng có để coi. Âm thanh nghe từ server VIP xịn hẵn lên.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
                           <img src="https://i.pravatar.cc/150?u=2" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 w-full">
                           <div className="flex items-baseline gap-2 mb-1.5">
                              <h5 className="font-bold text-gray-200">Nguyễn Yến</h5>
                              <span className="text-xs text-gray-500 font-semibold">1 ngày trước</span>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed">Cám ơn DevChill đã có Vietsub nhanh thế này. Chất lượng hình ảnh cực tốt nha mọi người ❤️</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
                           <img src="https://i.pravatar.cc/150?u=3" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 w-full">
                           <div className="flex items-baseline gap-2 mb-1.5">
                              <h5 className="font-bold text-gray-200">Tấn Tài Phát</h5>
                              <span className="text-xs text-gray-500 font-semibold">3 ngày trước</span>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed">Khúc cuối xem nổi da gà!!! Đỉnh cao thực sự.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Right Column: Related Suggestions */}
            <div className="w-full xl:w-[380px] shrink-0">
               <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-3xl p-5 sm:p-6 h-full">
                  <h3 className="font-black text-xl text-white mb-6 uppercase tracking-wider relative pt-2">
                     <span className="absolute top-0 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
                     Cùng thể loại
                  </h3>
                  
                  <div className="space-y-4">
                     {allMovies.filter(m => m.id !== movie.id).slice(0, 5).map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => navigate(`/movie-view/${item.id}`)}
                          className="flex gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                        >
                            <div className="w-32 relative aspect-video rounded-xl overflow-hidden shrink-0 border border-white/10">
                               <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                               </div>
                            </div>
                            <div className="flex flex-col justify-center py-1">
                               <h4 className="text-gray-200 text-sm font-bold line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">{item.title}</h4>
                               <p className="text-gray-500 text-[11px] font-black mt-2 tracking-wide uppercase">
                                 {item.year} • {item.rating} ⭐
                               </p>
                            </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </main>
    </div>
  );
}