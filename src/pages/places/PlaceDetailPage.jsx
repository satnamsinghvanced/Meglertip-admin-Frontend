import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  clearSelectedPlace,
  getPlaceById,
} from "../../store/slices/placeSlice";

const PlaceDetailPage = () => {
  const { placeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedPlace, loading } = useSelector((state) => state.places);

  useEffect(() => {
    if (placeId) {
      dispatch(getPlaceById(placeId));
    }
    return () => {
      dispatch(clearSelectedPlace());
    };
  }, [dispatch, placeId]);

  const headerButtons = [
    {
      value: "Back to Places",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
    {
      value: "Edit Place",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/place/${placeId}/edit`),
    },
  ];

  const renderValue = (label, value) => {
    if (label === "isRecommended") {
      if (value === true) {
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
            Yes
          </span>
        );
      }
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
            No
        </span>
      );
    }
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }
    return String(value);
  };
  
  const detailItems = [
    { label: "slug", value: selectedPlace?.slug },
    { label: "County", value: selectedPlace?.countyId?.name }, 
    { label: "isRecommended", value: selectedPlace?.isRecommended },
    { label: "title", value: selectedPlace?.title },
    { label: "rank", value: selectedPlace?.rank },
  ];

  if (loading && !selectedPlace) {
    return (
      <div className="space-y-6">
        <PageHeader title="Place details" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!selectedPlace) {
    return (
      <div className="space-y-6">
        <PageHeader title="Place details" buttonsList={headerButtons} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Place not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedPlace.name}
        description="Preview the full content for this place."
        buttonsList={headerButtons}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-6 p-6">
          
          <div className="grid gap-4 md:grid-cols-3">
            {detailItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-50 p-4 border border-slate-100"
              >
                <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-slate-900 font-medium">
                  {renderValue(item.label, item.value)}
                </p>
              </div>
            ))}
          </div>

          {selectedPlace.excerpt && (
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Excerpt
              </p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {selectedPlace.excerpt}
              </p>
            </div>
          )}

          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
              Description
            </p>

            <div
              className="prose mt-3 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{
                __html:
                  selectedPlace.description ||
                  "<p>No description provided.</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;