import { Link } from "react-router-dom";
import { ArrowRight, Droplet } from "lucide-react";

export default function SectionHeader({ title, link }) {
  return (
    <div className="flex items-start justify-between mb-8 group relative perspective-1000">
      <style>{`
        @keyframes sway-water {
          0%, 100% { transform: rotate(-1.5deg) translateY(0px); }
          50% { transform: rotate(1.5deg) translateY(-6px); }
        }
        @keyframes sway-water-reverse {
          0%, 100% { transform: rotate(2deg) translateY(-4px); }
          50% { transform: rotate(-1.5deg) translateY(2px); }
        }
        @keyframes wave-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .talisman-sway {
          animation: sway-water 5s ease-in-out infinite;
          transform-origin: top center;
          will-change: transform;
        }
        .talisman-sway-reverse {
          animation: sway-water-reverse 6s ease-in-out infinite;
          transform-origin: top center;
          will-change: transform;
        }
        .water-wave-effect {
          background-size: 200% 200%;
          animation: wave-bg 6s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col items-center talisman-sway relative ml-2">
        <div className="w-0.5 h-20 bg-linear-to-b from-transparent via-blue-400/60 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] -mt-1 z-10" />
        <div className="relative water-wave-effect bg-linear-to-br from-blue-100/90 via-cyan-50/90 to-blue-200/90 backdrop-blur-md border border-white/60 px-8 py-3 min-w-50 text-center shadow-[0_8px_30px_rgba(37,99,235,0.15)] -mt-0.5 overflow-hidden rounded-sm">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400/60"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400/60"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400/60"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400/60"></div>
          <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_2s_infinite]"></div>

          <h2 className="text-xl lg:text-2xl font-black capitalize tracking-widest relative z-10 flex items-center gap-3 text-slate-900 drop-shadow-sm">
            <Droplet
              size={20}
              className="text-blue-500 animate-[pulse_3s_ease-in-out_infinite] fill-blue-200"
            />
            {title}
            <Droplet
              size={20}
              className="text-blue-500 animate-[pulse_3s_ease-in-out_infinite] fill-blue-200"
            />
          </h2>
        </div>
        <div className="flex gap-4 mt-1 opacity-60">
          <div className="w-1.5 h-10 bg-linear-to-b from-blue-300/80 to-transparent rounded-b-full"></div>
          <div className="w-1.5 h-16 bg-linear-to-b from-blue-400/80 to-transparent mt-2 rounded-b-full"></div>
          <div className="w-1.5 h-10 bg-linear-to-b from-blue-300/80 to-transparent rounded-b-full"></div>
        </div>
      </div>
      {link && (
        <div className="flex flex-col items-center talisman-sway-reverse mt-4 mr-2">
          <div className="w-px h-14 bg-linear-to-b from-transparent to-blue-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 -mt-0.5 z-10" />
          <Link
            to={link}
            className="relative water-wave-effect bg-linear-to-br from-blue-50/90 via-white/80 to-cyan-50/90 backdrop-blur-sm border border-white/80 px-4 py-2 hover:border-blue-300 transition-all duration-300 flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.1)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.2)] -mt-px rounded-sm group/link overflow-hidden"
          >
            <span className="font-bold text-[11px] text-slate-800 group-hover/link:text-blue-700 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5 relative z-10">
              Xem tất cả
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform duration-300 text-blue-500"
              />
            </span>
          </Link>
          <div className="w-3 h-6 border-x border-b border-blue-200/80 rounded-b-full mt-1 bg-linear-to-b from-blue-100/50 to-transparent"></div>
        </div>
      )}
    </div>
  );
}
