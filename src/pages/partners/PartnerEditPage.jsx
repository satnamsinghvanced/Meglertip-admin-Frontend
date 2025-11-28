/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchPartnerById, updatePartner } from "../../store/slices/partnersSlice";
import axios from "axios";

const PartnerEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { partnerDetail, loading } = useSelector((state) => state.partners);

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    isPremium: false,
    isActive: false,
    postalCodesExact: [""],
    postalCodesRanges: [{ from: "", to: "" }],
  });

  const [wishes, setWishes] = useState([{ question: "", expectedAnswer: "" }]);
  const [allQuestions, setAllQuestions] = useState([]);

  // Fetch partner details
  useEffect(() => {
    if (id) dispatch(fetchPartnerById(id));
  }, [id]);

  // Fetch all questions
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/partners/questions`)
      .then((res) => setAllQuestions(res.data?.questions || []))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  // Populate form once partner details are loaded
  useEffect(() => {
    if (!partnerDetail) return;

    setForm({
      name: partnerDetail.name || "",
      email: partnerDetail.email || "",
      city: partnerDetail.city || "",
      isPremium: partnerDetail.isPremium || false,
      isActive: partnerDetail.isActive || false,
      postalCodesExact: partnerDetail.postalCodes?.exact?.map((x) => x.code) || [""],
      postalCodesRanges: partnerDetail.postalCodes?.ranges?.length
        ? partnerDetail.postalCodes.ranges
        : [{ from: "", to: "" }],
    });

    setWishes(
      partnerDetail.wishes?.map((w) => ({
        question: typeof w.question === "object" ? w.question.question : w.question,
        expectedAnswer: w.expectedAnswer || "",
      })) || [{ question: "", expectedAnswer: "" }]
    );
  }, [partnerDetail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Wishes handlers
  const handleWishChange = (index, field, value) => {
    const updated = [...wishes];
    updated[index][field] = value;
    setWishes(updated);
  };
  const addWish = () => setWishes([...wishes, { question: "", expectedAnswer: "" }]);
  const removeWish = (index) => {
    const updated = wishes.filter((_, i) => i !== index);
    setWishes(updated.length ? updated : [{ question: "", expectedAnswer: "" }]);
  };

  // Postal codes handlers
  const updateExactCode = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const updated = [...form.postalCodesExact];
    updated[index] = value;
    setForm({ ...form, postalCodesExact: updated });
  };
  const removeExactCode = (index) => {
    const updated = form.postalCodesExact.filter((_, i) => i !== index);
    setForm({ ...form, postalCodesExact: updated });
  };
  const addExactCode = () => setForm({ ...form, postalCodesExact: [...form.postalCodesExact, ""] });

  const updateRange = (index, field, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const updated = [...form.postalCodesRanges];
    updated[index][field] = value;
    setForm({ ...form, postalCodesRanges: updated });
  };
  const removeRange = (index) => {
    const updated = form.postalCodesRanges.filter((_, i) => i !== index);
    setForm({ ...form, postalCodesRanges: updated.length ? updated : [{ from: "", to: "" }] });
  };
  const addRange = () => setForm({ ...form, postalCodesRanges: [...form.postalCodesRanges, { from: "", to: "" }] });

  const handleSubmit = async () => {
    if (!id) return toast.error("Partner ID is missing");

    const payload = {
      ...form,
      postalCodes: {
        exact: form.postalCodesExact.filter((c) => c.trim() !== ""),
        ranges: form.postalCodesRanges.filter((r) => r.from.trim() && r.to.trim()),
      },
      wishes,
    };

    try {
      await dispatch(updatePartner({ id, data: payload })).unwrap();
      toast.success("Partner updated successfully");
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
          Back to Companies
        </button>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4 md:grid-cols-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
          />
        </div>

        {/* Postal Codes */}
        <div className="col-span-6">
          <h3 className="text-lg font-semibold mb-2">Exact Postal Codes</h3>
          {form.postalCodesExact.map((code, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => updateExactCode(idx, e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeExactCode(idx)} className="text-red-600 font-bold">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addExactCode} className="px-3 py-2 bg-primary text-white rounded-full mb-4">
            + Add Exact Postal Code
          </button>

          <h3 className="text-lg font-semibold mb-2">Postal Code Ranges</h3>
          {form.postalCodesRanges.map((r, idx) => (
            <div key={idx} className="flex gap-3 mb-3">
              <input
                type="text"
                maxLength={4}
                value={r.from}
                onChange={(e) => updateRange(idx, "from", e.target.value)}
                placeholder="From"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                maxLength={4}
                value={r.to}
                onChange={(e) => updateRange(idx, "to", e.target.value)}
                placeholder="To"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeRange(idx)} className="text-red-600 font-bold">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addRange} className="px-3 py-2 bg-primary text-white rounded-full mb-4">
            + Add Postal Range
          </button>
        </div>

        {/* Premium / Active */}
        <div className="flex items-center gap-3">
          <input type="checkbox"  className="!relative" name="isPremium" checked={form.isPremium} onChange={handleChange} />
          <label>Premium Partner</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="isActive"  className="!relative" checked={form.isActive} onChange={handleChange} />
          <label>Active Partner</label>
        </div>

        {/* Wishes */}
        <div className="col-span-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Preferences</h3>
          {wishes.map((w, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl relative">
              <button type="button" onClick={() => removeWish(i)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
              <div>
                <label className="text-sm font-medium">Question</label>
                <select value={w.question} onChange={(e) => handleWishChange(i, "question", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="">Select question</option>
                  <option value="postalCode">Postal Code</option>
                  {allQuestions.map((q, idx) => <option key={idx} value={q.question}>{q.question}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Expected Answer</label>
                <input type="text" value={w.expectedAnswer} onChange={(e) => handleWishChange(i, "expectedAnswer", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Expected answer" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addWish} className="px-3 py-2 bg-primary text-white rounded-full">+ Add More Preference</button>
        </div>

        <button type="button" onClick={handleSubmit} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary mt-4">
          Update Partner
        </button>
      </form>
    </div>
  );
};

export default PartnerEditPage;
