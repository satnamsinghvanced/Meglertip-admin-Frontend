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

  const handleCreateOrEditFAQ = () => {
    if (isEditMode) {
      dispatch(updateFAQ({ id: selectedId, formData }));
    } else {
      dispatch(createFAQ(formData));
    }
    resetFaqForm();
  };

  const handleCreateOrEditCategory = () => {
    if (isEditCategoryMode) {
      dispatch(updateCategory({ id: selectedId, formData: formDataForCategory }));
    } else {
      dispatch(createCategory(formDataForCategory));
    }
    resetCategoryForm();
  };

  const handleDeleteFAQ = () => {
    dispatch(deleteFAQ(selectedId));
    setShowDeleteModal(false);
  };

  const handleDeleteCategory = () => {
    dispatch(deleteCategory(selectedId));
    setShowDeleteCategoryModal(false);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Frequently Asked Questions</h2>
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

      {/* FAQ List */}
      {loading ? (
        <Skeleton />
      ) : faqs.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No FAQs found.</div>
      ) : (
        faqs.map((cat) => (
          <div key={cat._id} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
            <div className="flex gap-3 items-center">
              <h3 className="text-xl font-bold dark:text-white">{cat.categoryName}</h3>
              <button
                className="text-white px-2 rounded-sm"
                onClick={() => {
                  setSelectedId(cat._id);
                  setIsEditCategoryMode(true);
                  setFormDataForCategory({ categoryName: cat.categoryName });
                  setShowCategoryModal(true);
                }}
              >
                <AiTwotoneEdit className="text-[#161925] text-xl" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {cat.faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="p-4 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-between gap-5"
                >
                  <div>
                    <h6 className="font-semibold dark:text-gray-200">{faq.question}</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
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
    </div>
  );
};

export default Faq;
