import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  updateSitemap,
  createSitemap,
  fetchSitemap,
} from "../../store/slices/sitemapSlice";
import { toast } from "react-toastify";

const requiredFields = ["title", "href"];

function labelFor(name) {
  const map = {
    title: "Title",
    href: "URL / Href",
    description: "Description",
  };
  return map[name] || name;
}

const SitemapFormPage = () => {
  const { type, index } = useParams(); // type = create/edit
  const isEditMode = type === "edit";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: sitemap } = useSelector((state) => state.sitemap || {});
  const pages = sitemap?.pages || [];

  const [form, setForm] = useState({
    title: "",
    href: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (isEditMode && pages[index]) {
      setForm({
        title: pages[index].title || "",
        href: pages[index].href || "",
        description: pages[index].description || "",
      });
    }
  }, [isEditMode, index, pages]);

  const validateField = (name, value) => {
    let message = "";
    if (requiredFields.includes(name)) {
      if (!value || !String(value).trim()) {
        message = `${labelFor(name)} is required`;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return !message;
  };

  const validateAll = () => {
    let newErrors = {};
    requiredFields.forEach((f) => {
      const v = form[f];
      if (!v || !String(v).trim()) {
        newErrors[f] = `${labelFor(f)} is required`;
      }
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
      toast.error("Please fill the required fields.");
      return;
    }

    setSubmitting(true);

    try {
      // Build working sitemap object
      const working = { ...(sitemap || { pages: [] }) };
      const updatedPages = [...working.pages];

      const payload = {
        title: form.title.trim(),
        href: form.href.trim(),
        description: form.description,
      };

      if (isEditMode) {
        updatedPages[index] = payload;
      } else {
        updatedPages.push(payload);
      }

      working.pages = updatedPages;

      if (sitemap?._id) {
        await dispatch(updateSitemap(working)).unwrap();
      } else {
        await dispatch(createSitemap(working)).unwrap();
      }

      toast.success(isEditMode ? "Page updated!" : "Page added!");
      dispatch(fetchSitemap());
      navigate("/sitemap");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isDisabled = submitting || hasErrors;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Sitemap Page" : "Add Sitemap Page"}
        description={
          isEditMode
            ? "Update the sitemap details for this page."
            : "Create a new page entry for your sitemap."
        }
        buttonsList={useMemo(
          () => [
            {
              value: "Back to Sitemap",
              variant: "white",
              className:
                "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
              onClick: () => navigate("/sitemap"),
            },
          ],
          [navigate]
        )}
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Title", name: "title" },
              { label: "Href / URL", name: "href" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                  {requiredFields.includes(field.name) && (
                    <span className="text-red-500">*</span>
                  )}
                </label>

                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition
                      ${
                        errors[field.name]
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-300 focus:border-primary"
                      }`}
                />

                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-primary"
              ></textarea>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Page"}
            </button>

            {hasErrors && (
              <p className="mt-2 text-xs text-red-600">
                Fix all required fields before saving.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SitemapFormPage;
