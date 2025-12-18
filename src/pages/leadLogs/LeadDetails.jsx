import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FaRegCopy } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getLeadById,
  updateLeadStatus,
} from "../../store/slices/leadLogsSlice";
import api from "../../api/axios";

const LeadDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedLead, loading } = useSelector((s) => s.lead);
  const [partnerPrices, setPartnerPrices] = useState([]);
  const [status, setStatus] = useState("");
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (id) dispatch(getLeadById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedLead) {
      setStatus(selectedLead.status);
      setProfit(selectedLead.profit);
      if (selectedLead.partnerIds) {
        setPartnerPrices(
          selectedLead.partnerIds.map((p) => ({
            partnerId: p.partnerId?._id,
            name: p.partnerId?.name,
            email: p.partnerId?.email,
            leadPrice: p.leadPrice || 0,
          }))
        );
      }
    }
  }, [selectedLead]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    dispatch(updateLeadStatus({ leadId: id, status: newStatus }));
  };

  // ✅ Handle per-partner lead price update
  const handlePartnerPriceChange = async (partnerId, value) => {
    const updated = partnerPrices.map((p) =>
      p.partnerId === partnerId ? { ...p, leadPrice: Number(value) } : p
    );
    setPartnerPrices(updated);

    try {
      const res = await api.patch("/lead-logs/update-partner-profit", {
        leadId: id,
        partnerId,
        leadPrice: Number(value),
      });

      if (res.data.success) {
        toast.success("Partner lead price updated!");
        setProfit(res.data.data.profit); // update total profit from backend
      } else {
        toast.error(res.data.message || "Failed to update price");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleProfitChange = (e) => {
    const newProfit = Number(e.target.value);
    setProfit(newProfit);
    // Optional: If you still want to update total profit manually
    // axios.put("/update-lead-profit", { leadId: id, profit: newProfit })
  };

  const headerButtons = [
    {
      value: "Back to leads",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
  ];

  if (loading || !selectedLead) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lead details" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const values = selectedLead.dynamicFields?.[0]?.values || {};
  const leadLog = selectedLead.log ? JSON.parse(selectedLead.log) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Lead #${selectedLead.uniqueId}`}
        description="View and manage detailed lead information."
        buttonsList={headerButtons}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Name", value: values.name },
            { label: "Email", value: values.email },
            { label: "Phone", value: values.phone },
            {
              label: "Created",
              value: new Date(selectedLead.createdAt).toLocaleString(),
            },
            { label: "Status", value: selectedLead.status },
            { label: "Profit", value: profit },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {item.value || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
            Partners & Lead Price
          </p>
          {partnerPrices.length ? (
            <div className="space-y-3">
              {partnerPrices.map((p) => (
                <div
                  key={p.partnerId}
                  className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500">{p.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={p.leadPrice}
                      onChange={(e) => {
                        const updated = partnerPrices.map((partner) =>
                          partner.partnerId === p.partnerId
                            ? { ...partner, leadPrice: Number(e.target.value) }
                            : partner
                        );
                        setPartnerPrices(updated);
                      }}
                      className="w-28 border border-slate-300 rounded-md px-2 py-1 text-sm"
                    />

                    {/* Tick Button */}
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.patch(
                            "/lead-logs/update-partner-profit",
                            {
                              leadId: id,
                              partnerId: p.partnerId,
                              leadPrice: p.leadPrice,
                            }
                          );

                          if (res.data.success) {
                            toast.success("Partner lead price updated!");
                            setProfit(res.data.data.profit); // update total profit
                          } else {
                            toast.error(
                              res.data.message || "Failed to update price"
                            );
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Something went wrong!");
                        }
                      }}
                      className="px-2 py-1 bg-primary text-white rounded hover:bg-primary/80"
                      title="Update partner price"
                    >
                      ✔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm">-</p>
          )}
        </div>

        {/* Status & Total Profit */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
              Update Status
            </p>
            <select
              value={status}
              onChange={handleStatusChange}
              className="border border-slate-200 px-3 py-2 rounded-md w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
              Total Profit
            </p>
            <input
              type="number"
              value={profit}
              onChange={handleProfitChange}
              className="border border-slate-200 px-3 py-2 rounded-md w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
