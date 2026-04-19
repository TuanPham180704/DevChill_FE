import Input from "../../Input";
import Textarea from "../../Textarea";

export default function InfoTab({ edit, onChange, contracts, errors }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Name"
        value={edit.name}
        onChange={(v) => onChange("name", v)}
        error={errors.name}
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}
      <Input
        label="Origin Name"
        value={edit.origin_name}
        onChange={(v) => onChange("origin_name", v)}
      />
      <Input
        label="Year"
        value={edit.year}
        onChange={(v) => onChange("year", v)}
      />

      <div>
        <label>Type</label>
        <select
          value={edit.type || ""}
          onChange={(e) => onChange("type", e.target.value)}
        >
          <option value="">Chọn Tập/Series</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>
      </div>

      <Input
        label="Duration"
        value={edit.duration}
        onChange={(v) => onChange("duration", v)}
      />
      <Input
        label="Episode Total"
        value={edit.episode_total}
        onChange={(v) => onChange("episode_total", v)}
      />

      <div>
        <label>Contract</label>
        <select
          value={edit.contract_id || ""}
          onChange={(e) => onChange("contract_id", e.target.value)}
        >
          <option value="">Select</option>
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.contract_id && (
          <p className="text-red-500">{errors.contract_id}</p>
        )}
      </div>

      <Textarea
        label="Content"
        value={edit.content}
        onChange={(v) => onChange("content", v)}
      />
    </div>
  );
}
