const Checkbox = ({
  title,
  className,
  checked,
  inputClass,
  disabled,
  onChange,
  id,
  ref,
}) => {
  return (
    <div className={`${className} ${title && "flex gap-2 items-center"}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        id={id}
        className={`${inputClass} cursor-pointer relative dark:bg-transparent ${
          checked ? "!border-primary" : ""
        }`}
        disabled={disabled}
        onChange={onChange}
      />
      <label
        className="dark:text-white font-medium cursor-pointer"
        htmlFor={id}
      >
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
