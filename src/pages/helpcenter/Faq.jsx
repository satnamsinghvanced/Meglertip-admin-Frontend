import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";


const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const getFAQs = async () => {
    try {
      const res = await axios.get("http://localhost:9090/api/faq");
      setFaqs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:9090/api/category");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrEditFAQ = async () => {
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:9090/api/faq/update?id=${selectedId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:9090/api/faq/create", formData);
      }
      resetFaqForm();
      getFAQs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrEditCategory = async () => {
    try {
      if (isEditCategoryMode) {
        await axios.put(
          `http://localhost:9090/api/category/update?id=${selectedId}`,
          formDataForCategory
        );
      } else {
        await axios.post(
          "http://localhost:9090/api/category/create",
          formDataForCategory
        );
      }
      resetCategoryForm();
      getCategories();
      getFAQs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFAQ = async () => {
    try {
      await axios.delete(`http://localhost:9090/api/faq/delete?id=${selectedId}`);
      setShowDeleteModal(false);
      getFAQs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `http://localhost:9090/api/category/delete?id=${selectedId}`
      );
      setShowDeleteCategoryModal(false);
      getFAQs();
      getCategories();
    } catch (err) {
      console.error(err);
    }
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

  useEffect(() => {
    getFAQs();
    getCategories();
  }, []);

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
              setShowFaqModal(true);
              setIsEditMode(false);
            }}
          >
            + Add FAQ
          </button>
          <button
            className="bg-[#161925] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShowCategoryModal(true);
              setIsEditCategoryMode(false);
            }}
          >
            + Add FAQ Category
          </button>
        </div>
      </div>

      {faqs.map((cat) => (
        <div
          key={cat._id}
          className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
        >
          <div className="flex gap-3 items-center">
            <h3 className="text-xl font-bold dark:text-white">
              {cat.categoryName}
            </h3>
            <div className="gap-3  flex items-center">
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
                <AiTwotoneEdit className="text-[#161925] text-xl"/>
              </button>
              {/* <button
                className="text-red-600 bg-neutral-300 px-2 rounded-sm"
                onClick={() => {
                  setSelectedId(cat._id);
                  setShowDeleteCategoryModal(true);
                }}
              >
                Delete
              </button> */}
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

                <div className=" flex items-center gap-1 mt-3">
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
                    <AiTwotoneEdit className="text-[#161925] text-xl"/>
                  </button>

                  <button
                    className="text-red-600 px-2 rounded-sm"
                    onClick={() => {
                      setSelectedId(faq._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <RiDeleteBin5Line className="text-xl"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showFaqModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-blue-950 p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              {isEditMode ? "Edit FAQ" : "Add New FAQ"}
            </h3>
            <p className= "font-semibold">Select Category</p>
            <select
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {/* <option value="">Select Category</option> */}
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
              <label htmlFor="question" className="font-semibold">Question</label>
            <input
              type="text"
              placeholder="Question"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 dark:bg-blue-900 dark:text-white"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
      <label htmlFor="answer" className="font-semibold">Answer</label>
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
