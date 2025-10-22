import { useState, useEffect } from "react";
import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";

export default function ThemeSwitch({ isMiniSidebarOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = (value) => {
    if (value) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    setIsDarkMode(value);
    localStorage.setItem("darkMode", value);
  };

  useEffect(() => {
    let defaultMode;

    if (localStorage.getItem("darkMode") === null) {
      defaultMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else if (localStorage.getItem("darkMode") === "false") {
      defaultMode = false;
    } else if (localStorage.getItem("darkMode") === "true") {
      defaultMode = true;
    }

    setIsDarkMode(defaultMode);
    toggleDarkMode(defaultMode);
  }, []);

  return (
    <>
      {isMiniSidebarOpen ? (
        <div className="grid grid-cols-2 items-center p-2 rounded-3xl min-w-52 bg-gray-100 dark:bg-gray-950">
          <input
            disabled={isDarkMode === false}
            type="radio"
            name="toggle"
            id="light"
            onClick={() => toggleDarkMode(false)}
            className="hidden"
          />
          <label
            className={`cursor-pointer flex items-center justify-center py-2 rounded-2xl text-xs font-bold ${
              !isDarkMode
                ? "text-primary bg-white"
                : "text-gray-600 dark:text-white"
            }`}
            htmlFor="light"
          >
            <span className={`hidden md:flex items-center gap-1`}>
              <MdSunny width="20" height="20" />
              Light
            </span>
            <span className="flex md:hidden gap-2 w-full">
              <MdSunny width="20" height="20" />
              Light
            </span>
          </label>
          <input
            disabled={isDarkMode === true}
            type="radio"
            name="toggle"
            id="dark"
            onClick={() => toggleDarkMode(true)}
            className="hidden"
          />
          <label
            className={`cursor-pointer flex items-center justify-center py-2 rounded-2xl text-xs font-bold ${
              isDarkMode === true
                ? "text-primary bg-white"
                : "text-gray-600 dark:text-white"
            }`}
            htmlFor="dark"
          >
            <span className={`hidden md:flex items-center gap-1`}>
              <IoMoon width="20" height="20" />
              Dark
            </span>
            <span className="flex md:hidden gap-2 w-full">
              <IoMoon width="20" height="20" />
              Dark
            </span>
          </label>
        </div>
      ) : (
        <label
          onClick={() => toggleDarkMode(!isDarkMode)}
          className="cursor-pointer mr-1 flex items-center justify-center"
        >
          <span className="text-gray-500 dark:text-white bg-gray-100 dark:bg-gray-950 p-3 rounded-full">
            {isDarkMode ? (
              <MdSunny width="20" height="20" />
            ) : (
              <IoMoon width="20" height="20" />
            )}
          </span>
        </label>
      )}
    </>
  );
}
