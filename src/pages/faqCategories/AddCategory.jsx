// src/pages/faqs/AddCategory.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory, getCategories } from "../../store/slices/category";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ categoryName: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryName.trim()) {
      toast.error("Category name required");
      return;
    }
    try {
      const res = await dispatch(createCategory(form)).unwrap();
      if (res?.success) {
        toast.success("Category created");
        await dispatch(getCategories());
        navigate("/faqs/categories");
      } else {
        toast.error(res?.message || "Failed to create category");
      }
    } catch (err) {
      toast.error("Failed to create category");
      console.error(err);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
        <label className="block">
          <span className="font-medium">Category Name</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            placeholder="Category name"
          />
        </label>

        <label className="block">
          <span className="font-medium">Description (optional)</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Description"
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button type="button" className="px-4 py-2 border border-slate-200 rounded-md" onClick={() => navigate("/faqs/categories")}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
