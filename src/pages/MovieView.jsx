import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, AlertCircle, MonitorPlay, Heart, Star, Play, Clock, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import Hls from 'hls.js';
import { allMovies } from '../data/mockMovies';

export default function MovieView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [activeServer, setActiveServer] = useState(1);
  const [comment, setComment] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Tìm phim đúng chuẩn ID (phát phim trên id)
    const foundMovie = allMovies.find(m => m.id.toString() === id?.toString());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovie(foundMovie || allMovies[0]);
  }, [id]);

  useEffect(() => {
    if (!movie?.videoUrl || !videoRef.current) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
         // Options can be tuned here
      });
      hls.loadSource(movie.videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoRef.current.play().catch(e => console.log("Auto-play blocked", e));
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Dành cho Safari hỗ trợ HLS native
      videoRef.current.src = movie.videoUrl;
      videoRef.current.addEventListener('loadedmetadata', function() {
        videoRef.current.play().catch(e => console.log("Auto-play blocked", e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16 overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Floating Header */}
      <header className="fixed top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
         <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-all bg-white hover:bg-slate-50 px-5 py-2.5 rounded-full font-bold text-sm border border-slate-200 hover:border-blue-200 shadow-sm group"
         >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Quay về</span>
         </button>
         
         <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-widest text-xs sm:text-sm uppercase drop-shadow-sm bg-white/50 px-4 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Đang Phát Phần Chính
         </div>

         <div className="flex gap-2 sm:gap-3">
             <button className="p-2.5 bg-white hover:bg-slate-50 rounded-full text-slate-600 hover:text-blue-600 transition-colors border border-slate-200 hover:border-blue-200 shadow-sm" title="Báo cáo lỗi">
                <AlertCircle className="w-4 h-4"/>
             </button>
             <button className="p-2.5 bg-white hover:bg-slate-50 rounded-full text-slate-600 hover:text-blue-600 transition-colors border border-slate-200 hover:border-blue-200 shadow-sm" title="Chia sẻ">
                <Share2 className="w-4 h-4"/>
             </button>
         </div>
      </header>

      <main className="relative z-10 pt-24 sm:pt-28 lg:pt-32 max-w-400 mx-auto px-0 sm:px-4 lg:px-8">
         
         {/* Video Player Section */}
         <div className="w-full relative animate-fade-in-up">
            {/* Ambient Border Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-none sm:rounded-[32px] blur-md opacity-10 hidden sm:block"></div>
            
            <div className="relative w-full aspect-video bg-black sm:rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 border-y sm:border-2 border-slate-800 z-10 group">
               <video
                 ref={videoRef}
                 controls
                 playsInline
                 crossOrigin="anonymous"
                 poster={movie?.backdrop}
                 className="absolute inset-0 w-full h-full bg-black outline-none"
               ></video>
            </div>
         </div>

         {/* Content Grid Below Player */}
         <div className="mt-8 sm:mt-10 flex flex-col xl:flex-row gap-8 lg:gap-10 px-4 sm:px-6 xl:px-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            {/* Left Column: Movie Info, Server & Comments */}
            <div className="flex-1 space-y-8">
               
               {/* Title & Core Meta */}
               <div className="pb-8 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                     <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{movie.category}</span>
                     <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                     <span>{movie.year}</span>
                     <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                     <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {movie.duration}</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                     {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-amber-600 font-extrabold text-lg shadow-sm">
                        <Star className="w-5 h-5 fill-current" /> {movie.rating}
                     </div>
                     <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-red-200 px-6 py-2.5 rounded-2xl text-slate-700 font-bold transition-all shadow-sm group">
                        <Heart className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" /> Yêu thích
                     </button>
                  </div>
               </div>

               {/* Server Selection */}
               <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-800 font-extrabold mb-6 text-sm uppercase tracking-widest">
                     <MonitorPlay className="w-5 h-5 text-indigo-500" /> Bản dịch & Lồng tiếng
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     {/* Server Button 1: Vietsub */}
                     <button 
                        onClick={() => setActiveServer(1)}
                        className={`relative p-5 rounded-3xl border-2 overflow-hidden text-left transition-all ${
                           activeServer === 1 
                           ? 'bg-blue-50 border-blue-400 shadow-md text-blue-900 scale-[1.02]' 
                           : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                        }`}
                     >
                        <div className="font-extrabold mb-1.5 text-lg">Phụ Đề Vietsub</div>
                        <div className="text-xs font-bold opacity-80">Giữ trọn âm thanh gốc</div>
                        {activeServer === 1 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-5 w-6 h-6 text-blue-600" />}
                     </button>
                     
                     {/* Server Button 2: Lồng Tiếng */}
                     <button 
                        onClick={() => setActiveServer(2)}
                        className={`relative p-5 rounded-3xl border-2 overflow-hidden text-left transition-all ${
                           activeServer === 2 
                           ? 'bg-blue-50 border-blue-400 shadow-md text-blue-900 scale-[1.02]' 
                           : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                        }`}
                     >
                        <div className="font-extrabold mb-1.5 text-lg">Lồng Tiếng</div>
                        <div className="text-xs font-bold opacity-80">Thuyết minh Tiếng Việt</div>
                        {activeServer === 2 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-5 w-6 h-6 text-blue-600" />}
                     </button>
                  </div>
               </div>

               {/* Comments Section */}
               <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="font-extrabold text-xl text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
                     <MessageSquare className="w-5 h-5 text-blue-600" /> Bình luận ({movie.rating > 4.5 ? '128' : '42'})
                  </h3>
                  
                  {/* Nhập bình luận */}
                  <div className="flex gap-4 mb-10">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                        US
                     </div>
                     <div className="flex-1 relative">
                        <textarea 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-16 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-sm sm:text-base font-medium"
                           placeholder="Chia sẻ cảm nghĩ của bạn..."
                           rows="2"
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="absolute right-3 bottom-3 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md active:scale-95">
                           <Send className="w-4 h-4"/>
                        </button>
                     </div>
                  </div>

                  {/* Danh sách bình luận */}
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200">
                           <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 w-full">
                           <div className="flex items-baseline gap-2 mb-2">
                              <h5 className="font-extrabold text-slate-900">Hoàng Phúc</h5>
                              <span className="text-xs text-slate-400 font-bold">2 giờ trước</span>
                           </div>
                           <p className="text-slate-700 text-sm leading-relaxed font-medium">Phim quá đỉnh! Chờ bao ngày cuối cùng cũng có để coi. Âm thanh nghe từ server VIP xịn hẵn lên.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200">
                           <img src="https://i.pravatar.cc/150?u=2" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 w-full">
                           <div className="flex items-baseline gap-2 mb-2">
                              <h5 className="font-extrabold text-slate-900">Nguyễn Yến</h5>
                              <span className="text-xs text-slate-400 font-bold">1 ngày trước</span>
                           </div>
                           <p className="text-slate-700 text-sm leading-relaxed font-medium">Cám ơn DevChill đã có Vietsub nhanh thế này. Chất lượng hình ảnh cực tốt nha mọi người ❤️</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200">
                           <img src="https://i.pravatar.cc/150?u=3" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 w-full">
                           <div className="flex items-baseline gap-2 mb-2">
                              <h5 className="font-extrabold text-slate-900">Tấn Tài Phát</h5>
                              <span className="text-xs text-slate-400 font-bold">3 ngày trước</span>
                           </div>
                           <p className="text-slate-700 text-sm leading-relaxed font-medium">Khúc cuối xem nổi da gà!!! Đỉnh cao thực sự.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Right Column: Related Suggestions */}
            <div className="w-full xl:w-95 shrink-0">
               <div className="bg-white border border-slate-200 rounded-3xl p-6 h-full shadow-sm sticky top-28">
                  <h3 className="font-extrabold text-xl text-slate-900 mb-6 uppercase tracking-wider relative pt-2">
                     <span className="absolute top-0 left-0 w-8 h-1.5 bg-indigo-500 rounded-full"></span>
                     Cùng thể loại
                  </h3>
                  
                  <div className="space-y-4">
                     {allMovies.filter(m => m.id !== movie.id).slice(0, 5).map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => {
                              navigate(`/movie-view/${item.id}`);
                              window.scrollTo(0,0);
                          }}
                          className="flex gap-4 group cursor-pointer p-2.5 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 hover:shadow-sm"
                        >
                            <div className="w-32 relative aspect-video rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-sm">
                               <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                               <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                                  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300 shadow-sm">
                                     <Play className="w-4 h-4 text-blue-600 fill-blue-600 ml-1" />
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col justify-center py-1">
                               <h4 className="text-slate-800 text-sm font-extrabold line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{item.title}</h4>
                               <p className="text-slate-500 text-[11px] font-bold mt-2 tracking-wide uppercase flex items-center gap-1">
                                 {item.year} <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span> {item.rating} ⭐
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