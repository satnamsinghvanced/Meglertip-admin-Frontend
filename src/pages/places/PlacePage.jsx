import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuFileUp, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";

import { getCities, deleteCity, createCity, importCities } from "../../store/slices/citySlice";
import { ROUTES } from "../../consts/routes";
import { getPlaces } from "../../store/slices/placeSlice";

export const Places = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { places, loading, error } = useSelector((state) => state.places);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [manualCity, setManualCity] = useState({
    name: "",
    slug: "",
    countyId: "",
    title: "",
    excerpt: "",
    description: "",
  });

  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await dispatch(getPlaces({ page, limit })).unwrap();
        console.log(res,"fsdfaf")
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, [dispatch, page, limit]);

  const handleDeleteCity = async () => {
    if (!cityToDelete) return;

    try {
      const res = await dispatch(deleteCity(cityToDelete._id)).unwrap();
      toast.success(res.message || "City deleted");
      setShowDeleteModal(false);
      dispatch(getCities({ page, limit }));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleAddCity = async () => {
    if (!manualCity.name || !manualCity.slug || !manualCity.countyId) {
      return toast.error("Fill required fields");
    }

    try {
      await dispatch(createCity(manualCity)).unwrap();
      toast.success("City added");
      setShowAddModal(false);
      setManualCity({
        name: "",
        slug: "",
        countyId: "",
        title: "",
        excerpt: "",
        description: "",
      });
      dispatch(getCities({ page, limit }));
    } catch (err) {
      toast.error("Failed to add city");
    }
  };

  const handleImportCities = async () => {
    if (!uploadFile) return toast.error("Select a file first");

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      await dispatch(importCities(formData)).unwrap();
      toast.success("Cities imported successfully");
      setUploadFile(null);
      dispatch(getCities({ page, limit }));
    } catch (err) {
      toast.error("Import failed");
    }
  };

  const headerButtons = [
    {
      value: "Import",
      variant: "white",
      icon: <LuFileUp size={18} />,
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => document.getElementById("city-import-input").click(),
    },
    {
      value: "Add Place",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
       onClick: () => navigate(ROUTES.PLACES_CREATE),
    },
  ];

  const totalCities = places?.data?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Places"
        description="Manage places and related information."
        buttonsList={headerButtons}
      />

      <input
        id="city-import-input"
        type="file"
        className="hidden"
        accept=".csv, .xlsx"
        onChange={(e) => {
          setUploadFile(e.target.files[0]);
          handleImportCities();
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Place overview
            </p>
            <p className="text-xs text-slate-500">
              {loading ? "Loading..." : `${totalCities} items`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Place Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(5)].map((__, idx) => (
                      <td key={idx} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td className="px-6 py-6 text-center text-red-500" colSpan="5">
                    {error}
                  </td>
                </tr>
              ) : totalCities > 0 ? (
                places.data.map((city, index) => (
                  <tr key={city._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {city.name}
                    </td>
                 
                    <td className="px-6 py-4">{city.slug}</td>
                    <td className="px-6 py-4">{city.title}</td>
                    <td className="px-6 py-4 line-clamp-2">{city.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/cities/${city._id}/edit`)}
                        >
                          <AiTwotoneEdit size={16} />
                        </button>
                        <button
                          className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setCityToDelete(city);
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
                  <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                    No cities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalCities > 0 && (
          <div className="border-t px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <p className="text-center mb-6 text-lg font-semibold">
              Are you sure you want to delete this city?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-full"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full"
                onClick={handleDeleteCity}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
