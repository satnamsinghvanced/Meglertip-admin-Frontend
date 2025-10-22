import { IoAlertCircleOutline } from "react-icons/io5";

const InputError = ({ children }) => {
  return (
    <div className="flex items-center mt-2 text-sm">
      <span className="text-red-600">
        <IoAlertCircleOutline fontSize={18} />
      </span>
      <p className="ms-1.5 text-red-600 text-xs">{children}</p>
    </div>
  );
};

export default InputError;
