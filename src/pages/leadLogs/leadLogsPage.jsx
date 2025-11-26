
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeads } from "../../store/slices/leadLogsSlice";
import { useNavigate } from "react-router-dom";

const LeadLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leads = [], loading } = useSelector((s) => s.lead);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(getAllLeads());
  }, [dispatch]);

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      search === "" ||
      lead.dynamicFields.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.dynamicFields.email?.toLowerCase().includes(search.toLowerCase()) ||
      
      lead.partner?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "" || lead.status === filterStatus;

    return matchSearch && matchStatus;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Logs</h2>
{/* 
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Back to Dashboard
        </button> */}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search name, email, partner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 px-3 py-2 rounded-md w-64"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 px-3 py-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
          <option value="Archive">Archive</option>
        </select>
      </div>

      {/* Lead Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              {/* <th className="p-3 text-left">Phone</th> */}
              <th className="p-3 text-left">Partner</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Profit</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={8}>
                  Loading...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={8}>
                  No leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead._id} className="border border-slate-200 hover:bg-slate-50">
                  <td className="p-3">{lead.dynamicFields.name}</td>
                  <td className="p-3">{lead.dynamicFields.email}</td>
                  {/* <td className="p-3">{lead.partner.phone}</td> */}

                  <td className="p-3">{lead.partner?.name || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${badgeColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-3">₹{lead.profit || 0}</td>

                  <td className="p-3">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/leads/view/${lead._id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      View
                    </button>

                    {/* <button
                      onClick={() => navigate(`/leads/edit/${lead._id}`)}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadLogs;
