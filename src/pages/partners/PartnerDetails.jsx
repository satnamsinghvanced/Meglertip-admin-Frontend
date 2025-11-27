/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPartnerById } from "../../store/slices/partnersSlice";
import { AiTwotoneEdit } from "react-icons/ai";

export const PartnerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { partnerDetail, loading } = useSelector((state) => state.partners);

  useEffect(() => {
    dispatch(fetchPartnerById(id));
  }, [id]);

  if (loading) return <p className="p-5 text-sm">Loading...</p>;

  if (!partnerDetail)
    return <p className="p-5 text-sm">Partner not found</p>;

  const p = partnerDetail;

  return (
    <div className="relative z-10 h-[calc(100vh-4.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-8xl p-4">

        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">{p.name}</h1>
              <p className="text-gray-600 text-sm">{p.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Back
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-900"
                onClick={() => navigate(`/partners/${p._id}/edit`)}
              >
                <AiTwotoneEdit size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 grid sm:grid-cols-2 gap-5 mb-6">

          <InfoCard title="City" value={p.city} />
          <InfoCard title="Postal Codes" value={p.postalCodes?.join(", ") || "-"} />
          <InfoCard title="Address" value={p.address || "-"} />

          <InfoCard title="Premium" value={p.isPremium ? "Yes" : "No"} badge={p.isPremium} />
          <InfoCard title="Status" value={p.isActive ? "Active" : "Inactive"} badge={p.isActive} />

          {/* <InfoCard title="Created At" value={new Date(p.createdAt).toLocaleDateString()} />
          <InfoCard title="Updated At" value={new Date(p.updatedAt).toLocaleDateString()} /> */}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h2 className="text-sm font-semibold mb-3">Leads Summary</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard title="Last Month" value={p.leads?.lastMonth || 0} />
            <StatCard title="Current Month" value={p.leads?.currentMonth || 0} />
            <StatCard title="Total Leads" value={p.leads?.total || 0} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold mb-3">Partner Preferences</h2>

          {p.wishes?.length ? (
            <div className="space-y-3">
              {p.wishes.map((w, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-gray-50 p-3"
                >
                  <p className="text-sm font-medium">
                    {i + 1}. {w.question}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">Answer:</span> {w.expectedAnswer || "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No wishes added.</p>
          )}
        </div>

      </div>
    </div>
  );
};

const InfoCard = ({ title, value, badge }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-gray-500 mb-1">{title}</p>

    {badge !== undefined ? (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          badge ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="text-sm font-medium">{value}</p>
    )}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="rounded-lg bg-slate-50 p-3 text-center">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);
