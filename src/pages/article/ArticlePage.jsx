import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import {
  getArticles,
  getArticleById,
  createArticle,
  clearSelectedArticle,
} from "../../store/slices/articleSlice";
import { getCategories } from "../../store/slices/articleCategoriesSlice";

const ArticlePage = () => {
  const dispatch = useDispatch();
  const { articles, selectedArticle, loading, error } = useSelector(
    (state) => state.articles
  );
  const { categories } = useSelector((state) => state.categories);
  const user = useSelector((state) => state.user.auth_user);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    createdBy: user?._id || "",
    categoryId: "",
    showDate: "",
    language: "en",
    originalSlug: "",
    image: null,
  });

  useEffect(() => {
    dispatch(getArticles());
    dispatch(getCategories());
  }, [dispatch]);

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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      Object.keys(newArticle).forEach((key) => {
        formData.append(key, newArticle[key]);
      });
      dispatch(createArticle(formData)).then(() => {
        setShowAddModal(false);
      });
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Articles</h1>
        <button
          className="px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Article
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
            {articles.map((article, index) => (
              <tr key={article._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-semibold">{article.title}</td>
                <td className="px-6 py-4">
                  {article.categoryId?.title || "N/A"}
                </td>
                <td className="px-6 py-4">{article.createdBy?.username} </td>
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
                    onClick={() => alert(`Edit Article: ${article._id}`)}
                  >
                    <AiTwotoneEdit
                      size={20}
                      className="text-[#161925] text-xl"
                    />
                  </button>
                  <button
                    className="text-red-600 px-2"
                    onClick={() => alert("Delete API call here")}
                  >
                    <RiDeleteBin5Line className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <p>
                <strong>Category:</strong> {selectedArticle.categoryId?.title}
              </p>
              <p>
                <strong>Author:</strong> {selectedArticle.createdBy?.username}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedArticle.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong> {selectedArticle.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
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
                {errors?.title && (
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
                <label htmlFor="categoryId">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={newArticle.categoryId}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label htmlFor="showDate">Show Date</label>
                <input
                  id="showDate"
                  type="date"
                  name="showDate"
                  value={newArticle.showDate}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
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
                <textarea
                  id="description"
                  name="description"
                  value={newArticle.description}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="image">Image</label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition"
                >
                  Add Article
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
