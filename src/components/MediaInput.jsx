export default function MediaInput({
  label,
  value,
  mode,
  onChange,
  onFile,
  onMode,
}) {
  return (
    <div>
      <label className="font-semibold">{label}</label>

      <div className="flex gap-2 mt-1">
        <select
          className="border p-2"
          value={mode || "url"}
          onChange={(e) => onMode(e.target.value)}
        >
          <option value="url">URL</option>
          <option value="folder">Folder</option>
        </select>

        {mode === "folder" ? (
          <input
            type="file"
            className="border p-2 flex-1"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        ) : (
          <input
            className="border p-2 flex-1"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
