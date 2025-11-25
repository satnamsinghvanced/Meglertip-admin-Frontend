/* eslint-disable no-unused-vars */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPartner } from "../../store/slices/partnersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddPartnerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.partners);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCodes: "",
    isPremium: false,
    isActive: true,
    lastMonth: "",
    currentMonth: "",
    total: "",
  });

  const [wishes, setWishes] = useState([
    { question: "", expectedAnswer: "" },
  ]);

  const [error, setErrors] = useState({});

  const validateForm = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name is required.";

    if (!form.email.trim()) {
      err.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Enter a valid email.";
    }

    if (!form.postalCodes.trim()) {
      err.postalCodes = "Postal codes are required.";
    } else {
      const codes = form.postalCodes.split(",").map((x) => x.trim());
      if (codes.some((c) => !/^[0-9]{4}$/.test(c))) {
        err.postalCodes = "Each postal code must be exactly 4 digits.";
      }
    }

    return err;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === "postalCodes") {
      if (!/^[0-9,\s]*$/.test(value)) return;
      if (value.split(",").some((c) => c.trim().length > 4)) return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ---------------- WISHES HANDLERS ----------------
  const handleWishChange = (index, field, value) => {
    const updated = [...wishes];
    updated[index][field] = value;
    setWishes(updated);
  };

  const addWish = () => {
    setWishes([...wishes, { question: "", expectedAnswer: "" }]);
  };

  const deleteWish = (index) => {
    const updated = wishes.filter((_, i) => i !== index);
    setWishes(updated);
  };
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => toast.error(msg));
      return;
    }

    const payload = {
      ...form,
      postalCodes: form.postalCodes.split(",").map((x) => x.trim()),
      leads: {
        lastMonth: Number(form.lastMonth) || 0,
        currentMonth: Number(form.currentMonth) || 0,
        total: Number(form.total) || 0,
      },
      wishes: wishes,
    };

    const result = await dispatch(createPartner(payload));

    if (result.payload?.success) {
      toast.success("Partner created successfully!");
      navigate("/partners");
    } else {
      toast.error("Failed to create partner.");
    }
  };

  return (
    <div className="px-8 py-8 mx-auto">
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add Partner</h1>
          <p className="text-sm font-medium text-gray-600 mt-2">
            Add a new Partner to the database.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("/partners")}
            className="btn btn-white btn-sm rounded-full border-slate-300 text-slate-700 hover:border-slate-400 px-6 py-2"
          >
            Back to Partners
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white border-slate-200 shadow-sm max-w-8xl m-auto">
        <form onSubmit={handleSubmit} className="p-8 rounded-xl space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Postal Codes (Comma Separated){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCodes"
                placeholder="1001, 2001"
                value={form.postalCodes}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Leads Last Month
              </label>
              <input
                type="number"
                name="lastMonth"
                placeholder="0"
                value={form.lastMonth}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Leads Current Month
              </label>
              <input
                type="number"
                name="currentMonth"
                placeholder="0"
                value={form.currentMonth}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Total Leads
              </label>
              <input
                type="number"
                name="total"
                placeholder="0"
                value={form.total}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* ------------------- WISHES SECTION ------------------- */}
          <div className="pt-8">
            <h2 className="text-lg font-semibold mb-4">Preferance</h2>

            {wishes.map((wish, index) => (
              <div key={index} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="mb-3">
                  <label className="text-sm font-medium">Question</label>
                  <input
                    type="text"
                    value={wish.question}
                    onChange={(e) => handleWishChange(index, "question", e.target.value)}
                    placeholder="Enter question"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm font-medium">Expected Answer</label>
                  <input
                    type="text"
                    value={wish.expectedAnswer}
                    onChange={(e) =>
                      handleWishChange(index, "expectedAnswer", e.target.value)
                    }
                    placeholder="Enter expected answer"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                {wishes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteWish(index)}
                    className="text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addWish}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm"
            >
              + Add Wish
            </button>
          </div>

          {/* ------------------------------------------------------- */}

          <div className="flex items-center gap-10 pt-4">
            <label className="flex items-center gap-2 font-medium">
              <input
                className="!relative"
                type="checkbox"
                name="isPremium"
                checked={form.isPremium}
                onChange={handleChange}
              />
              Premium Partner
            </label>

            <label className="flex items-center gap-2 font-medium">
              <input
                className="!relative"
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Partner"}
          </button>
        </form>
      </div>
    </div>
  );
};
