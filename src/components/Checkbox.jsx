export default function Checkbox({
  label,
  checked = false,
  onChange,
  id,
  disabled = false,
}) {
  const checkboxId = id || `checkbox-${label?.replace(/\s+/g, "-")}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`flex items-center gap-2 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
