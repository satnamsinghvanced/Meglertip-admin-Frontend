import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import api from "../../../api/axios";

const StepsBuilderPage = () => {
  const router = useRouter();
  const { id } = router.query; // formId from URL

  const [form, setForm] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepTitle, setStepTitle] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [fields, setFields] = useState([
    { label: "", type: "text", name: "", placeholder: "", required: false, options: [] },
  ]);
  const [editingStepIndex, setEditingStepIndex] = useState(null);

  // Fetch form and steps
  const fetchForm = async () => {
    try {
      const { data } = await api.get(`/forms/${id}`);
      setForm(data);
      setSteps(data.steps || []);
    } catch (err) {
      toast.error("Failed to fetch form");
    }
  };

  useEffect(() => {
    if (id) fetchForm();
  }, [id]);

  // Field handlers
  const addField = () => setFields([...fields, { label: "", type: "text", name: "", placeholder: "", required: false, options: [] }]);
  const removeField = (index) => setFields(fields.filter((_, i) => i !== index));
  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    if (!["select", "checkbox", "radio"].includes(value)) updated[index].options = [];
    setFields(updated);
  };
  const toggleRequired = (index) => {
    const updated = [...fields];
    updated[index].required = !updated[index].required;
    setFields(updated);
  };

  // Option handlers
  const addOption = (index) => {
    const updated = [...fields];
    updated[index].options.push({ value: "" });
    setFields(updated);
  };
  const updateOption = (fieldIndex, optionIndex, value) => {
    const updated = [...fields];
    updated[fieldIndex].options[optionIndex].value = value;
    setFields(updated);
  };
  const removeOption = (fieldIndex, optionIndex) => {
    const updated = [...fields];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setFields(updated);
  };

  // Edit step
  const handleEditStep = (index) => {
    const step = steps[index];
    setStepTitle(step.stepTitle);
    setStepDescription(step.stepDescription);
    setFields(step.fields.map(f => ({ ...f })));
    setEditingStepIndex(index);
  };

  // Delete step
  const handleDeleteStep = async (index) => {
    try {
      const stepId = steps[index]._id;
      await api.delete(`/forms/form-steps/${id}/${stepId}`);
      toast.success("Step deleted");
      fetchForm();
    } catch (err) {
      toast.error("Failed to delete step");
    }
  };

  // Add or update step
  const handleSaveStep = async () => {
    if (!stepTitle) return toast.error("Step Title is required!");

    try {
      const payload = { stepTitle, stepDescription, fields };

      if (editingStepIndex !== null) {
        const stepId = steps[editingStepIndex]._id;
        await api.put(`/forms/form-steps/${id}/${stepId}`, payload);
        toast.success("Step updated!");
      } else {
        await api.post(`/forms/form-steps/${id}`, payload);
        toast.success("Step added!");
      }

      setStepTitle("");
      setStepDescription("");
      setFields([{ label: "", type: "text", name: "", placeholder: "", required: false, options: [] }]);
      setEditingStepIndex(null);
      fetchForm();
    } catch (err) {
      toast.error("Failed to save step");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-5">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-100 rounded-lg border border-slate-200 hover:bg-gray-200"
      >
        ← Back to Forms
      </button>

      <h1 className="text-2xl font-bold mb-2">Add Steps to: {form.formName}</h1>
      <p className="text-gray-600 mb-6">{form.description}</p>

      {/* Existing Steps */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Existing Steps</h2>
        {steps.length === 0 ? <p className="text-gray-500">No steps added yet.</p> :
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={s._id} className="p-4 border border-slate-200 rounded-xl bg-gray-50 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Step {i + 1}: {s.stepTitle}</h3>
                    <p className="text-gray-600">{s.stepDescription}</p>
                    <p className="text-sm text-gray-500">Fields: {s.fields.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditStep(i)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDeleteStep(i)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>

                {/* Fields */}
                <div className="mt-3 space-y-2">
                  {s.fields.map((f, fi) => (
                    <div key={fi} className="p-3 border border-gray-200 rounded-lg bg-white">
                      <p><strong>Label:</strong> {f.label}</p>
                      <p><strong>Name:</strong> {f.name}</p>
                      <p><strong>Type:</strong> {f.type}</p>
                      {f.placeholder && <p><strong>Placeholder:</strong> {f.placeholder}</p>}
                      <p><strong>Required:</strong> {f.required ? "Yes" : "No"}</p>
                      {f.options?.length > 0 && (
                        <ul className="list-disc list-inside">
                          {f.options.map((opt, oi) => <li key={oi}>{opt.value || opt}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* Add/Edit Step Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold">{editingStepIndex !== null ? "Edit Step" : "Create New Step"}</h2>

        <input type="text" placeholder="Step Title" value={stepTitle} onChange={(e) => setStepTitle(e.target.value)}
          className="border border-slate-200 p-3 rounded-lg w-full" />
        <textarea placeholder="Step Description" value={stepDescription} onChange={(e) => setStepDescription(e.target.value)}
          rows={3} className="border border-slate-200 p-3 rounded-lg w-full" />

        <h3 className="text-lg font-semibold">Fields</h3>
        {fields.map((field, index) => (
          <div key={index} className="border border-slate-200 p-4 rounded-xl bg-gray-50 space-y-3 relative">
            <button onClick={() => removeField(index)} className="absolute -right-2 -top-3 text-white bg-gray-500 px-2 py-1 text-xs rounded">X</button>

            <input type="text" placeholder="Field Label" value={field.label} onChange={(e) => updateField(index, "label", e.target.value)}
              className="border border-slate-200 p-2 rounded-lg w-full" />
            <input type="text" placeholder="Name" value={field.name} onChange={(e) => updateField(index, "name", e.target.value)}
              className="border border-slate-200 p-2 rounded-lg w-full" />
            <select value={field.type} onChange={(e) => updateField(index, "type", e.target.value)} className="border border-slate-200 p-2 rounded-lg w-full">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="file">File</option>
            </select>
            {!["checkbox", "radio"].includes(field.type) && <input type="text" placeholder="Placeholder (optional)" value={field.placeholder} onChange={(e) => updateField(index, "placeholder", e.target.value)} className="border border-slate-200 p-2 rounded-lg w-full" />}

            {["select", "checkbox", "radio"].includes(field.type) && (
              <div>
                <h4 className="font-medium text-base mb-2">Options</h4>
                {field.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-2 mb-2">
                    <input type="text" value={opt.value} onChange={(e) => updateOption(index, optIndex, e.target.value)} placeholder="Option value" className="border border-slate-200 p-2 rounded-lg w-full" />
                    <button onClick={() => removeOption(index, optIndex)} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">X</button>
                  </div>
                ))}
                <button onClick={() => addOption(index)} className="px-3 py-1 bg-[#23395B] text-white rounded-md text-sm">+ Add Option</button>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" className="!relative" checked={field.required} onChange={() => toggleRequired(index)} /> Required
            </label>
          </div>
        ))}

        <button onClick={addField} className="px-4 py-2 bg-[#23395B] text-white rounded-lg w-full mt-2">+ Add New Field</button>
        <button onClick={handleSaveStep} className="px-4 py-2 bg-primary text-white rounded-lg w-full">{editingStepIndex !== null ? "Update Step" : "Save Step"}</button>
      </div>
    </div>
  );
};

export default StepsBuilderPage;
