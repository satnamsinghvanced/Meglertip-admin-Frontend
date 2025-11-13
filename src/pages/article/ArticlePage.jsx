import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  clearSelectedArticle,
  deleteArticle,
} from "../../store/slices/articleSlice";
import {
  createCategory,
  getCategories,
} from "../../store/slices/articleCategoriesSlice";
import Pagination from "../../UI/pagination";

const ArticlePage = () => {
  const dispatch = useDispatch();
  const { articles, selectedArticle, loading, error } = useSelector(
    (state) => state.articles
  );
  const { categories } = useSelector((state) => state.categories);
  const user = useSelector((state) => state.user.auth_user);

  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    original_slug: "",
    excerpt: "",
    description: "",
    createdBy: user?._id || "",
    categoryId: "",
    showDate: "",
    language: "en",
    originalSlug: "",
    image: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const openAddModal = () => {
    setIsEditing(false);
    setNewArticle({
      title: "",
      slug: "",
      original_slug: "",
      excerpt: "",
      description: "",
      createdBy: user?._id || "",
      categoryId: "",
      showDate: "",
      language: "en",
      originalSlug: "",
      image: null,
    });
    setShowFormModal(true);
  };
  const [newCategory, setNewCategory] = useState({
    title: "",
    slug: "",
    description: "",
    language: "",
  });
  const openEditModal = (article) => {
    setIsEditing(true);
    setNewArticle({
      ...article,
      image: article.image || null,
      categoryId: article.categoryId?._id || "",
      createdBy: article.createdBy?._id || user?._id || "",
    });
    setShowFormModal(true);
  };

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewArticle({ ...newArticle, image: files[0] });
    } else {
      setNewArticle({ ...newArticle, [name]: value });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!newArticle.title) formErrors.title = "Title is required";
    if (!newArticle.slug) formErrors.slug = "Slug is required";
    if (!newArticle.categoryId) formErrors.categoryId = "Category is required";
    if (!newArticle.showDate) formErrors.showDate = "Show Date is required";
    if (!newArticle.image) formErrors.image = "Image is required";
    if (newArticle.image && newArticle.image.size > 5000000) {
      formErrors.image = "Image size must be less than 5MB";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(newArticle).forEach((key) => {
      if (newArticle[key] !== null) formData.append(key, newArticle[key]);
    });

    try {
      let response;

      if (isEditing) {
        response = await dispatch(
          updateArticle({ id: newArticle._id, formData })
        ).unwrap();
      } else {
        response = await dispatch(createArticle(formData)).unwrap();
      }

      toast.success(
        response?.message || (isEditing ? "Article updated!" : "Article added!")
      );

      dispatch(getArticles());

      setShowFormModal(false);
    } catch (err) {
      console.error("Error saving article:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  const viewArticle = (id) => {
    dispatch(getArticleById(id));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(clearSelectedArticle());
  };
  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      let response;
      response = await dispatch(deleteArticle(articleToDelete._id));
      console.log(response);
      setShowDeleteModal(false);
      toast.success(response?.payload?.message);
      dispatch(getArticles({ page, limit }));
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const handleAddCategory = async () => {
    if (
      !newCategory.title ||
      !newCategory.slug ||
      !newCategory.description ||
      !newCategory.language
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await dispatch(createCategory(newCategory));
      setShowAddCategoryModal(false);
      setNewCategory({ title: "", slug: "", description: "", language: "" });
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err?.message || "Failed to add category");
      setNewCategory({ title: "", slug: "", description: "", language: "" });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 space-y-10">
      <div className="flex md:flex-row flex-col justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Articles</h1>
        <div className="flex gap-3 flex-wrap max-md:justify-center">
         <button
          type="button"
          onClick={() => setShowAddCategoryModal(true)}
          className="bg-[#161925] text-white px-3 py-2 rounded-lg hover:bg-[#161925]/85 transition"
        >
         + Add Article Category
        </button>
        <button
          className="px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition"
          onClick={openAddModal}
        >
          + Add New Article
        </button>
       </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-6"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-red-500 font-medium"
                >
                  {error || "Something went wrong while loading articles."}
                </td>
              </tr>
            ) : articles?.data?.length > 0 ? (
              articles.data.map((article, index) => (
                <tr key={article._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 font-semibold">{article.title}</td>
                  <td className="px-6 py-4">
                    {article.categoryId?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {article.createdBy?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      className="px-2"
                      onClick={() => viewArticle(article._id)}
                    >
                      <FaRegEye size={20} className="text-[#2a4165]" />
                    </button>
                    <button
                      className="px-2"
                      onClick={() => openEditModal(article)}
                    >
                      <AiTwotoneEdit
                        size={20}
                        className="text-[#161925] text-xl"
                      />
                    </button>
                    <button
                      className="text-red-600 px-2"
                      onClick={() => handleDeleteClick(article)}
                    >
                      <RiDeleteBin5Line className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {articles?.data?.length > 0 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 dark:bg-blue-950 rounded-lg w-[350px] shadow-lg">
            <p className="mb-6 font-bold text-center dark:text-white">
              Are you sure you want to delete this article?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteArticle}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>

            {selectedArticle.image && (
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-52 object-contain rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 text-gray-800">
              <p>
                <strong>Category:</strong>{" "}
                {selectedArticle.categoryId?.title || "N/A"}
              </p>
              <p>
                <strong>Author:</strong>{" "}
                {selectedArticle.createdBy?.username || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedArticle.createdAt).toLocaleDateString()}
              </p>
              <div>
                <strong>Description:</strong>
                <div
                  className="mt-1 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedArticle.description || "<p>No description</p>",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Category Modal */}
{showAddCategoryModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg w-[350px]">
      <h3 className="text-lg font-semibold mb-4 text-center dark:text-white">
        Add New Category
      </h3>
    <label className="text-sm text-gray-600 dark:text-gray-300">Title</label>
      <input
        type="text"
        placeholder="Enter category title"
        value={newCategory.title}
        onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Slug</label>
      <input
        type="text"
        placeholder="Enter slug"
        value={newCategory.slug}
        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
      <textarea
        placeholder="Enter description"
        value={newCategory.description}
        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Language</label>
      <input
        type="text"
        placeholder="Enter language (e.g., English)"
        value={newCategory.language}
        onChange={(e) => setNewCategory({ ...newCategory, language: e.target.value })}
        className="w-full border p-2 rounded-lg mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          className="border px-4 py-2 rounded-md"
          onClick={() => setShowAddCategoryModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-[#161925] hover:bg-[#161925]/85 text-white px-4 py-2 rounded-md"
          onClick={handleAddCategory}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowFormModal(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Edit Article" : "Add New Article"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={newArticle.title}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
              <div>
                <label htmlFor="slug">Slug</label>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={newArticle.slug}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm">{errors.slug}</p>
                )}
              </div>
              <div>
                <label htmlFor="originalSlug">Original Slug</label>
                <input
                  id="originalSlug"
                  type="text"
                  name="originalSlug"
                  value={newArticle.originalSlug}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                {errors.originalSlug && (
                  <p className="text-red-500 text-sm">{errors.originalSlug}</p>
                )}
              </div>
              <div>
                <label htmlFor="categoryId" className="block font-medium mb-1">
                  Category
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newArticle.categoryId}
                    onChange={handleAddChange}
                    className="w-full p-2 border rounded-lg"
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
                {errors.categoryId && (
                  <p className="text-red-500 text-sm">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label htmlFor="showDate">Show Date</label>
                <div className="flex items-center gap-4">
                  <input
                    id="showDate"
                    type="date"
                    name="showDate"
                    value={newArticle.showDate?.split("T")[0] || ""}
                    onChange={handleAddChange}
                    className="w-5/6 p-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewArticle({
                        ...newArticle,
                        showDate: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="px-3 py-[2px] bg-gray-200 rounded-lg hover:bg-gray-500 hover:text-white text-sm"
                  >
                    Set Today
                  </button>
                </div>
                {errors.showDate && (
                  <p className="text-red-500 text-sm">{errors.showDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="excerpt">Excerpt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={newArticle.excerpt}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <ReactQuill
                  value={newArticle.description}
                  onChange={(value) =>
                    setNewArticle({ ...newArticle, description: value })
                  }
                  className="w-full p-2  rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  Image
                </label>
                {isEditing && newArticle.image ? (
                  <div className="mb-3">
                    <div className="relative w-full">
                      <img
                        src={
                          newArticle.image instanceof File
                            ? URL.createObjectURL(newArticle.image)
                            : newArticle.image
                        }
                        alt="Preview"
                        className="w-full h-48 object-none rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewArticle({ ...newArticle, image: null })
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                        title="Remove image"
                      >
                        <RiDeleteBin5Line size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full mb-3">
                    <input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) =>
                        setNewArticle({
                          ...newArticle,
                          image: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full  border rounded-lg"
                    />
                  </div>
                )}

                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition"
                >
                  {isEditing ? "Update Article" : "Add Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
