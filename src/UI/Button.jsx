import { ImSpinner9 } from "react-icons/im";

const Button = ({
  className,
  labelclass = "font-bold",
  value,
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "md",
  isLoading,
  ...rest
}) => {
  return (
    <button 
      {...rest}
      className={`btn group ${
        isLoading
          ? "btn-primary border-0 pointer-events-none select-none cursor-pointer"
          : `btn-${variant}`
      } btn-${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <p className={`${labelclass}`}>
        {isLoading ? (
          <span className="w-full flex justify-center text-white">
            <ImSpinner9 className="animate-spin text-2xl" />{" "}
            <span className="ms-4">Loading</span>
          </span>
        ) : (
          <>
            {children} {value}
          </>
        )}
      </p>
    </button>
  );
};

export default Button;
