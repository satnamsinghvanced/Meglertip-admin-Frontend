import { TabGroup, TabList, TabPanels, TabPanel, Tab } from "@headlessui/react";
import React, { Fragment } from "react";
import General from "./General";
import JobInformation from "./JobInformation";

const EmployeeTabs = ({
  details,
  tabButtonClass,
  tabButtonTextClass = "px-4",
}) => {
  const Tabs = [
    {
      name: "General",
    },
    {
      name: "Job Information",
    },
    {
      name: "Emergency Contact",
    },
    {
      name: "Bank Information",
    },
    {
      name: "Identity Information",
    },
    {
      name: "Education",
    },
    {
      name: "Experience",
    },
    {
      name: "Projects",
    },
  ];

  return (
    <TabGroup>
      <TabList className="bg-white dark:bg-gray-800 flex gap-2 border-b dark:border-gray-700 border-gray-200 overflow-x-scroll lg:overflow-auto">
        {Tabs?.map((item, index) => {
          return (
            <Tab as={Fragment} key={index}>
              {({ selected }) => (
                <button
                  className={` pb-2.5 text-sm whitespace-nowrap ${
                    selected
                      ? "text-darkBlue dark:text-white border-b-2 border-darkBlue dark:border-white font-bold focus-visible:outline-none"
                      : "bg-white dark:bg-gray-800 dark:text-white text-black font-semibold"
                  } ${tabButtonClass}`}
                >
                  <span className={tabButtonTextClass}>{item.name}</span>
                </button>
              )}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className="bg-white dark:bg-gray-800 w-full pt-5 text-left">
        <TabPanel>
          <General details={details} />
        </TabPanel>
        <TabPanel>
          <JobInformation details={details} />
        </TabPanel>
        <TabPanel>Emergency Contact</TabPanel>
        <TabPanel>Bank Information</TabPanel>
        <TabPanel>Identity Information</TabPanel>
        <TabPanel>Education</TabPanel>
        <TabPanel>Experience</TabPanel>
        <TabPanel>Projects</TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default EmployeeTabs;
