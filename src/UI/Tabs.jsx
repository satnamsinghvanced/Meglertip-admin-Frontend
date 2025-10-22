import React from "react";
import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel } from "@headlessui/react";
import { FiAlertCircle } from "react-icons/fi";

const Tabs = ({
  list = [
    {
      icon: FiAlertCircle,
      title: "Tab Title here",
      content: "Tab Content Here",
    },
  ],
  tabClass,
  className,
  selectedClass = "text-primary",
  unSelectedClass,
  pannelClass,
}) => {
  return (
    <div>
      <TabGroup className="AtSettingTabs flex items-start lg:gap-5 flex-col lg:flex-row">
        <TabList
          className={`${
            tabClass
              ? tabClass
              : "AtTabSidebar !rounded-b-none lg:!rounded-lg bg-white dark:bg-blue-950 flex flex-row lg:flex-col overflow-x-auto !p-0 lg:!p-[1.25rem]"
          } ${className ? className : ""} !flex-shrink-0 w-full max-w-80 sticky top-0 left-0`}
        >
          {list.map((item, k) => {
            return (
              <Tab as={Fragment} key={k}>
                {({ selected }) => (
                  <button
                    className={`${
                      selected
                        ? `whitespace-nowrap bg-primary focus-visible:outline-none border-b-2 border-darkBlue lg:border-0 dark:border-white dark:lg:border-0 text-white transition-all px-4 ${selectedClass}`
                        : unSelectedClass
                        ? unSelectedClass
                        : "hover:bg-gray-100 hover:px-4 dark:hover:text-gray-900 whitespace-nowrap bg-white text-gray-900 dark:bg-blue-950 dark:text-white transition-all"
                    } flex items-center py-4.5 gap-2 font-bold text-sm cursor-pointer mb-2 last:mb-0 rounded-lg`}
                  >
                    <span
                      className={
                        selected
                          ? "hidden lg:block"
                          : "hidden lg:block"
                      }
                    >
                      <item.icon fontSize={20} />
                    </span>
                    <span className="w-full lg:w-auto">{item.title}</span>
                  </button>
                )}
              </Tab>
            );
          })}
        </TabList>
        {list.map((item, k) => {
          return (
            <TabPanel
              key={k}
              className={`AtThemeTabPanel w-full ${pannelClass}`}
            >
              <>{item.content}</>
            </TabPanel>
          );
        })}
      </TabGroup>
    </div>
  );
};

export default Tabs;
