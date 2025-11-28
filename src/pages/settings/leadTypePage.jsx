import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchLeadTypes,
  updateLeadType,
  createLeadType,
} from "../../store/slices/leadTypeSlice";

const LeadProfitSettingsPage = () => {
  const dispatch = useDispatch();
  const { leadTypes, loading, error } = useSelector((state) => state.leadType);

  const [profitData, setProfitData] = useState({});
  const [newLeadType, setNewLeadType] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchLeadTypes());
  }, [dispatch]);

  useEffect(() => {
    const data = {};
    leadTypes.forEach((lt) => {
      data[lt._id] = {
        profit: lt.price,
        isActive: true,
        name: lt.name,
      };
    });
    setProfitData(data);
  }, [leadTypes]);

  const handleChange = (id, field, value) => {
    setProfitData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const item = profitData[id];
    if (!item.profit || isNaN(item.profit)) {
      toast.error("Please enter a valid profit amount (NOK).");
      return;
    }

    try {
      await dispatch(
        updateLeadType({
          id,
          data: { defaultPrice: item.profit, name: item.name },
        })
      ).unwrap();
      toast.success(`${item.name} profit updated successfully!`);
    } catch (err) {
      toast.error(err.message || "Failed to update profit");
    }
  };

  const handleAddLeadType = async () => {
    if (!newLeadType.name || !newLeadType.defaultPrice) {
      toast.error("Please enter a name and profit.");
      return;
    }

    try {
      await dispatch(createLeadType(newLeadType)).unwrap();
      toast.success("Lead type added successfully!");
      setNewLeadType({ name: "", defaultPrice: "" });
      dispatch(fetchLeadTypes());
    } catch (err) {
      toast.error(err.message || "Failed to add lead type");
    }
  };

  return (
    <div className="max-w-6xl bg-white mx-auto px-6 py-10 rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Lead Profit Settings</h1>
      <p className="text-gray-600 mb-10">
        Set profit values for all lead types (in NOK).
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {loading
          ? [...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow animate-pulse"
              >
                <div className="h-6 w-32 bg-slate-200 mb-4 rounded"></div>
                <div className="h-4 bg-slate-200 mb-2 rounded"></div>
                <div className="h-10 bg-slate-200 mb-2 rounded"></div>
                <div className="h-4 bg-slate-200 mb-2 rounded w-24"></div>
                <div className="h-10 bg-slate-200 mt-4 rounded"></div>
              </div>
            ))
          : Object.keys(profitData).map((id) => (
              <div
                key={id}
                className="p-6 rounded-2xl  border border-slate-200 shadow"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {profitData[id].name}
                </h2>
                <label className="text-sm font-medium mt-2">
                  Lead Type Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300"
                  value={profitData[id].name}
                  onChange={(e) => handleChange(id, "name", e.target.value)}
                  placeholder="Lead type name"
                />
                <label className="text-sm font-medium">Profit (NOK)</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300"
                  value={profitData[id].profit}
                  onChange={(e) => handleChange(id, "profit", e.target.value)}
                  placeholder="Enter profit amount"
                />

                <button
                  onClick={() => handleSave(id)}
                  className="mt-5 w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-secondary transition"
                >
                  Save
                </button>
              </div>
            ))}

        {/* <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Lead Type</h2>

          <input
            type="text"
            className="w-full rounded-xl border px-3 py-2 mb-3"
            placeholder="Lead type name"
            value={newLeadType.name}
            onChange={(e) =>
              setNewLeadType({ ...newLeadType, name: e.target.value })
            }
          />

          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 mb-3"
            placeholder="Default profit (NOK)"
            value={newLeadType.defaultPrice}
            onChange={(e) =>
              setNewLeadType({ ...newLeadType, defaultPrice: e.target.value })
            }
          />

          <button
            onClick={handleAddLeadType}
            className="mt-2 w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-secondary transition"
          >
            Add Lead Type
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LeadProfitSettingsPage;
