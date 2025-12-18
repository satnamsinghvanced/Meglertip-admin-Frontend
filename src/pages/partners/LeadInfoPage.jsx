import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";

const LeadInfo = () => {
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("currentMonth");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [csvData, setCsvData] = useState([]);

const fetchLeadInfo = async () => {
  setLoading(true);
  try {
    // Build params dynamically
    const params = { partnerId, filter: dateFilter };
    
    // Only send custom start/end dates if filter is "custom"
    if (dateFilter === "custom") {
      if (customDates.start) params.startDate = customDates.start;
      if (customDates.end) params.endDate = customDates.end;
    }

    const res = await api.get("/lead-logs/partner-summary", { params });

    if (res.data.success) {
      const data = res.data.data;
      setPartnerData(data);

      const csv = data.leadTypes.flatMap((lt) => [
        {
          "Lead Type": lt.leadType,
          Count: lt.count,
          "Price per Lead": lt.pricePerLead,
          "Total Price": lt.totalPrice,
          "Lead IDs": lt.leadIds.join(", "),
        },
      ]);
      setCsvData(csv);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch lead info");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLeadInfo();
  }, [dateFilter, customDates]);
  const headerButtons = [
    {
      value: "Back",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
  ];
  return (
    <div className="space-y-6">


      <PageHeader
        title="Lead Summary"
        description="Overview of leads for this partner with CSV export."
        buttonsList={headerButtons}
      />


      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow flex flex-wrap gap-4 items-center">
        <select
          className="p-2 border border-slate-300 rounded-lg min-w-[180px]"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="currentMonth">Current Month</option>
          <option value="previousMonth">Previous Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateFilter === "custom" && (
          <>
            <input
              type="date"
              name="start"
              value={customDates.start}
              onChange={(e) =>
                setCustomDates({ ...customDates, start: e.target.value })
              }
              className="p-2 border border-slate-300 rounded-lg"
            />
            <input
              type="date"
              name="end"
              value={customDates.end}
              onChange={(e) =>
                setCustomDates({ ...customDates, end: e.target.value })
              }
              className="p-2 border border-slate-300 rounded-lg"
            />
          </>
        )}

        <button
          onClick={fetchLeadInfo}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Filter
        </button>

        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            filename={`partner_leads_${Date.now()}.csv`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Export CSV
          </CSVLink>
        )}
      </div>

      {/* Lead Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm w-full">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Lead Overview
            </p>
            <p className="text-xs text-slate-500">
              {loading
                ? "Loading..."
                : `Total Leads: ${
                    partnerData?.totalLeads || 0
                  } | Grand Total: ${partnerData?.grandTotal || 0}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Lead Type</th>
                <th className="px-6 py-3">Count</th>
                <th className="px-6 py-3">Price per Lead</th>
                <th className="px-6 py-3">Total Price</th>
                <th className="px-6 py-3">Lead IDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : partnerData?.leadTypes.length > 0 ? (
                partnerData.leadTypes.map((lt) => (
                  <tr key={lt.leadType} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{lt.leadType}</td>
                    <td className="px-6 py-4">{lt.count}</td>
                    <td className="px-6 py-4">{lt.pricePerLead}</td>
                    <td className="px-6 py-4">{lt.totalPrice}</td>
                    <td className="px-6 py-4">{lt.leadIds.join(", ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadInfo;
