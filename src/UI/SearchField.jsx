import React from "react";
import { useState } from "react";
import { MdKeyboardCommandKey } from "react-icons/md";

const sizeStyles = {
  xs: "px-3 py-[0.875rem] text-sm",
  sm: "px-4 md:py-4 py-3.5 text-sm",
  md: "px-4 py-4 text-base",
  lg: "px-5 py-5 text-lg",
};

const SearchField = ({
  placeholder,
  size = "md",
  className,
  type,
  title,
  disabled,
  image,
  searchBtns,
  styles,
  iconLeft,
  searchAction,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = () => {
    searchAction(searchQuery);
  };

  const enterHandler = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      searchHandler();
    }
    if (event.target.value.length === 0) {
      event.preventDefault();
      searchHandler();
    }
  };

  return (
    <>
      <div className={`relative ${className ? className : ""}`}>
        {image && (
          <div
            onClick={searchHandler}
            className={`absolute inset-y-0 ${
              iconLeft ? "right-0" : "left-0"
            } flex items-center px-3 cursor-pointer dark:text-gray-600`}
          >
            {image}
          </div>
        )}
        <input
          type={type}
          className={`block border border-gray-300 rounded-lg w-full dark:border-gray-600 dark:placeholder-gray-600 outline-none placeholder:text-gray-500 success:border-primary-600 disabled:cursor-not-allowed dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-200 dark:disabled:border-gray-900
           ${sizeStyles[size] && sizeStyles[size]} ${styles ? styles : ""}`}
          name="search"
          title={title}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={placeholder ? placeholder : ""}
          disabled={disabled ? disabled : false}
          onKeyUp={enterHandler}
          autoComplete="off"
        />
        {searchBtns && (
          <div className="absolute inset-y-0 right-0 gap-2 cursor-pointer flex items-center px-3 md:py-4 py-3.5 my-2 mr-2 first-letter:pointer-events rounded-8 bg-white">
            <MdKeyboardCommandKey />F
          </div>
        )}
      </div>
    </>
  );
};
export default SearchField;
