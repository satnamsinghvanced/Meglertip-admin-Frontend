/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const StepsBuilderForm = ({ form, onBack }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null); // null = list view, object = edit/add view

  // Fetch existing steps
  const fetchSteps = async () => {
    try {
      const { data } = await api.get(`/forms/form-steps/${form._id}`);
      setSteps(data?.data?.steps || []);
    } catch (error) {
      console.log("No steps found yet");
      setSteps([]);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  // Open step form for Add or Edit
  const openStepForm = (step = null) => {
    if (step) setCurrentStep({ ...step }); // edit existing
    else
      setCurrentStep({
        stepTitle: "",
        stepDescription: "",
        fields: [
          {
            label: "",
            name: "",
            type: "text",
            placeholder: "",
            required: false,
            options: [],
          },
        ],
      }); // add new
  };

  // Handle input changes
  const updateField = (index, key, value) => {
    const updatedFields = [...currentStep.fields];
    updatedFields[index][key] = value;
    if (
      !["select", "checkbox", "radio", "dropdown"].includes(
        updatedFields[index].type
      )
    )
      updatedFields[index].options = [];
    setCurrentStep({ ...currentStep, fields: updatedFields });
  };

  const addField = () =>
    setCurrentStep({
      ...currentStep,
      fields: [
        ...currentStep.fields,
        {
          label: "",
          name: "",
          type: "text",
          placeholder: "",
          required: false,
          options: [],
        },
      ],
    });
  const removeField = (index) =>
    setCurrentStep({
      ...currentStep,
      fields: currentStep.fields.filter((_, i) => i !== index),
    });
  const toggleRequired = (index) => {
    const updatedFields = [...currentStep.fields];
    updatedFields[index].required = !updatedFields[index].required;
    setCurrentStep({ ...currentStep, fields: updatedFields });
  };
  const addOption = (fi) => {
    const updated = [...currentStep.fields];
    updated[fi].options.push("");
    setCurrentStep({ ...currentStep, fields: updated });
  };
  const updateOption = (fi, oi, value) => {
    const updated = [...currentStep.fields];
    updated[fi].options[oi] = value;
    setCurrentStep({ ...currentStep, fields: updated });
  };
  const removeOption = (fi, oi) => {
    const updated = [...currentStep.fields];
    updated[fi].options.splice(oi, 1);
    setCurrentStep({ ...currentStep, fields: updated });
  };

  // Save step
  const handleSaveStep = async () => {
    if (!currentStep.stepTitle) return toast.error("Step Title is required!");
    try {
      for (let f of currentStep.fields)
        if (!f.label || !f.name)
          throw new Error("All fields must have label and name");

      const payload = {
        stepTitle: currentStep.stepTitle,
        stepDescription: currentStep.stepDescription,
        fields: currentStep.fields.map((f) => ({
          label: f.label,
          name: f.name,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder || "",
          options: f.options.map((opt) =>
            typeof opt === "string" ? opt : opt.value
          ),
        })),
      };

      if (currentStep._id) {
        await api.put(
          `/forms/form-steps/${form._id}/${currentStep._id}`,
          payload
        );
        toast.success("Step updated!");
      } else {
        await api.post(`/forms/form-steps/${form._id}`, payload);
        toast.success("Step added!");
      }

      setCurrentStep(null);
      fetchSteps();
    } catch (err) {
      toast.error(`Failed to save step. ${err.message}`);
    }
  };

  // Delete step
  const handleDeleteStep = async (index) => {
    try {
      const stepId = steps[index]._id;
      await api.delete(`/forms/form-steps/${form._id}/${stepId}`);
      toast.success("Step deleted");
      fetchSteps();
    } catch (err) {
      toast.error("Failed to delete step");
    }
  };

  // -------------------
  // LIST VIEW
  // -------------------
  if (!currentStep) {
    return (
      <div className="min-h-screen  bg-gray-50">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
        >
          ← Back to Forms
        </button>

        <h1 className="text-3xl font-bold mb-2">{form.formTitle}</h1>
        <p className="text-gray-600 mb-6">{form.formDescription}</p>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Steps</h2>
          <button
            onClick={() => openStepForm()}
            className="px-4 py-2 bg-primary  text-white rounded hover:bg-primary"
          >
            + Add Step
          </button>
        </div>

        {steps.length === 0 ? (
          <p className="text-gray-500">No steps added yet.</p>
        ) : (
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div
                key={s._id}
                className="bg-white p-4 rounded-xl shadow space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">
                      {i + 1}. {s.stepTitle}
                    </h3>
                    <p className="text-gray-600">{s.stepDescription}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Total Fields: {s.fields.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openStepForm(s)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStep(i)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-2">
                  {s.fields.map((f, fi) => (
                    <div
                      key={fi}
                      className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <p>
                        <strong>Label:</strong> {f.label}
                      </p>
                      <p>
                        <strong>Name:</strong> {f.name}
                      </p>
                      <p>
                        <strong>Type:</strong> {f.type}
                      </p>
                      {f.placeholder && (
                        <p>
                          <strong>Placeholder:</strong> {f.placeholder}
                        </p>
                      )}
                      <p>
                        <strong>Required:</strong> {f.required ? "Yes" : "No"}
                      </p>
                      {f.options?.length > 0 && (
                        <div>
                          <strong>Options:</strong>
                          <ul className="list-disc list-inside">
                            {f.options.map((opt, oi) => (
                              <li key={oi}>
                                {typeof opt === "string" ? opt : opt.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------
  // STEP FORM VIEW
  // -------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => setCurrentStep(null)}
        className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        ← Back to Steps
      </button>

      <h2 className="text-2xl font-semibold mb-4">
        {currentStep._id ? "Edit Step" : "Add New Step"}
      </h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-8xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Step Title"
          value={currentStep.stepTitle}
          onChange={(e) =>
            setCurrentStep({ ...currentStep, stepTitle: e.target.value })
          }
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          rows={3}
          placeholder="Step Description"
          value={currentStep.stepDescription}
          onChange={(e) =>
            setCurrentStep({ ...currentStep, stepDescription: e.target.value })
          }
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="text-lg font-semibold">Fields</h3>
        {currentStep.fields.map((field, index) => (
          <div
            key={index}
            className="border border-slate-200 p-4 rounded-xl bg-gray-50 relative space-y-2"
          >
            <button
              onClick={() => removeField(index)}
              className="absolute -top-3 -right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-sm hover:bg-gray-600"
            >
              X
            </button>
            <input
              type="text"
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => updateField(index, "label", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            />
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, "type", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textArea">Textarea</option>
              <option value="select">Select</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="file">File</option>
            </select>
            {!["checkbox", "radio"].includes(field.type) && (
              <input
                type="text"
                placeholder="Placeholder (optional)"
                value={field.placeholder}
                onChange={(e) =>
                  updateField(index, "placeholder", e.target.value)
                }
                className="w-full p-2 border border-slate-200 rounded"
              />
            )}
            {["select", "checkbox", "radio", "dropdown"].includes(
              field.type
            ) && (
              <div>
                <p className="font-medium mb-1">Options:</p>
                {field.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(index, oi, e.target.value)}
                      placeholder="Option value"
                      className="flex-1 p-2 border  border-slate-200 rounded"
                    />
                    <button
                      onClick={() => removeOption(index, oi)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(index)}
                  className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-800"
                >
                  + Add Option
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm mt-1">
              <input
                type="checkbox"
                className="!relative"
                checked={field.required}
                onChange={() => toggleRequired(index)}
              />{" "}
              Required
            </label>
          </div>
        ))}

        <button
          onClick={addField}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
        >
          + Add New Field
        </button>
        <button
          onClick={handleSaveStep}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 mt-2"
        >
          {currentStep._id ? "Update Step" : "Save Step"}
        </button>
      </div>
    </div>
  );
};

export default StepsBuilderForm;
