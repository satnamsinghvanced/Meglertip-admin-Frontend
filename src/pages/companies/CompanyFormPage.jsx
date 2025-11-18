import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  clearSelectedCompany,
  createCompany,
  getCompanyById,
  updateCompany,
} from "../../store/slices/companySlice"; // ADJUSTED SLICE ACTIONS
import { toast } from "react-toastify";

// Configuration for ReactQuill is kept the same
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

const CompanyFormPage = () => {
  const { companyId } = useParams();
  const isEditMode = Boolean(companyId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCompany } = useSelector((state) => state.companies); // Assuming selected item is in 'companies' slice

  // --- 1. STATE INITIALIZATION: MATCHING MONGODB SCHEMA ---
  const [form, setForm] = useState({
    companyName: "",
    city: "",
    address: "",
    description: "",
    websiteAddress: "",
    extractor: "", // Initialized as string for easier form handling, will be split/joined
    brokerSites: "", // Initialized as string for easier form handling, will be split/joined
  });
  const [companyImageFile, setCompanyImageFile] = useState(null); // Renamed for clarity
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- 2. FETCH DATA/SETUP useEffects ---

  useEffect(() => {
    if (isEditMode && companyId) {
      dispatch(getCompanyById(companyId)); // Changed to company action
    } else {
      dispatch(clearSelectedCompany()); // Changed to company action
    }

    return () => {
      dispatch(clearSelectedCompany()); // Changed to company action
    };
  }, [dispatch, isEditMode, companyId]);

  useEffect(() => {
    if (isEditMode && selectedCompany) {
      setForm({
        companyName: selectedCompany.companyName || "",
        city: selectedCompany.city || "",
        address: selectedCompany.address || "",
        description: selectedCompany.description || "",
        websiteAddress: selectedCompany.websiteAddress || "",
        // Convert arrays (extractor, brokerSites) back to comma-separated strings for form
        extractor: Array.isArray(selectedCompany.extractor)
          ? selectedCompany.extractor.join(", ")
          : "",
        brokerSites: Array.isArray(selectedCompany.brokerSites)
          ? selectedCompany.brokerSites.join(", ")
          : "",
      });
      setPreviewImage(selectedCompany.companyImage || ""); // Use companyImage field
    }
  }, [isEditMode, selectedCompany]);

  // --- 3. HANDLERS ---

  const headerButtons = useMemo(
    () => [
      {
        value: "Back to Companies",
        variant: "white",
        className:
          "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
        onClick: () => navigate(-1),
      },
    ],
    [navigate]
  ); // Removed unnecessary dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setCompanyImageFile(file || null); // Use companyImageFile
    setPreviewImage(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    // Prepare data for submission
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "extractor" || key === "brokerSites") {
          // Convert comma-separated string back to array for submission
          const arrayValue = value.split(",").map((s) => s.trim()).filter(s => s.length > 0);
          arrayValue.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (companyImageFile) {
      formData.append("companyImage", companyImageFile); // Use companyImageFile and correct key
    }

    try {
      if (isEditMode) {
        console.log('--- FormData Contents ---');
        for (const [key, value] of formData.entries()) {
          // For large files, this will show [object File]
          console.log(`${key}:`, value);
        }
        console.log('-------------------------');
        await dispatch(updateCompany({ id: companyId, companyData:formData })).unwrap(); // Changed to company action
        toast.success("Company updated!");
        navigate(`/companies`); // Changed route
      } else {
        await dispatch(createCompany(formData)).unwrap(); // Changed to company action
        toast.success("Company created!");
        navigate("/companies"); // Changed route
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.message || "Failed to save the company."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- 4. RENDER JSX: Updated Form Fields ---
  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Company Details" : "Add Company"}
        description={
          isEditMode
            ? "Update content for this Company."
            : "Add a new Company to the database."
        }
        buttonsList={headerButtons}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Main Details (companyName, city, address, websiteAddress) */}
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Company Name", name: "companyName" },
            //   { label: "City", name: "city" },
              { label: "Website Address", name: "websiteAddress" },
              { label: "Address", name: "address" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  required={field.name === "companyName"} // Only companyName is required based on schema
                />
              </div>
            ))}
          </div>

          {/* Array Fields (Extractor, Broker Sites) */}
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {[
              { label: "Extractor Tags (Comma Separated)", name: "extractor" },
              { label: "Broker Sites (Comma Separated)", name: "brokerSites" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., tag1, tag2, tag3"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            ))}
          </div>

          {/* Description */}
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
        </div>

        {/* Right Column (Image and Submit) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Company Image
            </label>
            {previewImage ? (
              <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-56 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-500"
                    onClick={() => {
                      setCompanyImageFile(null); // Use companyImageFile
                      setPreviewImage("");
                    }}
                    title="Remove image"
                  >
                    <RiDeleteBin5Line size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-500 hover:border-slate-300">
                <span>Click to upload Company Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Company"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyFormPage;