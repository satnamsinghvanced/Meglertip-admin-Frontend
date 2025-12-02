import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const MultiSelect = ({ options, value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectAll = () => onChange(options);
  const clearAll = () => onChange([]);

  return (
    <div className="relative" ref={ref}>
      {/* Display selected tags */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
      >
        <div className="flex flex-wrap gap-2">
          {value.length === 0 ? (
            <span className="text-slate-400">Select options</span>
          ) : (
            value.map((v, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs"
              >
                {v}
                <RxCross2
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleValue(v);
                  }}
                />
              </span>
            ))
          )}
        </div>
        <IoChevronDown className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl p-3 z-50 max-h-64 overflow-y-auto">
          {/* Select All / Clear All */}
          <div className="flex justify-between mb-2">
            <button
            type="button"
              onClick={selectAll}
              className="text-xs text-blue-600 hover:underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Checkbox items */}
          {options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <input
                type="checkbox"
                
                className="!relative"
                checked={value.includes(opt)}
                onChange={() => toggleValue(opt)}
              />
              <span className="text-sm text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
