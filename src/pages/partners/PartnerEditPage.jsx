/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchPartnerById,
  updatePartner,
} from "../../store/slices/partnersSlice";
import axios from "axios";

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

  const [allQuestions, setAllQuestions] = useState([]);

  const [wishes, setWishes] = useState([{ question: "", expectedAnswer: "" }]);

  useEffect(() => {
    if (id) dispatch(fetchPartnerById(id));
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:9090/api/partners/questions").then((res) => {
      setAllQuestions(res.data.questions || []);
    });
  }, []);

  useEffect(() => {
    if (partnerDetail) {
      setFormData({
        name: partnerDetail.name || "",
        city: partnerDetail.city || "",
        postalCodes: partnerDetail.postalCodes?.join(", ") || "",
        isPremium: partnerDetail.isPremium || false,
        isActive: partnerDetail.isActive || false,
      });
const normalized = partnerDetail.wishes?.map(w => ({
  question: typeof w.question === "object" ? w.question.question : w.question,
  expectedAnswer: w.expectedAnswer || ""
}));

setWishes(normalized.length ? normalized : [{ question: "", expectedAnswer: "" }]);
  }
  }, [partnerDetail]);
const removeWish = (index) => {
  const updated = wishes.filter((_, i) => i !== index);
  setWishes(updated.length ? updated : [{ question: "", expectedAnswer: "" }]);
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleWishChange = (index, field, value) => {
    const updated = [...wishes];
    updated[index][field] = value;
    setWishes(updated);
  };

  const addWish = () => {
    setWishes([...wishes, { question: "", expectedAnswer: "" }]);
  };

  const handleSubmit = async () => {
    if (!id) return toast.error("Partner ID is missing");

    const payload = {
      ...formData,
      postalCodes: formData.postalCodes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),

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
          Back to Partners
        </button>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm grid gap-4 md:grid-cols-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
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
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
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
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
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


        <div className="col-span-6 mt-6">
          <h3 className="text-lg font-semibold mb-3"> Preferances</h3>

          {wishes.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl relative"
            >
                <button
      type="button"
      onClick={() => removeWish(i)}
      className="absolute top-2 right-2 text-red-500 hover:text-red-600 font-bold"
    >
      ✕
    </button>
              <div>
                <label className="block text-sm font-medium">Question</label>
                <select
                  value={w.question}
                  onChange={(e) =>
                    handleWishChange(i, "question", e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
                >
                  <option value="">Select your question</option>

                  {allQuestions.map((q, idx) => (
                    <option key={idx} value={q.question}>
                      {q.index}. {q.question}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Expected Answer
                </label>
                <input
                  type="text"
                  value={w.expectedAnswer}
                  onChange={(e) =>
                    handleWishChange(i, "expectedAnswer", e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none border-slate-200 focus:border-primary"
                  placeholder="Type expected answer"
                />
              </div>
            </div>
          ))}
        <div className="flex justify-end items-end"> <button
            type="button"
            onClick={addWish}
            className="px-3 py-2 bg-primary text-white rounded-full "
          >
            + Add More Preferance
          </button></div>
         
        </div>

        <button
          type="button"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary mt-4"
            onClick={handleSubmit}
        >
          Update Partner
        </button>
      </form>


    </div>
  );
};

export default PartnerEditPage;
