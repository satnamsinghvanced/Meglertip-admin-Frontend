/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    dispatch(fetchPartnerById(id));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      postalCodes: formData.postalCodes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
    };

    const result = await dispatch(updatePartner({ id, data: payload }));
    if (updatePartner.fulfilled.match(result)) {
      navigate("/partners");
    }
  };

  return (
    <div className=" ">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-5">Edit Partner</h2>
        </div>
        <div className="">
          <div>
            <button
              className="btn group btn-white btn-sm rounded-10 text-base w-full  undefined border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white"
              onClick={() => navigate(-1)}
            >
              <p className="flex gap-1 xs:gap-2 font-bold sm:text-sm md:text-base justify-center items-center whitespace-nowrap undefined">
                Back to Companies
              </p>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-6">
            {" "}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    border-slate-200 focus:border-indigo-500"
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
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    border-slate-200 focus:border-indigo-500"
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
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    border-slate-200 focus:border-indigo-500"
                value={formData.postalCodes}
                onChange={handleChange}
                placeholder="e.g. 1234, 5678, 7890"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>

            <button
              type="submit"
              className=" rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Partner
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PartnerEditPage;
