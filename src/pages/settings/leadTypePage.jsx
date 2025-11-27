import { useState } from "react";
import { toast } from "react-toastify";

const LeadProfitSettingsPage = () => {
  const [profitData, setProfitData] = useState({
    homeLead: {
      profit: "",
      isActive: true,
    },
    allLead: {
      profit: "",
      isActive: true,
    },
  });

  const handleChange = (type, field, value) => {
    setProfitData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleSave = (type) => {
    const item = profitData[type];

    if (!item.profit || isNaN(item.profit)) {
      toast.error("Please enter a valid profit amount (NOK).");
      return;
    }

    // TODO — Connect with API
    // axios.post(`/api/lead-profit/${type}`, item)

    toast.success(`${type === "homeLead" ? "Home Lead" : "All Lead"} updated successfully!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Lead Profit Settings</h1>
      <p className="text-gray-600 mb-10">Set profit values for Home and All Leads (in NOK).</p>

      {/* CARD WRAPPER */}
      <div className="grid gap-8 md:grid-cols-2">

        {/* HOME LEAD */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow">
          <h2 className="text-xl font-semibold mb-4">Home Lead</h2>

          <label className="text-sm font-medium">Profit (NOK)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300"
            value={profitData.homeLead.profit}
            onChange={(e) =>
              handleChange("homeLead", "profit", e.target.value)
            }
            placeholder="Enter profit amount"
          />

          <label className="flex items-center gap-2 mt-4">
            <input
            className="!relative"
              type="checkbox"
              checked={profitData.homeLead.isActive}
              onChange={(e) =>
                handleChange("homeLead", "isActive", e.target.checked)
              }
            />
            Active
          </label>

          <button
            onClick={() => handleSave("homeLead")}
            className="mt-5 w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-secondary transition"
          >
            Save Home Lead Profit
          </button>
        </div>

        {/* ALL LEAD */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow">
          <h2 className="text-xl font-semibold mb-4">All Lead</h2>

          <label className="text-sm font-medium">Profit (NOK)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300"
            value={profitData.allLead.profit}
            onChange={(e) =>
              handleChange("allLead", "profit", e.target.value)
            }
            placeholder="Enter profit amount"
          />

          <label className="flex items-center gap-2 mt-4">
            <input
            className="!relative"
              type="checkbox"
              checked={profitData.allLead.isActive}
              onChange={(e) =>
                handleChange("allLead", "isActive", e.target.checked)
              }
            />
            Active
          </label>

          <button
            onClick={() => handleSave("allLead")}
            className="mt-5 w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-secondary transition"
          >
            Save All Lead Profit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadProfitSettingsPage;
