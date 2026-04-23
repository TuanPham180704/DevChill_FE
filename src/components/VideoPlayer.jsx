/* eslint-disable react-hooks/purity */
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({
  url,
  startTime = 0,
  isPremiere = false,
  onTimeUpdate,
}) {
  const videoRef = useRef(null);

  // Lưu lại thời điểm (Date.now()) lúc component mount
  const joinTimeRef = useRef(Date.now());
  // Lưu lại offset ban đầu
  const initialOffsetRef = useRef(startTime);

  useEffect(() => {
    let hls;
    const video = videoRef.current;

    if (url && Hls.isSupported()) {
      hls = new Hls({
        startPosition: startTime,
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Trình duyệt chặn Auto-play", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = startTime;
        video.play().catch((e) => console.log("Trình duyệt chặn Auto-play", e));
      });
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, startTime]);

  // Logic bắt sự kiện tua (Seeking)
  const handleSeeking = () => {
    if (!isPremiere || !videoRef.current) return;

    const video = videoRef.current;

    // Số giây trôi qua thực tế kể từ lúc user vào trang
    const elapsedSeconds = (Date.now() - joinTimeRef.current) / 1000;

    // Mốc thời gian LIVE hiện tại của hệ thống
    const maxAllowedTime = initialOffsetRef.current + elapsedSeconds;

    // Nếu user tua vượt quá mốc LIVE + 2s buffer -> Kéo ngược lại
    if (video.currentTime > maxAllowedTime + 2) {
      video.currentTime = maxAllowedTime;
    }
  };

  const handleTimeUpdate = () => {
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
      onTimeUpdate={handleTimeUpdate}
      onSeeking={handleSeeking} // Gọi hàm chặn tua ở đây
    />
  );
}
