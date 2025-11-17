import { useEffect, useState, useMemo } from "react";
import Header from "./Header";
import SideBar from "./Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  const getInitialMini = () => {
    const stored = localStorage.getItem("isMiniSidebarOpen");
    return stored === null ? true : stored === "true";
  };

  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(getInitialMini);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    setIsMiniSidebarOpen((prev) => !prev);
  };

  const onCloseSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsMiniSidebarOpen(true);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("isMiniSidebarOpen", isMiniSidebarOpen);
  }, [isMiniSidebarOpen]);

  const layoutPaddingClass = useMemo(() => {
    if (viewportWidth < 768) return "pl-0";
    return isMiniSidebarOpen ? "lg:pl-[280px]" : "lg:pl-[88px]";
  }, [isMiniSidebarOpen, viewportWidth]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${layoutPaddingClass} transition-all`}>
      {isSidebarOpen && (
        <SideBar
          isMiniSidebarOpen={isMiniSidebarOpen}
          toggleSidebar={toggleSidebar}
          onCloseSidebar={onCloseSidebar}
        />
      )}
      <Header
        onClick={() => {
          setIsSidebarOpen((prev) => !prev);
        }}
      />
      <main
        id="main"
        className="relative z-10 h-[calc(100vh-4.5rem)] overflow-y-auto bg-transparent px-4 py-6 md:px-8"
      >
        <div className="mx-auto max-w-[1600px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
