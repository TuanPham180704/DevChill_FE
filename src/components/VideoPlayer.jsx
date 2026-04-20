import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ url, startTime = 0, onTimeUpdate }) {
  const videoRef = useRef(null);

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
    />
  );
}
