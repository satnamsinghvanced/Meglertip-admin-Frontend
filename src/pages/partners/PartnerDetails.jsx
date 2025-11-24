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

  if (loading) {
    return <p className="p-5 text-lg">Loading...</p>;
  }

  if (!partnerDetail) {
    return <p className="p-5 text-lg">Partner not found</p>;
  }

  const p = partnerDetail;

  return (
    <div className="relative z-10 h-[calc(100vh-4.5rem)] overflow-y-auto bg-transparent">
      <div className="mx-auto max-w-[1600px]">
        <div className="no-print flex flex-col lg:flex-row w-full justify-between lg:items-center gap-5 mb-8">
          <div>
            {" "}
            <h1  className="text-center md:text-start text[32px] font-bold">{p.name}</h1>
            <p className="text-sm font-medium text-gray-600 text-center md:text-start dark:text-gray-400 mt-2">
              Preview the full content for this partner.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 undefined">
            <div className="flex flex-col sm:flex-row justify-between items-center md:w-full  gap-2 xs:gap-4 undefined">
              <button
                onClick={() => navigate(-1)}
                className="btn group btn-white btn-sm rounded-10 text-base w-full 
                border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                <p className="flex gap-2 font-bold sm:text-sm md:text-base justify-center items-center">
                  Back to partners
                </p>
              </button>
              <button className="flex align-middle gap-3 justify-center "
                style={{
               
                  backgroundColor: "#161925",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={() => navigate(`/partners/${p._id}/edit`)}
              >
               <p className="flex justify-center gap-3  align-middle"> <AiTwotoneEdit /> Edit Partner</p>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:p-6   p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard title="Email" value={p.email} />
            <InfoCard title="City" value={p.city} />

            <InfoCard
              title="Postal Codes"
              value={p.postalCodes?.join(", ") || "-"}
            />

            <InfoCard
              title="Premium"
              value={p.isPremium ? "Yes" : "No"}
              badge={p.isPremium}
            />

            <InfoCard
              title="Status"
              value={p.isActive ? "Active" : "Inactive"}
              badge={p.isActive}
            />

        </div>
      </div>
    </div>
    </div>
  )}
  

const InfoCard = ({ title, value, badge }) => (
  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
    <p className="text-sm text-gray-500 mb-2">{title}</p>

    {badge !== undefined ? (
      <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
        {value}
      </span>
    ) : (
      <p className="text-lg font-medium">{value}</p>
    )}
  </div>
)
