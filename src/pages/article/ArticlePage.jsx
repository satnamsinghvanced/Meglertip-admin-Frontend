import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { LuFolderPlus, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { getArticles, deleteArticle } from "../../store/slices/articleSlice";
import { createCategory } from "../../store/slices/articleCategoriesSlice";
import Pagination from "../../UI/pagination";
import { useNavigate } from "react-router";
import PageHeader from "../../components/PageHeader";

const ArticlePage = () => {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: "",
    slug: "",
    description: "",
    language: "",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await dispatch(getArticles({ page, limit })).unwrap();
        setTotalPages(res.pagination.pages || 1);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, [dispatch, page, limit]);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      const response = await dispatch(deleteArticle(articleToDelete._id));
      if (response?.payload?.message) {
        toast.success(response.payload.message);
      } else {
        toast.success("Article deleted");
      }
      setShowDeleteModal(false);
      setArticleToDelete(null);
      dispatch(getArticles({ page, limit }));
    } catch (err) {
      console.error("Error deleting article:", err);
      toast.error("Failed to delete article");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.title || !newCategory.slug || !newCategory.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await dispatch(createCategory(newCategory));
      toast.success("Category added");
      setShowAddCategoryModal(false);
      setNewCategory({ title: "", slug: "", description: "", language: "" });
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err?.message || "Failed to add category");
    }
  };

  const headerButtons = [
    {
      value: "Add Category",
      variant: "white",
      icon: <LuFolderPlus size={18} />,
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => setShowAddCategoryModal(true),
    },
    {
      value: "New Article",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate("/articles/create"),
    },
  ];

  const totalArticles = articles?.data?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Articles"
        description="Manage article content, categories, and publishing details."
        buttonsList={headerButtons}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Articles overview
            </p>
            <p className="text-xs text-slate-500">
              {loading ? "Loading articles..." : `${totalArticles} items`}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((__, idx) => (
                      <td key={idx} className="px-6 py-4">
                        <div className="h-4 rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-red-500">
                    {error || "Something went wrong while loading articles."}
                  </td>
                </tr>
              ) : totalArticles > 0 ? (
                articles.data.map((article, index) => (
                  <tr key={article._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {article.title}
                    </td>
                    <td className="px-6 py-4">
                      {article.categoryId?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {article.createdBy?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/articles/${article._id}`)}
                          title="Preview"
                        >
                          <FaRegEye size={16} />
                        </button>
                        <button
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
                          onClick={() =>
                            navigate(`/articles/${article._id}/edit`)
                          }
                          title="Edit article"
                        >
                          <AiTwotoneEdit size={16} />
                        </button>
                        <button
                          className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteClick(article)}
                          title="Delete"
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-slate-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalArticles > 0 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-2xl">
            <p className="mb-6 text-base font-semibold text-slate-900">
              Are you sure you want to delete this article?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={handleDeleteArticle}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <button
              className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
              onClick={() => setShowAddCategoryModal(false)}
            >
              ✕
            </button>
            <h3 className="mb-5 text-center text-xl font-semibold text-slate-900">
              Add New Category
            </h3>

            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Slug", key: "slug", type: "text" },
            ].map((field) => (
              <div key={field.key} className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={newCategory[field.key]}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, [field.key]: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Language
              </label>
              <input
                type="text"
                placeholder="Enter language (e.g., English)"
                value={newCategory.language}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, language: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;