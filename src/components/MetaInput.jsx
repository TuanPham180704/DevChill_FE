import { useState } from "react";

export default function MetaInput({ label, data = [], onChange, hasRole }) {
  const [custom, setCustom] = useState("");

  const update = (i, field, value) => {
    const newArr = data.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item,
    );
    onChange(newArr);
  };

  const add = () => {
    const v = custom.trim();
    if (!v) return;

    // ✅ tránh trùng name
    if (data.some((item) => item.name === v)) {
      setCustom("");
      return;
    }

    const newItem = hasRole ? { name: v, role: "actor" } : { name: v };

    onChange([...(data || []), newItem]);
    setCustom("");
  };

  // ✅ ENTER để add
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="w-full">
      <h4 className="font-bold mb-2">{label}</h4>

      {/* LIST */}
      <div className="space-y-2">
        {data?.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="border p-2 flex-1 rounded"
              value={item.name || ""}
              onChange={(e) => update(i, "name", e.target.value)}
            />

            {hasRole && (
              <input
                className="border p-2 w-32 rounded"
                value={item.role || ""}
                onChange={(e) => update(i, "role", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          className="border p-2 flex-1 rounded"
          placeholder={`Add ${label}...`}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={add}
          disabled={!custom.trim()}
          className="bg-blue-500 text-white px-4 rounded flex items-center justify-center disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
