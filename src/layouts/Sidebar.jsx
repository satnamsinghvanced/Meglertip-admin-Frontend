/* eslint-disable react/prop-types */

import { Link, useLocation, useNavigate } from "react-router";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { TbSitemap } from "react-icons/tb";
import { Fragment } from "react";
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
  Mail,
  Quote,
  UserPlus,
  Map,
  MapPin,
  Building,
} from "lucide-react";
import { MdOutlineFindInPage } from "react-icons/md";
import { MdRealEstateAgent } from "react-icons/md";
import { ROUTES } from "../consts/routes";

import { RiContactsBook2Fill } from "react-icons/ri";
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
      name: "Partner  Page",
      icon: UserPlus,
      href: ROUTES.PARTNER,
    },
        {
      name: "Quotes Section",
      icon: Quote,
      href: ROUTES.QUOTES,
    },
    {
      name: "Real Estate Agents Page",
      icon: MdRealEstateAgent,
      href: ROUTES.REAL_ESTATE_AGENTS,
    },
    {
      name: "Forms",
      icon: FileSpreadsheet,
      href: ROUTES.FORMS,
    },
      {
      name: "Collaborate Partners",
      icon: UsersRound,
      href: ROUTES.PARTNERS,
    },
    {
      name: "FAQ",
      icon: HelpCircle,
      href: ROUTES.FAQ,
    },

    {
      name: "Footer",
      icon: MdOutlineFindInPage,
      href: ROUTES.FOOTER,
    },
    {
      name: "Articles",
      icon: BookOpenText,
      href: ROUTES.ARTICLE,
    },
    {
      name: "Article Categories",
      icon: FileCheck2,
      href: ROUTES.ARTICLE_CATEGORY,
    },
    {
      name: "Counties",
      icon: Map,
      href: ROUTES.COUNTY,
    },
    {
      name: "Places",
      icon: MapPin,
      href: ROUTES.PLACES,
    },
    {
      name: "Companies",
      icon: Building,
      href: ROUTES.COMPANIES,
    },
    {
      name: "Email Templates",
      icon: Mail,
      href: ROUTES.EMAIL,
    },
  //  {
  //     name: "Sitemap Page",
  //     icon: TbSitemap ,
  //     href: ROUTES.SITEMAP,
  //   },
    // {
    //   name: "Collaborate Partners",
    //   icon: UsersRound,
    //   href: ROUTES.PARTNERS,
    // },
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
     {
      name: "Form Users",
      icon: RiContactsBook2Fill ,
      href: ROUTES.CONTACTUS,
    },
    {
      name: "Contact Us",
      icon: RiContactsBook2Fill ,
      href: ROUTES.CONTACTUS,
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
      <div
        className={`${
          isMiniSidebarOpen
            ? "bg-black/40 w-full h-full fixed inset-0 z-30"
            : ""
        } md:hidden`}
        onClick={onCloseSidebar}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-blue-900 dark:bg-blue-950/95 ${
          isMiniSidebarOpen ? "w-[280px]" : "w-[88px]"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          {isMiniSidebarOpen && (
            <Link to="/homepage" className="flex items-center gap-2">
              <img
                src="/images/boligtip.png"
                alt="logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <HiChevronDoubleLeft
              className={`text-xl transition ${
                isMiniSidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <div className="mt-2 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3">
            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                isMiniSidebarOpen ? "pl-2" : "text-center"
              }`}
            ></p>
            <ul className="space-y-1">
              {navigationRoutes.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        navigate(item.href);
                        onCloseSidebar();
                      }}
                      className={`relative flex w-full items-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                          : "text-slate-600 hover:bg-slate-100"
                      } ${isMiniSidebarOpen ? "" : "justify-center"}`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center ${
                          isActive ? "text-white" : "text-slate-500"
                        }`}
                      >
                        <item.icon size={18} />
                      </span>
                      {isMiniSidebarOpen && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-3 pb-4 pt-2">
            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                isMiniSidebarOpen ? "pl-2" : "text-center"
              }`}
            >
              Other
            </p>
            {bottomRoutes.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Fragment key={index}>
                  <button
                    onClick={() => {
                      navigate(item.href);
                      onCloseSidebar();
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                        : "text-slate-600 hover:bg-slate-100"
                    } ${isMiniSidebarOpen ? "" : "justify-center"}`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    >
                      <item.icon size={18} />
                    </span>
                    {isMiniSidebarOpen && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </button>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
