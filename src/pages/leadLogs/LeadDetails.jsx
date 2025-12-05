import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLeadById,
  updateLeadStatus,
  updateLeadProfit,
} from "../../store/slices/leadLogsSlice";
import PageHeader from "../../components/PageHeader";

const LeadDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedLead, loading } = useSelector((s) => s.lead);

  useEffect(() => {
    dispatch(getLeadById(id));
  }, [id]);

  if (loading || !selectedLead)
    return <p className="p-6 text-slate-600">Loading lead...</p>;

  const values = selectedLead.dynamicFields?.[0]?.values || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Lead #${selectedLead.uniqueId}`}
        description="View and manage detailed lead information."
      />

      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">

        {/* BASIC INFO */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Basic Details</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {values.name || "-"}</p>
            <p><strong>Email:</strong> {values.email || "-"}</p>
            <p><strong>Phone:</strong> {values.phone || "-"}</p>
            <p><strong>Created:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedLead.status}</p>
            <p><strong>Profit:</strong> {selectedLead.profit}</p>
          </div>
        </div>

        {/* DYNAMIC FORM DATA */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">
            Form Details ({selectedLead.dynamicFields?.[0]?.formTitle || "N/A"})
          </h3>

          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            {Object.entries(values).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value || "-"}</p>
            ))}
          </div>
        </div>

        {/* PARTNERS */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Partners</h3>
          <div className="mt-3 text-sm">
            {selectedLead.partnerIds?.length ? (
              selectedLead.partnerIds.map((p) => (
                <p key={p._id}>
                  {p.name} {p.email ? `(${p.email})` : ""}
                </p>
              ))
            ) : (
              "-"
            )}
          </div>
        </div>

        {/* LEAD TYPES */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Lead Types</h3>
          {selectedLead.leadTypes?.length ? (
            selectedLead.leadTypes.map((t) => (
              <p key={t._id}>
                {t.title || "Unknown Type"}{" "}
                {t.description ? `- ${t.description}` : ""}
              </p>
            ))
          ) : (
            "-"
          )}
        </div>

        {/* STATUS UPDATE */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Update Status</h3>
          <select
            value={selectedLead.status}
            onChange={(e) =>
              dispatch(updateLeadStatus({ leadId: id, status: e.target.value }))
            }
            className="border px-3 py-2 rounded-md mt-2"
          >
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
            <option value="Reject">Reject</option>
          </select>
        </div>

        {/* PROFIT UPDATE */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Update Profit</h3>
          <input
            type="number"
            value={selectedLead.profit}
            onChange={(e) =>
              dispatch(updateLeadProfit({ leadId: id, profit: Number(e.target.value) }))
            }
            className="border px-3 py-2 rounded-md mt-2 w-40"
          />
        </div>

        {/* RAW JSON VIEW */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Raw Data</h3>
          <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto">
            {JSON.stringify(selectedLead, null, 2)}
          </pre>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-md bg-slate-900 text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
