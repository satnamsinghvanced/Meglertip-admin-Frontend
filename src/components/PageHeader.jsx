/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Link, useLocation } from "react-router";
import Button from "../UI/Button";

const PageHeader = ({
  mainClass,
  title,
  btnClass,
  description,
  buttonsList,
  className,
  titleClass,
  children,
  breadCrumbs,
  childClass,
}) => {
  const location = useLocation();

  return (
    <div
      className={`no-print flex flex-col lg:flex-row w-full justify-between lg:items-center gap-5 mb-8 ${mainClass}`}
    >
      <div>
        <h3 className={`dark:text-white capitalize ${titleClass}`}>{title}</h3>
        {description && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
        {breadCrumbs && breadCrumbs.length > 0 && (
          <ul className="flex items-center font-medium text-sm mt-2">
            {breadCrumbs.map((breadCrumb, index) => (
              <li
                key={index}
                className="relative px-3 first:!pl-0 not-first:after:content-['>'] after:absolute after:top-1/2 after:-left-[1px] after:text-lg after:-translate-1/2"
              >
                <span
                  className={`${
                    breadCrumb.isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  } block`}
                >
                  {breadCrumb.link && (
                    <Link to={breadCrumb.link}>{breadCrumb.label}</Link>
                  )}
                  {!breadCrumb.link && <span>{breadCrumb.label}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(children || buttonsList) && (
        <div
          className={`flex flex-col md:flex-row md:items-center gap-4 ${childClass}`}
        >
          {children}
          {buttonsList && (
            <div
              className={`flex flex-col sm:flex-row justify-between items-center w-full gap-2 xs:gap-4 ${btnClass}`}
            >
              {buttonsList?.map((item) => {
                return item?.href ? (
                  <Link to={item.href} className="w-full md:w-auto">
                    <Button
                      isLoading={item.isLoading}
                      key={item.value}
                      className={`rounded-10 text-base w-full ${
                        item.border ? item.border : ""
                      } ${className} ${item.className}`}
                      size="sm"
                      value={item.value}
                      variant={item.variant}
                      labelclass={`flex gap-1 xs:gap-2 font-bold sm:text-sm md:text-base justify-center items-center whitespace-nowrap ${
                        className?.includes("rightIcon") && "flex-row-reverse"
                      }`}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    isLoading={item.isLoading}
                    key={item.value}
                    className={`rounded-10 text-base w-full ${
                      item.border ? item.border : ""
                    } ${className} ${item.className}`}
                    size="sm"
                    value={item.value}
                    variant={item.variant}
                    labelclass={`flex gap-1 xs:gap-2 font-bold sm:text-sm md:text-base justify-center items-center whitespace-nowrap ${
                      className?.includes("rightIcon") && "flex-row-reverse"
                    }`}
                    onClick={item.onClick}
                  >
                    {item.icon}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
