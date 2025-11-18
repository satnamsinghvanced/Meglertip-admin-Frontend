import { useEffect, useState, useRef } from "react"; // 👈 Added useRef
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuFileUp, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";

import {
  getCompanies,
  deleteCompany,
  createCompany,
  importCompanies,
} from "../../store/slices/companySlice";
import { ROUTES } from "../../consts/routes";

export const Company = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 👈 Create a ref for the hidden file input
  const fileInputRef = useRef(null); 

  const { companies, loading, error } = useSelector((state) => state.companies);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [manualCompany, setManualCompany] = useState({
    name: "",
    slug: "",
    countyId: "",
    title: "",
    excerpt: "",
    description: "",
  });

  const [uploadFile, setUploadFile] = useState(null);

  // ------------------ Fetch Companies ------------------
  useEffect(() => {
    const fetchCompanies = async () => { // Renamed from fetchCities
      try {
        const res = await dispatch(getCompanies({ page, limit })).unwrap();
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, [dispatch, page, limit]);

  // ------------------ Delete Company ------------------
  const handleDeleteCompany = async () => { // Renamed from handleDeleteCity
    if (!companyToDelete) return;

    try {
      const res = await dispatch(deleteCompany(companyToDelete._id)).unwrap();
      toast.success(res.message || "Company deleted");
      setShowDeleteModal(false);
      dispatch(getCompanies({ page, limit }));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // ------------------ Add Manual Company ------------------
  const handleAddCompany = async () => { // Renamed from handleAddCity
    if (!manualCompany.name || !manualCompany.slug || !manualCompany.countyId) {
      return toast.error("Fill required fields");
    }

    try {
      await dispatch(createCompany(manualCompany)).unwrap();
      toast.success("Company added");
      setShowAddModal(false);
      setManualCompany({
        name: "",
        slug: "",
        countyId: "",
        title: "",
        excerpt: "",
        description: "",
      });
      dispatch(getCompanies({ page, limit }));
    } catch (err) {
      toast.error("Failed to add company"); // Changed toast message
    }
  };
  const isValidFileExtension = (file) => {
    if (!file) return false;
    
    const fileName = file.name.toLowerCase();
    // Check if the filename ends with .csv or .xlsx
    if (fileName.endsWith(".csv") || fileName.endsWith(".xlsx")) {
      return true;
    }
    return false;
  };
  const handleImportCompanies = async () => {
 
    
    const formData = new FormData();
    formData.append("csv", uploadFile);

    try {
      await dispatch(importCompanies(formData)).unwrap();
      toast.success("Companies imported successfully");
      setUploadFile(null); // Clear file state on success

      if (fileInputRef.current) fileInputRef.current.value = ""; 
      
      dispatch(getCompanies({ page, limit }));
    } catch (err) {
      toast.error("Import failed");
    }
  };

  // ------------------ New Effect to Trigger Import ------------------
  // This runs whenever uploadFile changes (i.e., when a file is selected)
  useEffect(() => {
    if (uploadFile) {
      handleImportCompanies();
    }
  }, [uploadFile, dispatch, page, limit]);
  // ------------------------------------------------------------------

  // ------------------ Header Buttons ------------------
  const headerButtons = [
    {
      value: "Import",
      variant: "white",
      icon: <LuFileUp size={18} />,
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      // 👈 MODIFIED: Click the hidden file input instead of running logic
      onClick: () => {
        fileInputRef.current.click(); 
      },
    },
    {
      value: "Add Company",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(ROUTES.COMPANIES_CREATE),
    },
  ];

  const totalCompanies = companies?.data?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage places, counties, and related information."
        buttonsList={headerButtons}
      />

      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef} // 👈 Reference added
        id="company-import-input"
        type="file"
        className="hidden"
        accept=".csv, .xlsx"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          
          if (selectedFile) {
            if (isValidFileExtension(selectedFile)) {
              // 1. Validation SUCCESS: Set the file state
              setUploadFile(selectedFile);
            } else {
              // 2. Validation FAILURE: Show error and clear input
              toast.error("Invalid file type. Only CSV (.csv) and Excel (.xlsx) files are allowed.");
              // IMPORTANT: Clear the input value so the same file can be selected again
              e.target.value = ""; 
              setUploadFile(null); // Ensure state is null
            }
          }
        }}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between  px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Companies overview
            </p>
            <p className="text-xs text-slate-500">
              {loading ? "Loading..." : `${totalCompanies} items`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Company Name</th>
                <th className="px-6 py-3">Address (Competitor)</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Extractor's</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {/* ... Loading and Error states remain the same ... */}
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(10)].map((__, idx) => (
                      <td key={idx} className="px-6 py-6">
                        <div className="h-4 bg-slate-100 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    className="px-6 py-6 text-center text-red-500"
                    colSpan="6" // Changed colspan to 6 for 6 columns
                  >
                    {error}
                  </td>
                </tr>
              ) : totalCompanies > 0 ? (
                companies.data.map((company, index) => (
                  <tr key={company._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {company.companyName}
                    </td>

                    <td className="px-6 py-4">{company.address}</td>
                    <td className="px-6 py-4">
                      {/* Assuming description is a string with newlines */}
                      {company.description.split("\n")[2]}
                    </td>
                    <td className="px-6 py-4">
                      {/* Assuming extractor is an array of strings */}
                      {company.extractor.map((item, idx) => (
                        <div key={idx}>{item}</div>
                      ))}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                          onClick={() =>
                            navigate(`/company/${company._id}/edit`)
                          }
                        >
                          <AiTwotoneEdit size={16} />
                        </button>
                        <button
                          className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setCompanyToDelete(company);
                            setShowDeleteModal(true);
                          }}
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6" // Changed colspan to 6
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalCompanies > 0 && (
          <div className=" px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      {/* Delete Modal (Removed handleAddCity/handleDeleteCity renamings in JSX for brevity, assuming you will rename them) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="mb-6 text-center text-lg font-semibold">
              Are you sure you want to delete this company?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-full border px-4 py-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-white"
                onClick={handleDeleteCompany} // 👈 Used renamed function
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Company Modal (Removed handleAddCity/handleDeleteCity renamings in JSX for brevity, assuming you will rename them) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <button
              className="absolute right-4 top-4 rounded-full border p-2"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h3 className="mb-6 text-center text-xl font-semibold">
              Add New Company
            </h3>

            {[
              { key: "name", label: "Company Name" },
              { key: "slug", label: "Slug" },
              { key: "countyId", label: "County ID" }, // Changed from email/zipCode
            ].map((field) => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-semibold text-slate-600">
                  {field.label}
                </label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  value={manualCompany[field.key]}
                  onChange={(e) =>
                    setManualCompany({
                      ...manualCompany,
                      [field.key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            {/* Description fields */}
            {["title", "excerpt", "description"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-semibold text-slate-600">
                  {field.toUpperCase()}
                </label>
                <textarea
                  className="w-full rounded-xl border px-3 py-2"
                  rows={field === "description" ? 5 : 2}
                  value={manualCompany[field]}
                  onChange={(e) =>
                    setManualCompany({
                      ...manualCompany,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-full border px-4 py-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-primary px-4 py-2 text-white"
                onClick={handleAddCompany} // 👈 Used renamed function
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;