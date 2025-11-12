import React from "react";

const DynamicInput = ({ field, value, onChange }) => {
  const handleChange = (e) => {
    onChange(field.name, e.target.value);
  };

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "url":
    case "address":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <input
            type={field.type === "address" ? "text" : field.type}
            name={field.name}
            required={field.required}
            value={value || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder={field.placeholder || ""}
          />
        </div>
      );

    case "radio":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <div className="flex gap-4">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "dropdown":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <select
            name={field.name}
            value={value || ""}
            onChange={handleChange}
            required={field.required}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return null;
  }
};

export default DynamicInput;
