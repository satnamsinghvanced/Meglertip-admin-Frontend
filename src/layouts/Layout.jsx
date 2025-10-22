import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  let initialMini;

  if (localStorage.getItem("isMiniSidebarOpen") === "false") {
    initialMini = false;
  } else {
    initialMini = true;
  }

  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(initialMini);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsMiniSidebarOpen(!isMiniSidebarOpen);
  };
  const onCloseSidebar = () => {
    if (window.innerWidth < 767) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    window.removeEventListener("resize", () => {});
    window.addEventListener("resize", () => {
      if (window && window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsMiniSidebarOpen(true);
      } else setIsSidebarOpen(true);
    });

    if (window && window.innerWidth < 768) {
      setIsSidebarOpen(false);
      setIsMiniSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isMiniSidebarOpen", isMiniSidebarOpen);
  }, [isMiniSidebarOpen]);

  return (
    <>
      <div
        className={`${
          !isMiniSidebarOpen
            ? "lg:pl-[88px] md:pl-22"
            : "lg:pl-[280px] md:pl-22"
        } transition-all`}
      >
        {isSidebarOpen && (
          <SideBar
            isMiniSidebarOpen={isMiniSidebarOpen}
            toggleSidebar={toggleSidebar}
            onCloseSidebar={onCloseSidebar}
          />
        )}
        <Header
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
        <main
          id="main"
          className={`${"h-[calc(100vh-4.5rem)]"} main !z-10 flex-grow-1 md:px-7 px-4 py-4 md:py-8 bg-gray-100 dark:bg-gray-950 dark:text-white md:h-[calc(100vh-70px)] overflow-y-auto transition-all duration-300 overflow-hidden`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
