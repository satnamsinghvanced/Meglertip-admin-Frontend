import React from "react";
import PageHeader from "../../components/PageHeader";
import { FiAlertCircle } from "react-icons/fi";

const Faq = () => {
  const questions = [
    {
      title: "What is an HR management platform?",
      descriptions:
        "An HR management platform is a software solution designed to streamline and automate various HR-related tasks such as payroll processing, employee record keeping, benefits administration, and performance management.",
    },
    {
      title: "What are the benefits of using an HR management platform?",
      descriptions:
        "Using an HR management platform can help save time, reduce errors, and improve efficiency in HR operations. It can also improve communication between employees and HR, enhance compliance with regulations, and provide insights into HR metrics.",
    },
    {
      title:
        "How do I choose the right HR management platform for my organization?",
      descriptions:
        "When choosing an HR management platform, consider your organization`s specific needs, budget, and goals. Evaluate different platforms based on features, ease of use, customer support, security, and integration with other systems.",
    },
    {
      title: "How do I implement an HR management platform?",
      descriptions:
        "Implementing an HR management platform typically involves setting up the software, configuring settings, migrating data, and training employees. The process may vary depending on the platform you choose and your organization's specific requirements.",
    },
  ];

  return (
    <div className="w-full">
      <PageHeader
        title="Help Center"
        description={false}
        breadCrumbs={[
          { isActive: false, label: "Help Center", link: "/helpcenter" },
          { isActive: true, label: "FAQ", link: "/helpcenter/faq" },
        ]}
      />
      <div className="w-full">
        <div className="bg-white dark:bg-blue-950 rounded-lg p-6">
          <h5 className="flex items-center gap-2 mb-5">
            Frequently Asked Questions <FiAlertCircle fontSize={18} />
          </h5>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                className="py-6 px-5 border border-gray-200 dark:border-gray-700 rounded-lg"
                key={index}
              >
                <h6 className="dark:text-white mb-3">{question.title}</h6>
                <p className="font-medium text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {question.descriptions}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
