import { FaInfoCircle } from "react-icons/fa";
import Input from "../../Input";
import Textarea from "../../Textarea";

export default function InfoTab({ edit, onChange, contracts, errors }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 5 - i);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex items-center gap-2.5">
          <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
            <FaInfoCircle size={14} />
          </div>
          <h3 className="text-base font-bold text-slate-700 tracking-tight">
            Thông tin cơ bản
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              value={edit.name || ""}
              onChange={(v) => onChange("name", v)}
              error={errors.name}
              placeholder="VD: The Dark Knight"
            />
            <Input
              label="Origin Name"
              value={edit.origin_name || ""}
              onChange={(v) => onChange("origin_name", v)}
              placeholder="Tên gốc..."
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Year
              </label>
              <select
                value={edit.year || ""}
                onChange={(e) => onChange("year", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm
                transition-all duration-200
                hover:border-slate-300
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Chọn năm</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Type
              </label>
              <select
                value={edit.type || ""}
                onChange={(e) => onChange("type", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm
                transition-all duration-200
                hover:border-slate-300
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Chọn Movie / Series</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>
            <Input
              label="Duration"
              value={edit.duration || ""}
              onChange={(v) => onChange("duration", v)}
              placeholder="VD: 120 phút"
            />
            <Input
              label="Episode Total"
              value={edit.episode_total || ""}
              onChange={(v) => onChange("episode_total", v)}
              placeholder="VD: 12"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Contract
              </label>
              <select
                value={edit.contract_id || ""}
                onChange={(e) => onChange("contract_id", e.target.value)}
                className={`w-full rounded-xl bg-white px-3 py-2.5 text-sm shadow-sm
                transition-all duration-200
                hover:border-slate-300
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none
                ${errors.contract_id ? "border-red-400" : "border-slate-200"}`}
              >
                <option value="">Select contract</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {errors.contract_id && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.contract_id}
                </p>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Textarea
              label="Content"
              value={edit.content || ""}
              onChange={(v) => onChange("content", v)}
              placeholder="Mô tả nội dung phim..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
