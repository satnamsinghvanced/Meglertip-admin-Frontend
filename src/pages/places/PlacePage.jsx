import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuFileUp, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";

import { ROUTES } from "../../consts/routes";
import {
  getPlaces,
  importPlaces,
  deletePlace,
} from "../../store/slices/placeSlice";
import { FaRegEye } from "react-icons/fa";

export const Places = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { places, loading, error } = useSelector((state) => state.places);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadingFileLoader, setShowUploadingFileLoader] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);


  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await dispatch(getPlaces({ page, limit })).unwrap();
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaces();
  }, [dispatch, page, limit]);

  const handleDeletePlace = async () => {
    if (!placeToDelete) return;

    try {
      const res = await dispatch(deletePlace(placeToDelete._id)).unwrap();
      toast.success(res.message || "City deleted");
      setShowDeleteModal(false);
      dispatch(getPlaces({ page, limit }));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  //   if (!manualCity.name || !manualCity.slug || !manualCity.countyId) {
  //     return toast.error("Fill required fields");
  //   }

  //   try {
  //     await dispatch(createPlace(manualCity)).unwrap();
  //     toast.success("Place added");
  //     setShowAddModal(false);
  //     setManualCity({
  //       name: "",
  //       slug: "",
  //       countyId: "",
  //       title: "",
  //       excerpt: "",
  //       description: "",
  //     });
  //     dispatch(getCities({ page, limit }));
  //   } catch (err) {
  //     toast.error("Failed to add place");
  //   }
  // };
  const isValidFileExtension = (file) => {
    if (!file) return false;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".csv") || fileName.endsWith(".xlsx")) {
      return true;
    }
    return false;
  };
  const handleImportPlaces = async () => {
    if (!uploadFile) return toast.error("Select a file first");

    setShowUploadingFileLoader(true);
    const formData = new FormData();
    formData.append("csv", uploadFile);

    try {
      const result = await dispatch(importPlaces(formData)).unwrap();

      const { placesInserted, placesSkipped } = result;

      let successMessage = "";

      if (placesInserted > 0 && placesSkipped === 0) {
        successMessage = `Import successful! ${placesInserted} total records created.`;
        toast.success(successMessage);
      } else if (placesInserted > 0 && placesSkipped > 0) {
        successMessage = `Import successful with mixed results. ${placesInserted} inserted, ${placesSkipped} skipped.`;
        toast.warn(successMessage);
      } else if (placesInserted === 0 && placesSkipped > 0) {
        const details = `${placesSkipped} total records skipped due to duplicates.`;
        toast.info(`Import process complete: ${details}`);
      } else {
        toast.info("Import completed, but no records were processed.");
      }
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      dispatch(getPlaces({ page, limit }));
    } catch (err) {
      toast.error("Import failed");
    } finally {
      setShowUploadingFileLoader(false);
    }
  };
  useEffect(() => {
    if (uploadFile) {
      handleImportPlaces();
    }
  }, [uploadFile, dispatch, page, limit]);

  const headerButtons = [
    {
      value: showUploadingFileLoader ? "Uploading..." : "Import",
      variant: "white",
      icon: showUploadingFileLoader ? (
        <div className="h-4 w-4 animate-spin border-2 border-slate-400 border-t-transparent rounded-full" />
      ) : (
        <LuFileUp size={18} />
      ),
      disabled: showUploadingFileLoader,
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed",
      onClick: () => {
        if (!showUploadingFileLoader) fileInputRef.current.click();
      },
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
        ref={fileInputRef}
        id="place-import-input"
        type="file"
        className="hidden"
        accept=".csv, .xlsx"
        onChange={(e) => {
          const selectedFile = e.target.files[0];

          if (selectedFile) {
            if (isValidFileExtension(selectedFile)) {
              setUploadFile(selectedFile);
            } else {
              toast.error(
                "Invalid file type. Only CSV (.csv) and Excel (.xlsx) files are allowed."
              );

              e.target.value = "";
              setUploadFile(null);
            }
          }
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
                <th className="px-6 py-3">Recommended</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(10)].map((__, idx) => (
                      <td key={idx} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    className="px-6 py-6 text-center text-red-500"
                    colSpan="5"
                  >
                    {error}
                  </td>
                </tr>
              ) : totalCities > 0 ? (
                places.data.map((place, index) => (
                  <tr key={place._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {place.name}
                    </td>

                    <td className="px-6 py-4">{place.slug}</td>
                    <td className="px-6 py-4">
                      {place.title?.length > 20
                        ? place.title.slice(0, 20) + "..."
                        : place.title}
                    </td>
                    <td className="px-6 py-4 line-clamp-1 break-words">
                      {place.description}
                    </td>
                    <td className=" py-1">
                      {place.isRecommended ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          Recommended
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700  ">
                          Not Recommended
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/place/${place._id}`)}
                          title="Preview"
                        >
                          <FaRegEye size={16} />
                        </button>
                        <button
                          className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/place/${place._id}/edit`)}
                        >
                          <AiTwotoneEdit size={16} />
                        </button>
                        <button
                          className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setPlaceToDelete(place);
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
                    colSpan="5"
                    className="px-6 py-6 text-center text-slate-500"
                  >
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
              Are you sure you want to delete this place?
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
                onClick={handleDeletePlace}
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
