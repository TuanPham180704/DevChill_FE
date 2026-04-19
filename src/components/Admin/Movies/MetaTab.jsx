import MetaInput from "../../MetaInput";
import MultiCheckbox from "../../MultiCheckbox";

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
  "Trung",
  "Mỹ",
  "Anh",
  "Thái",
  "Ấn",
];

export default function MetaTab({ edit, onChange }) {
  return (
    <div className="space-y-5 w-full">
      <MultiCheckbox
        label="Categories"
        options={CATEGORY_PRESET.map((name) => ({ name }))}
        value={edit.categories || []}
        onChange={(v) => onChange("categories", v)}
      />

      <MultiCheckbox
        label="Countries"
        options={COUNTRY_PRESET.map((name) => ({ name }))}
        value={edit.countries || []}
        onChange={(v) => onChange("countries", v)}
      />

      <MetaInput
        label="People"
        data={edit.people || []}
        hasRole
        onChange={(v) => onChange("people", v)}
      />
    </div>
  );
}
