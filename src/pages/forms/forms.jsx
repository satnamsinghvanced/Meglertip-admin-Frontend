import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForms, updateForm } from "../../store/slices/formSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";

const AdminFormBuilder = () => {
  const dispatch = useDispatch();
  const { forms, loading } = useSelector((state) => state.form);

  const [editableForms, setEditableForms] = useState({});

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  useEffect(() => {
    if (forms.length) {
      const initialEditable = {};
      forms.forEach((form) => {
        initialEditable[form._id] = { ...form };
      });
      setEditableForms(initialEditable);
    }
  }, [forms]);

  const handleChange = (formId, field, value) => {
    setEditableForms((prev) => ({
      ...prev,
      [formId]: { ...prev[formId], [field]: value, isChanged: true },
    }));
  };

  const handleStepChange = (formId, stepIndex, field, value) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      steps[stepIndex] = { ...steps[stepIndex], [field]: value };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleFieldChange = (
    formId,
    stepIndex,
    fieldIndex,
    fieldName,
    value
  ) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      const fields = [...(steps[stepIndex]?.fields || [])];

      if (fieldName === "options") {
        fields[fieldIndex] = {
          ...fields[fieldIndex],
          [fieldName]: value.split(",").map((opt) => opt.trim()),
        };
      } else {
        fields[fieldIndex] = { ...fields[fieldIndex], [fieldName]: value };
      }

      steps[stepIndex] = { ...steps[stepIndex], fields };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleAddStep = (formId) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [
        ...(form.steps || []),
        { stepTitle: "", fields: [], visible: true },
      ];
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleAddField = (formId, stepIndex) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      const fields = [
        ...(steps[stepIndex]?.fields || []),
        {
          label: "",
          name: "",
          placeholder: "",
          type: "text",
          options: "",
          required: false,
          visible: true,
        },
      ];
      steps[stepIndex] = { ...steps[stepIndex], fields };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleDeleteStep = (formId, stepIndex) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      steps.splice(stepIndex, 1);
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleDeleteField = (formId, stepIndex, fieldIndex) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      const fields = [...(steps[stepIndex]?.fields || [])];
      fields.splice(fieldIndex, 1);
      steps[stepIndex] = { ...steps[stepIndex], fields };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const toggleStepVisibility = (formId, stepIndex) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      steps[stepIndex] = {
        ...steps[stepIndex],
        visible: !steps[stepIndex].visible,
      };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const toggleFieldVisibility = (formId, stepIndex, fieldIndex) => {
    setEditableForms((prev) => {
      const form = prev[formId] || {};
      const steps = [...(form.steps || [])];
      const fields = [...(steps[stepIndex]?.fields || [])];
      fields[fieldIndex] = {
        ...fields[fieldIndex],
        visible: !fields[fieldIndex].visible,
      };
      steps[stepIndex] = { ...steps[stepIndex], fields };
      return { ...prev, [formId]: { ...form, steps, isChanged: true } };
    });
  };

  const handleSave = (formId) => {
    const formData = editableForms[formId];
    if (!formData) return;
    const dataToSave = { ...formData };
    delete dataToSave.isChanged;
    dispatch(updateForm({ id: formId, formData: dataToSave }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 space-y-10">
        <h2 className="text-2xl font-bold dark:text-white mb-8">Form</h2>

        <div>
          {loading ? (
            <div className="space-y-5  animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg h-28 w-full"
                ></div>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <p className="text-gray-600">No forms found.</p>
          ) : (
            <div>
              {forms.map((form) => {
                const currentForm = editableForms[form._id] || form;

                return (
                  <div
                    key={form._id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-end mb-4">
                      <button
                        onClick={() => handleSave(form._id)}
                        disabled={!currentForm.isChanged}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                          currentForm.isChanged
                            ? "bg-[#161925] text-white hover:bg-gray-900"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        Save
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-600">Form Name</label>
                      <input
                        type="text"
                        value={currentForm.formName}
                        onChange={(e) =>
                          handleChange(form._id, "formName", e.target.value)
                        }
                        className="border border-gray-300 rounded-md w-full px-3 py-2"
                      />
                    </div>

                    <div className="mb-5">
                      <label className="text-sm text-gray-600">
                        Description
                      </label>
                      <textarea
                        value={currentForm.description}
                        onChange={(e) =>
                          handleChange(form._id, "description", e.target.value)
                        }
                        className="border border-gray-300 rounded-md w-full p-2"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-4">
                      {(currentForm.steps || []).map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className={`border border-gray-200 rounded-lg bg-gray-50 p-4 ${
                            !step.visible ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-700">
                              Step {stepIndex + 1}
                            </h3>
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  toggleStepVisibility(form._id, stepIndex)
                                }
                                className="text-gray-700 hover:text-gray-900"
                              >
                                {step.visible ? (
                                  <FaEye className="text-xl" />
                                ) : (
                                  <FaEyeSlash className="text-xl" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteStep(form._id, stepIndex)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <RiDeleteBin5Line className="text-xl" />
                              </button>
                              <button
                                onClick={() =>
                                  handleAddField(form._id, stepIndex)
                                }
                                className="flex items-center gap-1 text-sm bg-[#161925] text-white px-2 py-1 rounded hover:bg-[#161925]/85 transition"
                              >
                                <AiOutlinePlus size={14} /> Add Field
                              </button>
                            </div>
                          </div>

                          <label className="text-sm text-gray-600">
                            Step Name
                          </label>
                          <input
                            type="text"
                            value={step.stepTitle}
                            onChange={(e) =>
                              handleStepChange(
                                form._id,
                                stepIndex,
                                "stepTitle",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 w-full mb-3"
                          />

                          <div className="space-y-3">
                            {(step.fields || []).map((field, fieldIndex) => (
                              <div
                                key={fieldIndex}
                                className={`bg-white border border-gray-200 rounded-md p-3 ${
                                  !field.visible ? "opacity-50" : ""
                                }`}
                              >
                                <div className="flex max-xl:flex-wrap gap-3 items-center">
                                  <div>
                                    <label className="text-sm text-gray-600">
                                      Label
                                    </label>
                                    <input
                                      type="text"
                                      value={field.label}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          form._id,
                                          stepIndex,
                                          fieldIndex,
                                          "label",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm text-gray-600">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      value={field.name}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          form._id,
                                          stepIndex,
                                          fieldIndex,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600">
                                      Place Holder
                                    </label>
                                    <input
                                      type="text"
                                      value={field.placeholder}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          form._id,
                                          stepIndex,
                                          fieldIndex,
                                          "placeholder",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm text-gray-600">
                                      Type
                                    </label>
                                    <select
                                      value={field.type}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          form._id,
                                          stepIndex,
                                          fieldIndex,
                                          "type",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    >
                                      <option value="text">Text</option>
                                      <option value="email">Email</option>
                                      <option value="number">Number</option>
                                      <option value="date">Date</option>
                                      <option value="textArea">
                                        Text Area
                                      </option>
                                      <option value="dropdown">Dropdown</option>
                                      <option value="checkbox">Checkbox</option>
                                      <option value="radio">Radio</option>
                                    </select>
                                  </div>

                                  {(field.type === "dropdown" ||
                                    field.type === "checkbox" ||
                                    field.type === "radio") && (
                                    <div>
                                      <label className="text-sm text-gray-600">
                                        Options (comma separated)
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          field.options
                                            ? field.options.join(", ")
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleFieldChange(
                                            form._id,
                                            stepIndex,
                                            fieldIndex,
                                            "options",
                                            e.target.value
                                          )
                                        }
                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                        placeholder="Ex: Option 1, Option 2"
                                      />
                                    </div>
                                  )}

                                  <div className="flex flex-col justify-center items-start">
                                    <label className="text-sm text-gray-600 mb-1">
                                      Required
                                    </label>
                                    <div
                                      onClick={() =>
                                        handleFieldChange(
                                          form._id,
                                          stepIndex,
                                          fieldIndex,
                                          "required",
                                          !field.required
                                        )
                                      }
                                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                                        field.required
                                          ? "bg-[#161925]"
                                          : "bg-gray-300"
                                      }`}
                                    >
                                      <div
                                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                                          field.required ? "translate-x-[21px]" : ""
                                        }`}
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="flex grow justify-end items-start">
                                    <div className="flex flex-col items-center">
                                      {/* <label className="text-sm text-gray-600 mb-2">Visibility</label> */}
                                      <div className="flex gap-2 items-center ">
                                        <button
                                          onClick={() =>
                                            toggleFieldVisibility(
                                              form._id,
                                              stepIndex,
                                              fieldIndex
                                            )
                                          }
                                          className="text-gray-700 hover:text-gray-900  "
                                        >
                                          {field.visible ? (
                                            <FaEye className="text-xl" />
                                          ) : (
                                            <FaEyeSlash className="text-xl" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteField(
                                              form._id,
                                              stepIndex,
                                              fieldIndex
                                            )
                                          }
                                          className="text-red-600 hover:text-red-700 "
                                        >
                                          <RiDeleteBin5Line className="text-xl" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddStep(form._id)}
                        className="mt-3 flex items-center gap-2 text-sm bg-[#161925] text-white px-3 py-2 rounded hover:bg-[#161925]/85 transition"
                      >
                        <AiOutlinePlus size={14} /> Add Step
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminFormBuilder;
