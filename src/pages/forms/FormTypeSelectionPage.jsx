import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWpforms } from "react-icons/fa";

const FormTypeSelectionPage = () => {
  const navigate = useNavigate();

  const formTypes = [
    {
      id: "single-form",
      title: "Single Form",
      description: "Build fields to collect customer details and queries.",
    },
    {
      id: "multiple-form",
      title: "Multiple Forms",
      description: "Build fields to collect customer details and queries.",
    },
  ];

  const handleSelectForm = (type) => {
    navigate(`/admin/form-builder/${type}`);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Select Form Type
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {formTypes.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectForm(item.id)}
            className="cursor-pointer bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#161925] rounded-xl text-white text-2xl">
                <FaWpforms />
              </div>

              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              </div>
            </div>

            <button className="mt-5 px-4 py-2 bg-[#161925] text-white rounded-lg text-sm hover:bg-gray-900 transition">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormTypeSelectionPage;
