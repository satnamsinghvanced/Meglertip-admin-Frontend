import React from "react";
import PageHeader from "../../components/PageHeader";
import { GrCircleQuestion } from "react-icons/gr";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router";

const HelpCenter = () => {
  const HelpCenterData = [
    {
      _id: "1",
      icon: <GrCircleQuestion fontSize={20} />,
      title: "FAQ",
      desc: "Frequently Asked Questions",
      link: "/helpcenter/faq",
    },
    {
      _id: "2",
      icon: <HiOutlineOfficeBuilding fontSize={20} />,
      title: "Company Policy",
      desc: "Read our company policy",
      link: "/helpcenter/company-policy",
    },
    {
      _id: "3",
      icon: <FaRegUser fontSize={20} />,
      title: "Employee Policy",
      desc: "Read our employee policy",
      link: "/helpcenter/employee-policy",
    },
    {
      _id: "3",
      icon: <FiPhone fontSize={20} />,
      title: "Contact Support",
      desc: "Get support if you having trouble",
      link: "/helpcenter/contact-support",
    },
  ];

  return (
    <div className="w-full">
      <PageHeader
        title="Help Center"
        description="What can we help you with?"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {HelpCenterData.map((item, index) => (
          <Link
            to={item.link}
            className="bg-white dark:bg-blue-950 w-full rounded-lg min-h-[182px] flex items-start justify-center gap-3 flex-col px-6 py-4 cursor-pointer"
            key={index}
          >
            <span className="flex items-center justify-center w-[52px] h-[52px] border border-gray-300 rounded-full bg-white dark:bg-transparent dark:border-gray-600">
              {item.icon}
            </span>
            <h4 className="mt-1">{item.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
