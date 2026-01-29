import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { MdOutlineCheck } from "react-icons/md";

const Select = ({
  name,
  label,
  required = false,
  options = [],
  formik,
  onChange,
  disabled,
  value,
  buttonClass = "px-3 py-3.5",
}) => {
  const [selected, setSelected] = useState(value || options[0].value);
  const selectedItem = options.find((option) => option.value === selected);
  return (
    <div className="relative">
      {label && (
        <label
          className="block text-sm capitalize font-medium dark:text-white truncate mb-2"
          htmlFor={name}
        >
          {label} {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelected(value);
          if (formik) {
            formik.setFieldTouched(name, true);
            formik.setFieldValue(name, value);
          }
          if (onChange) onChange(value);
        }}
      >
        <ListboxButton
          disabled={disabled}
          className={`relative cursor-pointer text-left block border border-gray-300 dark:border-gray-600 rounded-lg w-full dark:placeholder-gray-600 outline-none placeholder:text-gray-500 success:border-primary-600 ${buttonClass} text-sm dark:text-gray-300 ${
            disabled
              ? "!cursor-not-allowed bg-gray-100 dark:bg-gray-800 !border-gray-200 dark:!border-gray-900"
              : ""
          } ${!disabled && formik?.errors[name] ? "!border-red-600" : ""}`}
        >
          {selectedItem?.label}
          <LuChevronDown
            fontSize={18}
            className="group pointer-events-none absolute top-1/2 right-1 -translate-1/2 text-gray-500"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          transition
          anchor="bottom"
          className="absolute w-[var(--button-width)] [--anchor-gap:4px] text-gray-900 z-50 md:rounded-lg rounded-t-3xl bg-white dark:bg-blue-950 focus:outline-none border border-gray-300 dark:border-gray-600"
        >
          <div className="p-2.5 md:max-h-72 max-h-[60vh] overflow-auto">
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                value={option.value}
                className="text-gray-900 dark:text-gray-300 py-2.5 relative cursor-pointer select-none pl-0 !pr-2 text-sm rounded-lg transition-all duration-500 flex items-center justify-between hover:pl-3 hover:bg-gray-100 hover:text-blue-950 group"
              >
                {option.label}
                <MdOutlineCheck
                  fontSize={16}
                  className={`group-hover:block ${
                    option.value === selected ? "block" : "hidden"
                  }`}
                />
              </ListboxOption>
            ))}
          </div>
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default Select;
