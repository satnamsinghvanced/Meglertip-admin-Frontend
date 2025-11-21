/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchPartnerById,
  updatePartner,
} from "../../store/slices/partnersSlice";

const PartnerEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { partnerDetail, loading } = useSelector((state) => state.partners);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    postalCodes: "",
    isPremium: false,
    isActive: false,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchPartnerById(id));
  }, [id]);

  useEffect(() => {
    if (partnerDetail) {
      setFormData({
        name: partnerDetail.name || "",
        city: partnerDetail.city || "",
        postalCodes: partnerDetail.postalCodes?.join(", ") || "",
        isPremium: partnerDetail.isPremium || false,
        isActive: partnerDetail.isActive || false,
      });
    }
  }, [partnerDetail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!id) return toast.error("Partner ID is missing");

    const payload = {
      ...formData,
      postalCodes: formData.postalCodes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
    };

    try {
      await dispatch(updatePartner({ id, data: payload })).unwrap();
      toast.success("Partner updated successfully");
      setShowConfirmModal(false);
      navigate("/partners");
    } catch {
      toast.error("Failed to update partner");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Edit Partner</h2>
        <button
          className="btn group btn-white btn-sm rounded-10 text-base border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white"
          onClick={() => navigate(-1)}
        >
          Back to Partners
        </button>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4 md:grid-cols-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-indigo-500"
            value={formData.name}
            onChange={handleChange}
            placeholder="Partner Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-indigo-500"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Postal Codes</label>
          <input
            type="text"
            name="postalCodes"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-indigo-500"
            value={formData.postalCodes}
            onChange={handleChange}
            placeholder="e.g. 1234, 5678"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            className="!relative"
            type="checkbox"
            name="isPremium"
            checked={formData.isPremium}
            onChange={handleChange}
          />
          <label>Premium Partner</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            className="!relative"
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label>Active Partner</label>
        </div>

        <button
          type="button"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary"
          onClick={() => setShowConfirmModal(true)}
        >
          Update Partner
        </button>
      </form>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/60">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
            <p className="text-center text-lg font-semibold mb-6">
              Are you sure you want to update this partner?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 border rounded-full"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-full"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerEditPage;
