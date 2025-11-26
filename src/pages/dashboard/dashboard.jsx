import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/dashboard/stats`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  const { topPartners, growthData, totals } = stats;
  console.log(stats);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of leads, performance, and partner ranking."
      />

      {/* TOTAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 ">
          <p className="text-sm text-slate-500">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900">
            {totals?.totalLeads || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 ">
          <p className="text-sm text-slate-500">Total Partners</p>
          <p className="text-3xl font-bold text-slate-900">
            {totals?.totalPartners || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 ">
          <p className="text-sm text-slate-500">Leads This Month</p>
          <p className="text-3xl font-bold text-slate-900">
            {totals?.leadsThisMonth || 0}
          </p>
        </div>
      </div>

      {/* TOP PARTNERS */}
      <div className="border border-slate-200 rounded-xl bg-white ">
        <div className="border border-slate-200 px-6 py-4 rounded-xl">
          <h3 className="font-semibold text-lg">Top 5 Partners</h3>
          <p className="text-xs text-slate-500">Based on total leads</p>
        </div>

        <ul className="divide-y">
          {topPartners?.map((p, i) => (
            <li key={i} className="px-6 py-4 flex justify-between">
              <span className="font-medium"> {p?.partnerName}</span>
              <span className="font-semibold">{p?.totalLeads} Leads</span>
            </li>
          ))}
        </ul>
      </div>

      {/* GROWTH TABLE */}
      <div className="border border-slate-200 rounded-xl bg-white ">
        <div className="border border-slate-200 px-6 py-4 rounded-xl">
          <h3 className="font-semibold text-lg">Growth From Last Month</h3>
          <p className="text-xs text-slate-500">Lead performance comparison</p>
        </div>

        <table className="w-full text-sm ">
          <thead>
            <tr className="border border-slate-200  bg-slate-50 text-left ">
              <th className="px-6 py-3">Partner Name</th>
              <th className="px-6 py-3">Last Month</th>
              <th className="px-6 py-3">This Month</th>
              <th className="px-6 py-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {growthData?.map((row, i) => (
              <tr key={i} className="border border-slate-200">
                <td className="px-6 py-3">{row?.partnerName}</td>
                <td className="px-6 py-3">{row?.lastMonth || 0}</td>
                <td className="px-6 py-3">{row?.leadsThisMonth || 0}</td>
                <td
                  className={`px-6 py-3 font-semibold ${
                    row?.growthPercent >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {row?.growthPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
