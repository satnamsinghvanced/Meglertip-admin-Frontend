/* eslint-disable no-undef */
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
import ImageUploader from "../../UI/ImageUpload";

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

const RealEstateAgentsFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAgent } = useSelector((state) => state.agents);

  const [form, setForm] = useState({
    title: "",
    description: "",
    descriptionBottom: "",

    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaImage: "",

    canonicalUrl: "",
    jsonLd: "",

    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",

    publishedDate: "",
    lastUpdatedDate: "",
    showPublishedDate: false,
    showLastUpdatedDate: false,

    robots: {
      noindex: false,
      nofollow: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      notranslate: false,
    },

    customHead: "",
    slug: "",

    redirect: {
      enabled: false,
      from: "",
      to: "",
      type: 301,
    },

    breadcrumbs: [],

    includeInSitemap: true,
    priority: 0.7,
    changefreq: "weekly",

    isScheduled: false,
    scheduledPublishDate: "",

    isDeleted: false,
    isHidden: false,
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

      metaTitle: selectedAgent.metaTitle || "",
      metaDescription: selectedAgent.metaDescription || "",
      metaKeywords: selectedAgent.metaKeywords || "",
      metaImage: selectedAgent.metaImage || "",

      canonicalUrl: selectedAgent.canonicalUrl || "",
      jsonLd: selectedAgent.jsonLd || "",

      ogTitle: selectedAgent.ogTitle || "",
      ogDescription: selectedAgent.ogDescription || "",
      ogImage: selectedAgent.ogImage || "",
      ogType: selectedAgent.ogType || "website",

      publishedDate: selectedAgent.publishedDate || "",
      lastUpdatedDate: selectedAgent.lastUpdatedDate || "",
      showPublishedDate: selectedAgent.showPublishedDate || false,
      showLastUpdatedDate: selectedAgent.showLastUpdatedDate || false,

      robots: selectedAgent.robots,
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
    if (!selectedAgent) {
      return (
        <div className="space-y-6">
          <PageHeader
            title="Real Estate Agents Page"
            buttonsList={headerButtons}
          />
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 h-100vh">
            No Real Estate Agents Page Found.
          </div>
        </div>
      );
    }

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
        title={
          isEditMode ? "Edit Real Estate Agent Page" : "Add Real Estate Agent"
        }
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-4 ">
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
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            {/* SEO SECTION */}
            <div className="pt-6">
              <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

              {/* Meta Title */}
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta Title
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm({ ...form, metaTitle: e.target.value })
                }
              />

              {/* Meta Description */}
              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta Description
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:border-primary"
                value={form.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
              />

              {/* Keywords */}
              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta Keywords (comma separated)
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                value={form.metaKeywords}
                onChange={(e) =>
                  setForm({ ...form, metaKeywords: e.target.value })
                }
              />

              {/* Meta Image */}
              <ImageUploader
                label="Meta Image"
                value={form.metaImage}
                onChange={(img) => setForm({ ...form, metaImage: img })}
              />
            </div>

            {/* OG TAGS */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Open Graph (OG) Tags</h2>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OG Title
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
              />

              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                OG Description
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:border-primary"
                value={form.ogDescription}
                onChange={(e) =>
                  setForm({ ...form, ogDescription: e.target.value })
                }
              />

              <ImageUploader
                label="OG Image"
                value={form.ogImage}
                onChange={(img) => setForm({ ...form, ogImage: img })}
              />

              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                OG Type
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                value={form.ogType}
                onChange={(e) => setForm({ ...form, ogType: e.target.value })}
              />
            </div>

            {/* ADVANCED SEO */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Advanced SEO</h2>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Canonical URL
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                value={form.canonicalUrl}
                onChange={(e) =>
                  setForm({ ...form, canonicalUrl: e.target.value })
                }
              />

              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                JSON-LD Schema
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-28 focus:border-primary"
                value={form.jsonLd}
                onChange={(e) => setForm({ ...form, jsonLd: e.target.value })}
              />

              <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Custom Head Tags
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:border-primary"
                value={form.customHead}
                onChange={(e) =>
                  setForm({ ...form, customHead: e.target.value })
                }
              />
            </div>

            {/* ROBOTS SETTINGS */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Robots Settings</h2>

              {Object.keys(form.robots).map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    className="!relative"
                    type="checkbox"
                    checked={form.robots[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        robots: { ...form.robots, [key]: e.target.checked },
                      })
                    }
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
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

export default RealEstateAgentsFormPage;
