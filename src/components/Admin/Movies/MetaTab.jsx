import { FaTags, FaGlobeAsia, FaUsers } from "react-icons/fa";
import MetaInput from "../../MetaInput";
import MultiCheckbox from "../../MultiCheckbox";

/* ===== PRESET ===== */
const CATEGORY_PRESET = [
  "Hành Động",
  "Kinh Dị",
  "Chính Kịch",
  "Tình Cảm",
  "Hài",
  "Phiêu Lưu",
  "Viễn Tưởng",
  "Hoạt Hình",
];

const COUNTRY_PRESET = [
  "Việt Nam",
  "Hàn Quốc",
  "Nhật",
  "Trung Quốc",
  "Mỹ",
  "Anh",
  "Thái",
  "Ấn",
];

export default function MetaTab({ edit, onChange }) {
  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <div className="p-2 rounded-lg bg-purple-100/50 text-purple-600">
            <FaTags size={14} />
          </div>
          <h3 className="text-base font-bold text-slate-700 tracking-tight">
            Metadata phim
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaTags className="text-purple-500" size={14} />
              <span>Thể loại</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-purple-300 transition-colors">
              <MultiCheckbox
                options={CATEGORY_PRESET.map((name) => ({ name }))}
                value={edit.categories || []}
                onChange={(v) => onChange("categories", v)}
              />
            </div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaGlobeAsia className="text-indigo-500" size={14} />
              <span>Quốc gia</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-indigo-300 transition-colors">
              <MultiCheckbox
                options={COUNTRY_PRESET.map((name) => ({ name }))}
                value={edit.countries || []}
                onChange={(v) => onChange("countries", v)}
              />
            </div>
          </section>
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaUsers className="text-blue-500" size={14} />
              <span>Diễn viên / Đạo diễn</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-300 transition-colors">
              <MetaInput
                data={edit.people || []}
                hasRole
                onChange={(v) => onChange("people", v)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
