import React from "react";
import Button from "./Button";
import SearchField from "./SearchField";
import { MdSearch } from "react-icons/md";
// import DateRangePicker from "./DateRangePicker";
import { Link, useLocation } from "react-router";

const PageHeader = ({
  mainClass,
  title,
  btnClass,
  description,
  buttonsList,
  searchBar,
  searchPlaceholder,
  dateClass,
  dateRangePicker,
  className,
  value,
  onChange,
  searchAction,
  titleClass,
  children,
  breadCrumbs,
  childClass,
  timing,
}) => {
  const location = useLocation();

  return (
    <div
      className={`no-print flex flex-col lg:flex-row w-full justify-between lg:items-start pt-4 ${
        !location.pathname.includes("dashboard")
          ? "pb-2 sm:pb-5 md:pb-8"
          : "md:pb-2"
      } gap-5 ${mainClass}`}
    >
      <div>
        <h6 className="text-lg">{timing}</h6>
        <h1
          className={`text-gray-900 dark:text-white text-xl sm:text-2xl font-bold capitalize ${titleClass} `}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
        {breadCrumbs && breadCrumbs.length > 0 && (
          <ul className="flex items-center font-medium text-sm AtThemeBreadCrumbs">
            {breadCrumbs.map((breadCrumb, index) => (
              <li key={index}>
                <span
                  className={`${
                    breadCrumb.isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600"
                  } block`}
                >
                  {breadCrumb.link && (
                    <Link href={breadCrumb.link}>{breadCrumb.label}</Link>
                  )}
                  {!breadCrumb.link && <span>{breadCrumb.label}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(children || searchBar || dateRangePicker || buttonsList) && (
        <div
          className={`flex flex-col md:flex-row md:items-center gap-4 ${childClass}`}
        >
          {children}
          {searchBar && (
            <SearchField
              size="xs"
              type="text"
              image={<MdSearch />}
              placeholder={searchPlaceholder}
              className="md:max-w-480 md:min-w-315"
              styles="border border-gray-300 pl-3 bg-transparent"
              iconLeft={true}
              onChange={onChange}
              searchAction={searchAction}
            />
          )}
          {/* {dateRangePicker && <DateRangePicker className={dateClass} />} */}
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
