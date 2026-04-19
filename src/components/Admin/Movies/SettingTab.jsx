import Select from "../../Select";
import Checkbox from "../../Checkbox";
import CheckList from "../../CheckList";

const STATUS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Hidden", value: "hidden" },
];
const LIFECYCLE = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];
const PRODUCTION = [
  { label: "Planning", value: "planning" },
  { label: "Filming", value: "filming" },
  { label: "Post Production", value: "post-production" },
];
const SOURCE = [
  { label: "Galaxy", value: "galaxy" },
  { label: "Netflix", value: "netflix" },
];
export default function SettingTab({ edit, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Select
        label="Status"
        value={edit.status}
        options={STATUS}
        onChange={(v) => onChange("status", v)}
      />
      <Select
        label="Lifecycle"
        value={edit.lifecycle_status}
        options={LIFECYCLE}
        onChange={(v) => onChange("lifecycle_status", v)}
      />
      <Select
        label="Production"
        value={edit.production_status}
        options={PRODUCTION}
        onChange={(v) => onChange("production_status", v)}
      />

      <Select
        label="Source"
        value={edit.source || ""}
        options={SOURCE}
        onChange={(v) => onChange("source", v)}
      />

      <Checkbox
        label="Available"
        checked={edit.is_available}
        onChange={(v) => onChange("is_available", v)}
      />
      <Checkbox
        label="Premium"
        checked={edit.is_premium}
        onChange={(v) => onChange("is_premium", v)}
      />
    </div>
  );
}
