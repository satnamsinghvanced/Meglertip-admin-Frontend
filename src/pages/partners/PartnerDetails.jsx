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
    return <p style={{ padding: "20px", fontSize: "18px" }}>Loading...</p>;
  }

  if (!partnerDetail) {
    return (
      <p style={{ padding: "20px", fontSize: "18px" }}>Partner not found</p>
    );
  }

  const p = partnerDetail;

  return (
    <div className="relative z-10 h-[calc(100vh-4.5rem)] overflow-y-auto bg-transparent ">
      <div className="mx-auto max-w-[1600px]">
        <div className="no-print flex flex-col lg:flex-row w-full justify-between lg:items-center gap-5 mb-8 undefined">
          <div>
            {" "}
            <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>{p.name}</h1>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
              Preview the full content for this partner.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 undefined">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 xs:gap-4 undefined">
              <button
                onClick={() => navigate(-1)}
                className="btn group btn-white btn-sm rounded-10 text-base w-full  undefined border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white"
              >
                <p className="flex gap-1 xs:gap-2 font-bold sm:text-sm md:text-base justify-center items-center whitespace-nowrap ">
                  Back to partners
                </p>
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
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
                <AiTwotoneEdit /> Edit Partner
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
          <div className="grid gap-4 md:grid-cols-3">
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
            <InfoCard title="Address" value={p.address || "-"} />
          </div>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, badge }) => (
  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
    <p style={{ fontSize: "14px", color: "#777", marginBottom: "8px" }}>
      {title}
    </p>

    {badge !== undefined ? (
      <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold bg-slate-900"
      
      >
        {value}
      </span>
    ) : (
      <p style={{ fontSize: "18px" }}>{value}</p>
    )}
  </div>
);
