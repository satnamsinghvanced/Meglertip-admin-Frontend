import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios"; // axios instance
import StepsBuilderForm from "./StepsBuilderForm";

const FormManagePage = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
const [selectedForm, setSelectedForm] = useState(null);
  // Fetch all forms
  const fetchForms = async () => {
    try {
      const { data } = await api.get("/form-select");
      setForms(data.data || []);
    } catch (err) {
      toast.error("Failed to load forms");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    if (!formTitle.trim()) return toast.error("Form Title is required!");

    try {
      setLoading(true);

      await api.post("/form-select", {
        formId: formTitle.toLowerCase().replace(/\s+/g, "-"),
        formTitle,
        formDescription,
      });

      toast.success("Form created successfully!");

      setFormTitle("");
      setFormDescription("");

      fetchForms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating form");
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    try {
      await api.delete(`/form-select/${id}`);
      toast.success("Form deleted");
      fetchForms();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };
if (selectedForm) {
  return (
    <StepsBuilderForm
      form={selectedForm}
      onBack={() => setSelectedForm(null)}
    />
  );
}
  return (
    <div className="min-h-screen  ">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Forms</h1>

      {/* Create Form */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Form</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="border border-slate-200 p-3 rounded-lg w-full"
          />

          <textarea
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="border border-slate-200 p-3 rounded-lg w-full"
            rows="2"
          />

          <button
            onClick={handleCreateForm}
            disabled={loading}
            className="px-4 py-2 bg-[#161925] text-white rounded-lg hover:bg-black transition"
          >
            {loading ? "Saving..." : "Create Form"}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Forms</h2>

      {forms.length === 0 ? (
        <p>No forms created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">
                  {form.formTitle}
                </h3>

                <span className="text-sm bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                  #{form.formNumber}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {form.formDescription || "No description provided."}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition"
                  onClick={() => toast.info("Edit functionality coming soon")}
                >
                  Edit Form
                </button>

                <button
                  className="w-full px-4 py-2 bg-[#23395B] text-white rounded-lg text-sm hover:bg-[#18283f] transition"
                 onClick={() => setSelectedForm(form)}
                >
                  Add Steps
                </button>

                {/* <button
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                  onClick={() => deleteForm(form._id)}
                >
                  Delete
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormManagePage;
