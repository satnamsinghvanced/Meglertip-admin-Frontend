import React from "react";
import { Outlet } from "react-router";
import loginBanner from "/images/auth-banner.webp";
import logo from "/images/logo.png";
import ThemeSwitch from "../UI/ThemeSwitch";

const AuthLayout = () => {
  return (
    <main id="main" className="bg-gray-50 dark:bg-blue-950 dark:text-white">
      {/* <div className="fixed end-7 top-3 z-[5] flex gap-4">
        <ThemeSwitch isMiniSidebarOpen={true} />
      </div> */}
      <div className="grid grid-cols-[1fr_1.5fr] h-screen overflow-hidden">
        <figure className="h-full">
          <div className="bg-[#161925] w-full h-full flex items-center justify-center">
            <img src={logo} alt="Vanced Solutions" className="w-80 h-18" />
          </div>
        </figure>
        <div className="flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
