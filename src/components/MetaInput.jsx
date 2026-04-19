import { useState } from "react";
import { FaPlus } from "react-icons/fa";

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
    if (data.some((item) => item.name === v)) {
      setCustom("");
      return;
    }

    const newItem = hasRole ? { name: v, role: "actor" } : { name: v };

    onChange([...(data || []), newItem]);
    setCustom("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-2">
        {data?.map((item, i) => (
          <div
            key={i}
            className="
              flex gap-2
              p-2
              rounded-lg
              border border-gray-200
              bg-white
              transition-all duration-200
              hover:border-gray-300
            "
          >
            {/* name */}
            <input
              className="
                flex-1
                px-3 py-2
                text-sm
                rounded-md
                border border-gray-200
                outline-none
                transition-all duration-200

                focus:border-blue-500
                focus:ring-2 focus:ring-blue-100
              "
              value={item.name || ""}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Name..."
            />

            {/* role */}
            {hasRole && (
              <input
                className="
                  w-32
                  px-3 py-2
                  text-sm
                  rounded-md
                  border border-gray-200
                  outline-none
                  transition-all duration-200

                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-100
                "
                value={item.role || ""}
                onChange={(e) => update(i, "role", e.target.value)}
                placeholder="Role"
              />
            )}
          </div>
        ))}
      </div>

      {/* ADD */}
      <div className="flex gap-2">
        <input
          className="
            flex-1
            px-3 py-2
            text-sm
            border border-gray-300
            rounded-lg
            outline-none
            transition-all duration-200

            focus:border-blue-500
            focus:ring-2 focus:ring-blue-100

            placeholder:text-gray-400
          "
          placeholder={`Add ${label}...`}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          onClick={add}
          disabled={!custom.trim()}
          className="
            flex items-center justify-center
            px-3
            rounded-lg
            bg-blue-500 text-white
            transition-all duration-200

            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FaPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
}
