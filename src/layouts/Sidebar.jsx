import {
  Transition,
  Menu,
  MenuItems,
  MenuItem,
  MenuButton,
} from "@headlessui/react";
import logo from "../svgs/vanced.svg";
import logoLight from "../svgs/vanced-light.svg";
import { Link, useLocation, useNavigate } from "react-router";
import ThemeSwitch from "../UI/ThemeSwitch";
import { IoChevronUp } from "react-icons/io5";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { HiOutlineHome } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { RiInbox2Line } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { BsCurrencyDollar } from "react-icons/bs";
import { LuGrid2X2Check } from "react-icons/lu";
import { GrCircleQuestion } from "react-icons/gr";
import { TbSettings } from "react-icons/tb";
import { TbUsersPlus } from "react-icons/tb";
import { RiUserStarLine } from "react-icons/ri";
import { LuCalendarClock } from "react-icons/lu";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { GrContactInfo } from "react-icons/gr";
import { LuCalendarCheck } from "react-icons/lu";
import { ROUTES } from "../consts/routes";

const SideBar = ({ toggleSidebar, isMiniSidebarOpen, onCloseSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  let adminRoutes = [
    {
      name: "Homepage",
      icon: HiOutlineHome,
      href: ROUTES.HOME,
    },
{
      name: "Banner Section",
      icon: LuGrid2X2Check,
      href: ROUTES.PROJECTS,
    },
    {
      name: "Hero Section",
      icon: LuCalendarClock,
      href: ROUTES.LEAVES,
    },
    {
      name: "Forms",
      icon: LuUsers,
      href: ROUTES.EMPLOYEES,
    },
    {
      name: "Blogs",
      icon: TbUsersPlus,
      href: ROUTES.CLIENTS,
    },
    
    // {
    //   name: "Team Leaders (TL)",
    //   icon: RiUserStarLine,
    //   href: ROUTES.TEAM_LEADERS,
    // },
    // {
    //   name: "Performance",
    //   icon: BsFileEarmarkBarGraph,
    //   href: ROUTES.PERFORMANCE,
    // },
    // {
    //   name: "Employee Status",
    //   icon: GrContactInfo,
    //   href: ROUTES.EMPLOYEE_STATUS,
    // },
    // {
    //   name: "Holidays",
    //   icon: LuCalendarCheck,
    //   href: ROUTES.HOLIDAYS,
    // },
  ];

  const bottomRoutes = [
    // {
    //   name: "Help Center",
    //   icon: GrCircleQuestion,
    //   href: ROUTES.HELPCENTER,
    // },
    {
      name: "Settings",
      icon: TbSettings,
      href: ROUTES.SETTINGS,
    },
  ];


  let navigationRoutes = adminRoutes;

  return (
    <>
      <div
        className={`${
          isMiniSidebarOpen
            ? "bg-black/40 w-full h-full fixed inset-0 z-30"
            : ""
        } md:hidden`}
      />
      <div
        className={`fixed top-0 sideBar lg:z-20 pt-6 z-40 bg-white dark:bg-blue-950 dark:text-white left-0 sm:top-0 border-r border-solid border-gray-200 dark:border-gray-800 transition-all duration-300 h-screen ${
          isMiniSidebarOpen ? "md:w-[280px] w-[90%] md:px-5 px-2" : "w-22 px-2"
        }`}
      >
        <div
          className={`${
            isMiniSidebarOpen ? "justify-between" : "justify-center mb-14"
          } hidden md:flex items-center mb-8 w-full`}
          inert={false}
        >
          {isMiniSidebarOpen && (
            <Link to="/">
              <figure className="justify-center pr-5 flex cursor-pointer">
                {/* <img
                  src={logo}
                  width={150}
                  height={32}
                  alt="logo"
                  className="object-contain lightModelogo"
                /> */}
                {/* <img
                  src={logoLight}
                  width={150}
                  height={32}
                  alt="logo"
                  className="object-contain darkModelogo"
                /> */}
                <p className="font-bold text-2xl text-gray-900 dark:bg-gray-100 px-4">Meglertip</p>
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
            {navigationRoutes.map((item, index) => {
              return (
                <li key={index}>
                  {item.list ? (
                    <Menu as="div">
                      {({ open }) => (
                        <div className="relative">
                          <MenuButton
                            className={`${
                              open || location.pathname.includes(item.path)
                                ? "bg-gray-200 text-gray-900 dark:bg-gray-100 px-4"
                                : "hover:bg-gray-100 hover:px-4 dark:text-white dark:hover:text-gray-900"
                            } ${
                              !isMiniSidebarOpen && "px-4"
                            } group transition-all flex w-full justify-between items-center rounded-lg sm:text-base text-sm font-bold py-3.5 cursor-pointer`}
                          >
                            <div className="flex items-center sm:text-base text-sm font-bold">
                              <span
                                className={`${
                                  open || location.pathname.includes(item.path)
                                    ? "text-gray-900"
                                    : "text-gray-900 dark:text-white dark:group-hover:text-gray-900"
                                } sm:w-7 w-6 flex items-center justify-center`}
                              >
                                <item.icon fontSize={18} />
                              </span>
                              {isMiniSidebarOpen && (
                                <span className="ml-2 truncate max-w-[103px] whitespace-nowrap">
                                  {item.name}
                                </span>
                              )}
                            </div>

                            {!location.pathname.includes(item.path) && (
                              <span
                                className={`${
                                  isMiniSidebarOpen ? "mr-2" : "hidden"
                                }`}
                              >
                                <IoChevronUp
                                  width="22"
                                  height="22"
                                  className={`${open ? "" : "rotate-180"} ${
                                    isMiniSidebarOpen ? "" : "w-4"
                                  }`}
                                />
                              </span>
                            )}
                          </MenuButton>
                          <Transition
                            enter="transition duration-100 ease-out ~z-50"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            show={
                              isMiniSidebarOpen
                                ? open || location.pathname.includes(item.path)
                                  ? true
                                  : false
                                : open
                            }
                            className={`${
                              item.list.length > 3 ? "md:bottom-0" : "top-0"
                            } ${
                              isMiniSidebarOpen
                                ? "pt-4.5"
                                : "absolute py-2.5 ml-6 left-full min-w-[200px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl"
                            }`}
                          >
                            <MenuItems
                              as="ul"
                              modal={false}
                              className={`${
                                isMiniSidebarOpen ? "relative" : ""
                              } text-sm font-bold`}
                            >
                              {item.list.map((navigation) => (
                                <MenuItem as="li" key={navigation.name}>
                                  <div
                                    className={`${
                                      isMiniSidebarOpen ? "pl-6" : "px-2"
                                    } relative`}
                                  >
                                    {isMiniSidebarOpen && (
                                      <div className="absolute bottom-full translate-y-8 left-0 h-full w-4 mb-1.5">
                                        <div
                                          className={`h-full w-full border-l-2 border-b-2 dark:border-gray-600 ml-2.5`}
                                        ></div>
                                      </div>
                                    )}
                                    <div
                                      onClick={(event) => {
                                        event.preventDefault();
                                        navigate(navigation.href);
                                        onCloseSidebar();
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <div
                                        className={`${
                                          location.pathname === navigation.href
                                            ? "bg-primary text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-900"
                                        } ${
                                          isMiniSidebarOpen
                                            ? "text-sm ml-0.5"
                                            : "text-sm"
                                        } font-bold py-3 px-2 flex items-center transition-all dark:text-white rounded-lg`}
                                      >
                                        {/* {isMiniSidebarOpen && ( */}
                                        <span className="ml-2 whitespace-nowrap truncate max-w-[170px]">
                                          {navigation.name}
                                        </span>
                                        {/* )} */}
                                      </div>
                                    </div>
                                  </div>
                                </MenuItem>
                              ))}
                            </MenuItems>
                          </Transition>
                        </div>
                      )}
                    </Menu>
                  ) : (
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
                            ? "bg-primary text-white px-4"
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
                  )}
                </li>
              );
            })}
          </ul>
          <ul
            className={`flex flex-col justify-between gap-2 ${
              !isMiniSidebarOpen ? "mx-2" : ""
            }`}
          >
            {bottomRoutes.map((item, index) => {
              return (
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
                          ? "bg-primary text-white px-4"
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
              );
            })}
          </ul>
        </div>
        {/* <ThemeSwitch isMiniSidebarOpen={isMiniSidebarOpen} /> */}
      </div>
    </>
  );
};

export default SideBar;
