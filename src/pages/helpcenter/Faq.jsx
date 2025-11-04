import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../../store/slices/faq";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../store/slices/category";
import { toast } from "react-toastify";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";

const Faq = () => {
  const dispatch = useDispatch();
  const { faqs, loading } = useSelector((state) => state.faq);
  const { categories } = useSelector((state) => state.category);

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditCategoryMode, setIsEditCategoryMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });

  const [formDataForCategory, setFormDataForCategory] = useState({
    categoryName: "",
  });

  useEffect(() => {
    dispatch(getFAQs());
    dispatch(getCategories());
  }, [dispatch]);

const handleCreateOrEditFAQ = async () => {
  try {
    if (isEditMode) {
      await dispatch(updateFAQ({ id: selectedId, formData })).unwrap();
      // toast.success("FAQ updated successfully!");
    } else {
      await dispatch(createFAQ(formData)).unwrap();
      // toast.success("FAQ created successfully!");
    }

    
    await dispatch(getFAQs()).unwrap();
    await dispatch(getCategories()).unwrap();

    resetFaqForm();
  } catch (error) {
    toast.error("Something went wrong while saving FAQ!");
    console.error(error);
  }
};

const handleCreateOrEditCategory = async () => {
  try {
    if (isEditCategoryMode) {
      await dispatch(updateCategory({ id: selectedId, formData: formDataForCategory })).unwrap();
      // toast.success("Category updated successfully!");
    } else {
      await dispatch(createCategory(formDataForCategory)).unwrap();
      // toast.success("Category created successfully!");
    }

    // ✅ Wait for categories to refresh before closing modal
    await dispatch(getCategories()).unwrap();
    await dispatch(getFAQs()).unwrap();

    resetCategoryForm();
  } catch (error) {
    toast.error("Something went wrong while saving category!");
    console.error(error);
  }
};

  const handleDeleteFAQ = () => {
    dispatch(deleteFAQ(selectedId));
    setShowDeleteModal(false);
      dispatch(getFAQs());
  };

  const handleDeleteCategory = () => {
    dispatch(deleteCategory(selectedId));
    setShowDeleteCategoryModal(false);
      dispatch(getCategories()); // 👈 refresh categories
    dispatch(getFAQs()); 
  };

  const resetFaqForm = () => {
    setShowFaqModal(false);
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({ categoryId: "", question: "", answer: "" });
  };

  const resetCategoryForm = () => {
    setShowCategoryModal(false);
    setIsEditCategoryMode(false);
    setSelectedId(null);
    setFormDataForCategory({ categoryName: "" });
  };

  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
   <div className="w-full space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="flex items-center gap-3 ml-auto">
           <button
            className="bg-[#161925] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShowCategoryModal(true);
              setIsEditCategoryMode(false);
            }}
          >
            + Add FAQ Category
          </button>
          <button
            className="bg-[#161925] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShowFaqModal(true);
              setIsEditMode(false);
            }}
          >
            + Add FAQ
          </button>
         
        </div>
      </div>

     {loading ? (
        <Skeleton />
      ) : faqs.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No FAQs found.</div>
      ) : (
        faqs.map((cat) => (
          <div
            key={cat._id}
            className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex gap-3 items-center">
              <h3 className="text-xl font-bold dark:text-white">
                {cat.categoryName}
              </h3>
              <div className="gap-3 flex items-center">
                <button
                  className="text-white px-2 rounded-sm"
                  onClick={() => {
                    setSelectedId(cat._id);
                    setIsEditCategoryMode(true);
                    setFormDataForCategory({
                      categoryName: cat.categoryName,
                    });
                    setShowCategoryModal(true);
                  }}
                >
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {cat.faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="p-4 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-between gap-5"
                >
                  <div>
                    <h6 className="font-semibold dark:text-gray-200">
                      {faq.question}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    <button
                      className="text-white px-2 rounded-sm"
                      onClick={() => {
                        setSelectedId(faq._id);
                        setIsEditMode(true);
                        setFormData({
                          question: faq.question,
                          answer: faq.answer,
                          categoryId: cat._id,
                        });
                        setShowFaqModal(true);
                      }}
                    >
                      <AiTwotoneEdit className="text-[#161925] text-xl" />
                    </button>

                    <button
                      className="text-red-600 px-2 rounded-sm"
                      onClick={() => {
                        setSelectedId(faq._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <RiDeleteBin5Line className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showFaqModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-blue-950 p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              {isEditMode ? "Edit FAQ" : "Add New FAQ"}
            </h3>
            <p className="font-semibold">Select Category</p>
            <select
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <label htmlFor="question" className="font-semibold">
              Question
            </label>
            <input
              type="text"
              placeholder="Question"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 dark:bg-blue-900 dark:text-white"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
            <label htmlFor="answer" className="font-semibold">
              Answer
            </label>
            <textarea
              placeholder="Answer"
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 dark:bg-blue-900 dark:text-white"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={resetFaqForm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                onClick={handleCreateOrEditFAQ}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-blue-950 p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              {isEditCategoryMode
                ? "Edit FAQ Category"
                : "Add New FAQ Category"}
            </h3>

            <input
              type="text"
              placeholder="Category Name"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 dark:bg-blue-900 dark:text-white"
              value={formDataForCategory.categoryName}
              onChange={(e) =>
                setFormDataForCategory({
                  ...formDataForCategory,
                  categoryName: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={resetCategoryForm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                onClick={handleCreateOrEditCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 dark:bg-blue-950 rounded-lg w-[350px] shadow-lg">
            <p className="mb-6 font-bold text-center dark:text-white">
              Are you sure you want to delete this FAQ?
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
                onClick={handleDeleteFAQ}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 dark:bg-blue-950 rounded-lg w-[350px] shadow-lg">
            <p className="mb-6 text-center dark:text-white">
              Delete this category? Related FAQs will also be removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded-md"
                onClick={() => setShowDeleteCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faq;
