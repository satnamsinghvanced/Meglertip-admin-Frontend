import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  getAgentById,
  createAgent,
  updateAgent,
  clearSelectedAgent,
} from "../../store/slices/realEstateAgents";
import { toast } from "react-toastify";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "link",
  "image",
];

const requiredFields = ["title", "description", "descriptionBottom"];

const SEOSettings = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAgent, loading } = useSelector((state) => state.agents);

  const [form, setForm] = useState({
    title: "",
    description: "",
    descriptionBottom: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) dispatch(getAgentById(id));
    return () => dispatch(clearSelectedAgent());
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (!selectedAgent) return;

    setForm({
      title: selectedAgent.title || "",
      description: selectedAgent.description || "",
      descriptionBottom: selectedAgent.descriptionBottom || "",
    });
  }, [selectedAgent]);

  const validateField = (name, value) => {
    let msg = "";
    if (requiredFields.includes(name) && !value.trim()) {
      msg = `${name} is required`;
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateAll = () => {
    const newErrors = {};
    requiredFields.forEach((f) => {
      if (!form[f].trim()) newErrors[f] = `${f} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fix errors before saving");
      return;
    }

    setSubmitting(true);
    const payload = { ...form };

    try {
      if (isEditMode) {
        await dispatch(updateAgent({ id, agentData: payload })).unwrap();
        // toast.success("Agent updated");
      } else {
        await dispatch(createAgent(payload)).unwrap();
        // toast.success("Agent created");
      }

      navigate("/real-estate-agents");
    } catch (err) {
      toast.error(err?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isDisabled = hasErrors || submitting;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Real Estate Agent Page" : "Add Real Estate Agent"}
        description={
          isEditMode
            ? "Update content for this Agent."
            : "Create a new Real Estate Agent entry."
        }
        buttonsList={useMemo(
          () => [
            {
              value: "Back",
              variant: "white",
              className:
                "border border-slate-300 text-slate-700 hover:border-slate-400",
              onClick: () => navigate("/real-estate-agents"),
            },
          ],
          [navigate]
        )}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        {/* LEFT CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm ${
                  errors.title
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-primary"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.description}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description: value }))
                }
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="space-y-6">
          {/* DESCRIPTION BOTTOM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description Bottom <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.descriptionBottom}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, descriptionBottom: value }))
                }
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
            {errors.descriptionBottom && (
              <p className="mt-1 text-xs text-red-600">
                {errors.descriptionBottom}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Agent"}
            </button>

            {isDisabled && (
              <p className="mt-2 text-xs text-red-600">
                Fix errors before submitting
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SEOSettings;
