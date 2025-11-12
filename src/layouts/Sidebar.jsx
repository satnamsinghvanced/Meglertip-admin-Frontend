/* eslint-disable react/prop-types */

import { Link, useLocation, useNavigate } from "react-router";
import logo from "../../public/images/boligtip.png";
import { HiChevronDoubleLeft } from "react-icons/hi";

import {
  Home,
  Info,
  FileSpreadsheet,
  BookOpenText,
  HelpCircle,
  UsersRound,
  FileCheck2,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { ROUTES } from "../consts/routes";

const SideBar = ({ toggleSidebar, isMiniSidebarOpen, onCloseSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminRoutes = [
    {
      name: "Homepage",
      icon: Home,
      href: ROUTES.HOMEPAGE,
    },
    {
      name: "About Page",
      icon: Info,
      href: ROUTES.ABOUT,
    },
    {
      name: "Forms",
      icon: FileSpreadsheet,
      href: ROUTES.FORMS,
    },
    {
      name: "Articles",
      icon: BookOpenText,
      href: ROUTES.ARTICLE,
    },
    {
      name: "FAQ",
      icon: HelpCircle,
      href: ROUTES.FAQ,
    },
    {
      name: "Partner",
      icon: UsersRound,
      href: ROUTES.PARTNER,
    },
    {
      name: "Term of Service",
      icon: FileCheck2,
      href: ROUTES.TERM_OF_SERVICE,
    },
    {
      name: "Privacy Policy",
      icon: ShieldCheck,
      href: ROUTES.PRIVACY_POLICY,
    },
  ];

  const bottomRoutes = [
    {
      name: "Settings",
      icon: Settings,
      href: ROUTES.SETTINGS,
    },
  ];

  const navigationRoutes = adminRoutes;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`${
          isMiniSidebarOpen
            ? "bg-black/40 w-full h-full fixed inset-0 z-30"
            : ""
        } md:hidden`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 sideBar lg:z-20 pt-6 z-40 bg-white dark:bg-blue-950 dark:text-white left-0 sm:top-0 border-r border-solid border-gray-200 dark:border-gray-800 transition-all duration-300 h-screen ${
          isMiniSidebarOpen ? "md:w-[280px] w-[90%] md:px-5 px-2" : "w-22 px-2"
        }`}
      >
        {/* Logo & Toggle */}
        <div
          className={`${
            isMiniSidebarOpen ? "justify-between" : "justify-center mb-14"
          } hidden md:flex items-center mb-8 w-full`}
        >
          {isMiniSidebarOpen && (
            <Link to="/">
              <figure className="justify-center pr-5 flex cursor-pointer">
                <img
                  src={logo}
                  width={150}
                  height={32}
                  alt="logo"
                  className="object-contain ml-2"
                />
              </figure>
            </Link>
          )}
          <div className="" onClick={toggleSidebar}>
            <span className="cursor-pointer">
              <HiChevronDoubleLeft
                className={`${
                  isMiniSidebarOpen ? "" : "rotate-180"
                } transition-all text-xl`}
              />
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <div
          className={`${
            isMiniSidebarOpen && "overflow-y-auto overflow-x-hidden"
          } flex sideBar flex-col justify-between h-[calc(100vh_-_165px)]`}
        >
          <ul
            className={`flex flex-col justify-between space-y-2 ${
              !isMiniSidebarOpen ? "mx-2" : ""
            }`}
          >
            {navigationRoutes.map((item, index) => (
              <li key={index}>
                <div
                  onClick={() => {
                    navigate(item.href);
                    onCloseSidebar();
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`${
                      location.pathname === item.href
                        ? "bg-[#161925] text-white px-4"
                        : "hover:bg-gray-100 hover:px-4 dark:hover:text-gray-900"
                    } rounded-lg sm:text-base text-sm font-bold py-3.5 flex items-center dark:text-white ${
                      isMiniSidebarOpen ? "" : "px-4 justify-center"
                    } transition-all group`}
                  >
                    <span
                      className={`${
                        location.pathname === item.href
                          ? "text-white"
                          : "dark:text-white dark:group-hover:text-gray-900"
                      } sm:w-7 w-6 flex items-center justify-center`}
                    >
                      <item.icon fontSize={20} />
                    </span>
                    {isMiniSidebarOpen && (
                      <span className="ml-1">{item.name}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Bottom settings section */}
          <ul
            className={`flex flex-col justify-between gap-2 ${
              !isMiniSidebarOpen ? "mx-2" : ""
            }`}
          >
            {bottomRoutes.map((item, index) => (
              <li key={index}>
                <div
                  onClick={() => {
                    navigate(item.href);
                    onCloseSidebar();
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`${
                      location.pathname === item.href
                        ? "bg-[#161925] text-white px-4"
                        : "hover:bg-gray-100 hover:px-4 dark:hover:text-gray-900"
                    } rounded-lg sm:text-base text-sm font-bold py-3.5 flex items-center dark:text-white ${
                      isMiniSidebarOpen ? "" : "px-4 justify-center"
                    } transition-all group`}
                  >
                    <span
                      className={`${
                        location.pathname === item.href
                          ? "text-white"
                          : "dark:text-white dark:group-hover:text-gray-900"
                      } sm:w-7 w-6 flex items-center justify-center`}
                    >
                      <item.icon fontSize={20} />
                    </span>
                    {isMiniSidebarOpen && (
                      <span className="ml-1">{item.name}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
