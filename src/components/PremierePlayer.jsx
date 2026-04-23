/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Radio,
} from "lucide-react";

export default function PremierePlayer({ url, startTime = 0, onTimeUpdate }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const progressBarRef = useRef(null);

  // Dùng Date.now() làm mốc thời gian tuyệt đối của hệ thống
  const joinTimeRef = useRef(Date.now());
  const initialOffsetRef = useRef(startTime);
  const hlsRef = useRef(null); // Lưu trữ instance của HLS

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Tính mốc LIVE lý tưởng
  const getCurrentLiveEdge = () => {
    const elapsedSeconds = (Date.now() - joinTimeRef.current) / 1000;
    const vidDuration = videoRef.current?.duration || Infinity;
    return Math.min(initialOffsetRef.current + elapsedSeconds, vidDuration);
  };

  // 1. KHỞI TẠO HLS VỚI CẤU HÌNH LOW LATENCY
  useEffect(() => {
    const video = videoRef.current;

    const startVideo = () => {
      video.currentTime = getCurrentLiveEdge();
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    if (url && Hls.isSupported()) {
      const hls = new Hls({
        startPosition: startTime,
        lowLatencyMode: true,
        liveSyncDurationCount: 2,
        liveMaxLatencyDurationCount: 3,
        maxLiveSyncPlaybackRate: 1.2,
        backBufferLength: 30,
        enableWorker: true,
      });

      hlsRef.current = hls; 
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, startVideo);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", startVideo);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, startTime]);
  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime);
      }
      if (onTimeUpdate) onTimeUpdate(video.currentTime);

      const idealLiveEdge = getCurrentLiveEdge();
      const drift = idealLiveEdge - video.currentTime;
      if (!isDragging && drift > 3) {
        video.currentTime = idealLiveEdge;
      }
      else if (!isDragging && drift < -1) {
        video.currentTime = idealLiveEdge;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isDragging]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !progressBarRef.current || !videoRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      let pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      const liveEdge = getCurrentLiveEdge();
      let newTime = pos * liveEdge;

      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  const togglePlay = () => {
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    setIsPlaying(!videoRef.current.paused);
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    let newTime = videoRef.current.currentTime + seconds;
    const liveEdge = getCurrentLiveEdge();
    if (newTime > liveEdge) newTime = liveEdge;
    if (newTime < 0) newTime = 0;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const jumpToLive = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = getCurrentLiveEdge();
      if (!isPlaying) togglePlay();
    }
  };

  const handleProgressBarMouseDown = (e) => {
    setIsDragging(true);
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const liveEdge = getCurrentLiveEdge();
    let newTime = pos * liveEdge;
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) wrapperRef.current.requestFullscreen();
    else document.exitFullscreen();
  };
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !isDragging) setShowControls(false);
      }, 3000);
    };
    wrapperRef.current.addEventListener("mousemove", resetTimer);
    return () => clearTimeout(timeout);
  }, [isPlaying, isDragging]);

  const liveEdge = getCurrentLiveEdge();
  const progressPercent =
    liveEdge > 0 ? Math.min(100, (currentTime / liveEdge) * 100) : 100;
  const isWatchingPast = liveEdge - currentTime > 3;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black group font-sans overflow-hidden"
      onMouseLeave={() => {
        if (isPlaying && !isDragging) setShowControls(false);
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer object-contain"
        onClick={togglePlay}
        playsInline
      />

      <div
        className={`absolute bottom-0 left-0 right-0 px-5 pb-5 pt-20 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {isWatchingPast && (
          <button
            onClick={jumpToLive}
            className="absolute bottom-20 right-5 flex items-center gap-2 bg-black/70 hover:bg-black backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white transition-all shadow-lg animate-fade-in-up"
          >
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span className="text-[12px] font-bold">Về trực tiếp</span>
          </button>
        )}

        <div
          ref={progressBarRef}
          onMouseDown={handleProgressBarMouseDown}
          className="w-full h-1.5 bg-white/20 rounded-full mb-4 relative cursor-pointer group/bar"
        >
          <div
            className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
            style={{ width: `${progressPercent}%` }}
          >
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full scale-0 group-hover/bar:scale-100 ${isDragging ? "scale-100" : ""} transition-transform shadow-[0_0_10px_rgba(220,38,38,0.8)]`}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-5">
            <button
              onClick={togglePlay}
              className="hover:text-red-500 transition-colors"
            >
              {isPlaying ? (
                <Pause fill="currentColor" size={24} />
              ) : (
                <Play fill="currentColor" size={24} />
              )}
            </button>
            <button
              onClick={() => skip(-10)}
              className="hover:text-red-500 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => skip(10)}
              className="hover:text-red-500 transition-colors"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={toggleMute}
              className="hover:text-red-500 transition-colors ml-2"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors cursor-pointer ${isWatchingPast ? "bg-white/10 border-white/20" : "bg-red-600/20 border-red-500/30"}`}
              onClick={jumpToLive}
            >
              <span
                className={`w-2 h-2 rounded-full ${isWatchingPast ? "bg-gray-400" : "bg-red-500 animate-pulse"}`}
              ></span>
              <span
                className={`text-[11px] font-bold uppercase tracking-widest ${isWatchingPast ? "text-gray-300" : "text-red-500 animate-pulse"}`}
              >
                {isWatchingPast ? "Đang trễ" : "Trực tiếp"}
              </span>
            </div>
            <button
              onClick={handleFullscreen}
              className="hover:text-red-500 transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
