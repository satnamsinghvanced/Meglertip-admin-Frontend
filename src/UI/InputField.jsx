import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import InputError from "./InputError";

const sizeStyles = {
  sm: "px-3 py-3.5 text-sm",
  md: "px-4 py-4 text-base",
  lg: "px-5 py-5 text-lg",
};

const InputField = ({
  formik,
  passwordShown,
  placeholder,
  hideErrors,
  size = "md",
  className,
  value,
  type,
  title,
  disabled,
  label,
  image,
  onChange,
  onEnter,
  onFocus,
  name,
  addOn,
  required,
  step,
  inputClass,
  icon,
  ref,
  min,
  max,
  maxLength,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(passwordShown);

  return (
    <>
      {label && (
        <label className="block mb-2 text-sm capitalize font-medium dark:text-white truncate">
          {label} {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <div className={`relative ${className ? className : ""}`}>
        <div className="flex w-full items-end gap-3">
          <input
            ref={ref}
            type={
              type
                ? type === "password"
                  ? showPassword
                    ? "text"
                    : type
                  : type
                : "text"
            }
            className={`${inputClass} block border border-gray-300 rounded-lg w-full dark:border-gray-600 dark:placeholder-gray-600 outline-none placeholder:text-gray-500 success:border-primary-600 disabled:cursor-not-allowed dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-200 dark:disabled:border-gray-900
            ${!disabled && formik?.errors[name] && formik?.touched[name] ? "!border-red-600" : ""} 
            ${sizeStyles[size] && sizeStyles[size]}`}
            title={title}
            name={name}
            id={name}
            value={value || ""}
            step={step}
            onKeyUp={(event) => {
              if (event.keyCode === 13 && onEnter) {
                onEnter();
              }
            }}
            onChange={(e) => {
              if (type === "number" && step) {
                let allowedSteps = step.split(".")[1]?.length;
                let decimals = e.target.value.split(".");
                if (decimals.length > 1 && decimals[1].length > allowedSteps) {
                  e.target.value = parseFloat(e.target.value).toFixed(
                    allowedSteps
                  );
                }
                if (step === "0" || step === "1") {
                  e.target.value = parseInt(e.target.value).toFixed(0);
                }
              }
              onChange ? onChange(e) : formik?.handleChange(e);
            }}
            placeholder={placeholder ? placeholder : ""}
            disabled={disabled}
            onBlur={formik?.handleBlur}
            onInput={formik?.handleBlur}
            min={min}
            max={max}
            maxLength={maxLength}
            onFocus={onFocus}
            {...rest}
          />
          {addOn && (
            <span className="border border-gray-400 dark:border-gray-700 h-[53px] text-sm flex-shrink-0 flex items-center rounded-lg bg-gray-200 dark:bg-white dark:bg-opacity-5 text-gray-600 px-4 font-semibold">
              {addOn}
            </span>
          )}
        </div>
        {formik?.touched[name] && formik.errors[name] ? (
          <InputError>{formik?.errors[name]}</InputError>
        ) : null}
        {icon && icon}
        {type === "password" ? (
          !showPassword ? (
            <span className="dark:!text-gray-500">
              <IoEyeOffOutline
                onClick={() => setShowPassword(true)}
                className="cursor-pointer absolute top-4.5 right-3 h-5 w-5"
              />
            </span>
          ) : (
            <span className="dark:!text-gray-500">
              <IoEyeOutline
                onClick={() => setShowPassword(false)}
                className="cursor-pointer absolute top-4.5 right-3 h-5 w-5"
              />
            </span>
          )
        ) : (
          ""
        )}
        {type === "cv" && (
          <FileDownload
            width={13}
            height={16}
            className="cursor-pointer absolute top-5 right-3 h-5 w-5"
          />
        )}
        {type === "upload" && (
          <span className="!bg-blue">
            <MdOutlineFileDownload
              width={13}
              height={16}
              className="cursor-pointer absolute top-5 right-3 h-5 w-5"
            />
          </span>
        )}
      </div>
    </>
  );
};

export default InputField;
