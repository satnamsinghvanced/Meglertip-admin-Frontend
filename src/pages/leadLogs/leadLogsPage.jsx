import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeads } from "../../store/slices/leadLogsSlice";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";

const LeadLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leads = [], loading, error, pagination } = useSelector((s) => s.lead);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        getAllLeads({
          page,
          limit,
          search,
          status,
        })
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, status]);

  const badgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Complete":
        return "bg-green-100 text-green-700";
      case "Archive":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const totalLeads = leads?.length || 0;
  const totalPages = pagination?.pages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Logs"
        description="Manage all incoming leads with search, filters, and pagination."
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search name, email, partner..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border border-slate-200 px-3 py-2 rounded-md w-64"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border border-slate-200 px-3 py-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
          <option value="Archive">Archive</option>
        </select>
      </div>

      {/* Lead Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">
            Lead entries overview
          </p>
          <p className="text-xs text-slate-500">
            {loading ? "Loading leads..." : `${pagination?.total || 0} items`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Id</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Partner</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Profit</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((__, idx) => (
                      <td key={idx} className="px-6 py-4">
                        <div className="h-4 rounded bg-slate-100"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-6 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : totalLeads > 0 ? (
                leads.map((lead, idx) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">{lead.uniqueId}</td>
                    <td className="px-6 py-4">{lead.dynamicFields?.name}</td>
                    <td className="px-6 py-4">{lead.dynamicFields?.email}</td>
                    <td className="px-6 py-4">{lead.dynamicFields?.phone}</td>
                    <td className="px-6 py-4">
                      {lead.partnerIds?.length
                        ? lead.partnerIds.map((p, i) => (
                            <div key={i}>{p.name}</div>
                          ))
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${badgeColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">₹{lead.profit || 0}</td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalLeads > 0 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadLogs;
