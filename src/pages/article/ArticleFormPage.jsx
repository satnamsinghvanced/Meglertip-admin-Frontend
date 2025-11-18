/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  clearSelectedArticle,
  createArticle,
  getArticleById,
  updateArticle,
} from "../../store/slices/articleSlice";
import { getCategories } from "../../store/slices/articleCategoriesSlice";
import { toast } from "react-toastify";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "align",
  "link",
  "image",
];

const ArticleFormPage = () => {
  const { articleId } = useParams();
  const isEditMode = Boolean(articleId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedArticle } = useSelector((state) => state.articles);
  const { categories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    original_slug: "",
    excerpt: "",
    description: "",
    categoryId: "",
    showDate: "",
    language: "en",
    originalSlug: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && articleId) {
      dispatch(getArticleById(articleId));
    } else {
      dispatch(clearSelectedArticle());
    }

    return () => {
      dispatch(clearSelectedArticle());
    };
  }, [dispatch, isEditMode, articleId]);

  useEffect(() => {
    if (isEditMode && selectedArticle) {
      setForm({
        title: selectedArticle.title || "",
        slug: selectedArticle.slug || "",
        original_slug: selectedArticle.original_slug || "",
        excerpt: selectedArticle.excerpt || "",
        description: selectedArticle.description || "",
        categoryId: selectedArticle.categoryId?._id || "",
        showDate: selectedArticle.showDate
          ? selectedArticle.showDate.split("T")[0]
          : "",
        language: selectedArticle.language || "en",
        originalSlug: selectedArticle.originalSlug || "",
      });
      setPreviewImage(selectedArticle.image || "");
    }
  }, [isEditMode, selectedArticle]);

  const headerButtons = useMemo(
    () => [
      {
        value: "Back to articles",
        variant: "white",
        className:
          "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
        onClick: () => navigate( "/articles"),
      },
    ],
    [navigate, isEditMode, articleId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    setPreviewImage(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEditMode) {
        await dispatch(updateArticle({ id: articleId, formData })).unwrap();
        toast.success("Article updated!");
        navigate(`/articles`);
      } else {
        await dispatch(createArticle(formData)).unwrap();
        toast.success("Article created!");
        navigate("/articles");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.message || "Failed to save the article."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Article" : "Create Article"}
        description={
          isEditMode
            ? "Update metadata and content for this article."
            : "Publish a new article with structured content."
        }
        buttonsList={headerButtons}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Title", name: "title" },
              { label: "Slug", name: "slug" },
              // { label: "Original slug", name: "original_slug" },
              { label: "Original slug ", name: "originalSlug" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Show date
              </label>
              <input
                type="date"
                name="showDate"
                value={form.showDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Language
              </label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                rows={3}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.description}
                onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                modules={quillModules}
                formats={quillFormats}
                className="rounded-2xl [&_.ql-container]:rounded-b-2xl [&_.ql-toolbar]:rounded-t-2xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Featured image
            </label>
            {previewImage ? (
              <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-56 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-500"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewImage("");
                    }}
                    title="Remove image"
                  >
                    <RiDeleteBin5Line size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-500 hover:border-slate-300">
                <span>Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticleFormPage;

