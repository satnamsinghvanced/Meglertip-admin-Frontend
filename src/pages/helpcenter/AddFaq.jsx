// src/pages/faqs/AddFaq.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFAQ, getFAQs } from "../../store/slices/faq";
import { getCategories } from "../../store/slices/category";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddFaq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories = [] } = useSelector((s) => s.category);
  const { loading } = useSelector((s) => s.faq);

  const [form, setForm] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim() || !form.categoryId) {
      toast.error("Please fill question, answer and select category.");
      return;
    }
    try {
      const res = await dispatch(createFAQ(form)).unwrap();
      if (res?.success) {
        // toast.success("FAQ created");
        await dispatch(getFAQs());
        navigate("/faqs");
      } else {
        toast.error(res?.message || "Failed to create FAQ");
      }
    } catch (err) {
    //   toast.error("Failed to create FAQ");
      console.error(err);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Add FAQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
        <label className="block">
          <span className="font-medium">Category</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-medium">Question</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Enter question"
          />
        </label>

        <label className="block">
          <span className="font-medium">Answer</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            rows={6}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Enter answer"
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 rounded-md"
            onClick={() => navigate("/faqs")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-slate-900 text-white"
          >
            {loading ? "Saving..." : "Create FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFaq;
