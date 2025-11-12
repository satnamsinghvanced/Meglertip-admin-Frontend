import React, { useState } from "react";
import DynamicInput from "./DynamicInput";

const DynamicForm = ({ form, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-2">{form.formName}</h2>
      <p className="text-gray-600 mb-4">{form.description}</p>

      {form.steps?.map((step, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{step.stepTitle}</h3>
          {step.fields.map((field) => (
            <DynamicInput
              key={field._id}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
