import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, link }) {
  return (
    <div className="flex items-end justify-between mb-5 group">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
        <h2 className="text-xl lg:text-2xl font-extrabold capitalize tracking-tight text-slate-800">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1.5 font-semibold text-[11px] text-slate-400 hover:text-blue-600 transition-all uppercase tracking-wider"
        >
          Xem tất cả
          <span className="bg-slate-100 p-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all">
            <ArrowRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </Link>
      )}
    </div>
  );
}
