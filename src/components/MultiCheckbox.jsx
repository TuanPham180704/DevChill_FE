import { useState, useMemo } from "react";

export default function MultiCheckbox({
  label,
  options = [],
  value = [],
  onChange,
}) {
  const [custom, setCustom] = useState("");

  const getName = (item) => (typeof item === "string" ? item : item.name);

  const allOptions = useMemo(() => {
    const merged = [...options, ...value];

    const map = new Map();
    merged.forEach((item) => {
      map.set(getName(item), item);
    });

    return Array.from(map.values());
  }, [options, value]);

  const toggle = (item) => {
    const exists = value.some((v) => getName(v) === getName(item));

    if (exists) {
      onChange(value.filter((v) => getName(v) !== getName(item)));
    } else {
      onChange([...value, item]);
    }
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;

    const exists = value.some((item) => getName(item) === v);

    if (!exists) {
      onChange([...value, { name: v }]);
    }

    setCustom("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div className="w-full">
      <h4 className="font-bold mb-2">{label}</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {allOptions.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.some((v) => getName(v) === getName(opt))}
              onChange={() => toggle(opt)}
            />
            <span className="truncate">{getName(opt)}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Add more..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="bg-blue-500 text-white px-4 rounded disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
