import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector ,shallowEqual} from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getCounties } from "../../store/slices/countySlice";
import {
  clearSelectedPlace,
  createPlace,
  getPlaceById,
  updatePlace,
} from "../../store/slices/placeSlice";
import { toast } from "react-toastify";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
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
  "code-block",
  "align",
  "link",
  "image",
];

const requiredFields = ["name", "slug", "countyId"];

function labelFor(name) {
  const map = {
    name: "Place Name",
    countyId: "County",
    slug: "Slug",
    excerpt: "Excerpt",
    title: "Title",
    rank: "Rank",
  };
  return map[name] || name;
}

const PlaceFormPage = () => {
  const { placeId } = useParams();
  const isEditMode = Boolean(placeId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedPlace } = useSelector((state) => state.places || {});
  const { counties, loading: citiesLoading } = useSelector(
  (state) => state.counties || {}
);
  console.log(counties, "DFsafsadfsadfasdf");

  const [form, setForm] = useState({
    name: "",
    countyId: "",
    slug: "",
    excerpt: "",
    title: "",
    description: "",
    isRecommended: false,
    rank: 0,
    companiesId: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && placeId) dispatch(getPlaceById(placeId));
    else dispatch(clearSelectedPlace());
    return () => dispatch(clearSelectedPlace());
  }, [dispatch, isEditMode, placeId]);
  useEffect(() => {
    dispatch(getCounties());
  }, [dispatch]);
  useEffect(() => {
    if (isEditMode && selectedPlace) {
      setForm({
        name: selectedPlace.name || "",
        countyId: selectedPlace.countyId || "",
        slug: selectedPlace.slug || "",
        excerpt: selectedPlace.excerpt || "",
        title: selectedPlace.title || "",
        description: selectedPlace.description || "",
        isRecommended: selectedPlace.isRecommended || false,
        rank: selectedPlace.rank || 0,
        companiesId: Array.isArray(selectedPlace.companiesId)
          ? selectedPlace.companiesId
          : [],
      });
    }
  }, [isEditMode, selectedPlace]);

  const validateField = (name, value) => {
    let message = "";
    if (requiredFields.includes(name)) {
      if (!value || !String(value).trim()) {
        message = `${labelFor(name)} is required`;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateAll = () => {
    const newErrors = {};
    requiredFields.forEach((f) => {
      const v = form[f];
      if (!v || !String(v).trim()) newErrors[f] = `${labelFor(f)} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (type !== "checkbox") {
      validateField(name, newValue);
    }
  };

  const buildPayload = () => ({
    name: form.name?.trim() || "",
    countyId: form.countyId || "",
    slug: form.slug?.trim() || "",
    excerpt: form.excerpt || "",
    title: form.title || "",
    description: form.description || "",
    isRecommended: form.isRecommended, 
    rank: Number(form.rank) || 0,
    companiesId: form.companiesId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fill required fields before saving.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (isEditMode) {
        await dispatch(
          updatePlace({ id: placeId, placeData: payload })
        ).unwrap();
        toast.success("Place updated!");
      } else {
        await dispatch(createPlace(payload)).unwrap();
        toast.success("Place created!");
      }

      navigate("/places");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.message || "Failed to save the place."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isDisabled = hasErrors || submitting;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Place Details" : "Add Place"}
        description={
          isEditMode
            ? "Update content for this Place."
            : "Add a new Place to the database."
        }
        buttonsList={useMemo(
          () => [
            {
              value: "Back to Places",
              variant: "white",
              className:
                "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
              onClick: () => navigate("/places"),
            },
          ],
          [navigate]
        )}
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Place Name", name: "name" },
              { label: "Slug", name: "slug" },
              { label: "Title", name: "title" },
              { label: "Rank", name: "rank", type: "number" },
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
                  type={field.type || "text"}
                  value={form[field.name] ?? ""}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    ${
                      errors[field.name]
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                County<span className="text-red-500">*</span>
              </label>
              <select
                name="countyId"
                value={form.countyId}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    ${
                      errors.countyId
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
              >
                <option value="">Select County</option>
                {counties?.data?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.countyId && (
                <p className="mt-1 text-xs text-red-600">{errors.countyId}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="isRecommended-toggle"
                className="flex items-center cursor-pointer pt-2"
              >
                <div className="relative">
                  {/* Hidden Input (The actual control) */}
                  <input
                    type="checkbox"
                    name="isRecommended"
                    checked={form.isRecommended}
                    onChange={handleChange}
                    id="isRecommended-toggle"
                    className="sr-only" // Screen reader only to hide the default checkbox
                  />

                  {/* Track (The colored background) */}
                  <div
                    className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
                      form.isRecommended ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  ></div>

                  {/* Switch/Puck (The circle button) */}
                  <div
                    className={`dot absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
                      form.isRecommended ? "translate-x-full" : "translate-x-0"
                    }`}
                  ></div>
                </div>

                {/* Label Text */}
                <span className="ml-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Recommended Place
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt ?? ""}
                onChange={handleChange}
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.description}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description: value }))
                }
                modules={quillModules}
                formats={quillFormats}
                className="rounded-2xl [&_.ql-container]:rounded-b-2xl [&_.ql-toolbar]:rounded-t-2xl"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Place"}
            </button>

            {isDisabled && hasErrors && (
              <p className="mt-2 text-xs text-red-600">
                Please fill all required fields to enable Save
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceFormPage;
