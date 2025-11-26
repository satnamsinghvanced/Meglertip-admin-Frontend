// src/pages/faqs/Faqs.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFAQs, deleteFAQ } from "../../store/slices/faq";
import { getCategories } from "../../store/slices/category";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import ConfirmModal from "../../UI/ConfirmDeleteModal";

const Faqs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { faqs = [], loading } = useSelector((s) => s.faq);
  const { categories = [] } = useSelector((s) => s.category);
 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getFAQs());
    dispatch(getCategories());
  }, [dispatch]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteFAQ(deleteId)).unwrap();
      // toast.success("FAQ deleted");
      dispatch(getFAQs());
    } catch (err) {
      // toast.error("Failed to delete FAQ");
      console.error(err);
    }
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };
  const findCategoryName = (catId) => {
    const cat = categories.find((c) => c._id === catId);
    return cat?.categoryName || "";
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="flex gap-3">
          <button
            className="btn bg-slate-900 text-white px-4 py-2 rounded-md"
            onClick={() => navigate("/faqs/categories")}
          >
            Manage Categories
          </button>
          <button
            className="btn bg-slate-900 text-white px-4 py-2 rounded-md"
            onClick={() => navigate("/faqs/add")}
          >
            + Add FAQ
          </button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="text-gray-500 py-10">No FAQs found.</div>
      ) : (
        faqs.map((cat) => (
          <div
            key={cat._id}
            className=" border border-slate-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{cat.categoryName}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/faqs/categories/edit/${cat._id}`)}
                  className="text-sm"
                >
                  <AiTwotoneEdit className="text-xl" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {cat.faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="p-4 border border-slate-200 rounded-md bg-slate-50 flex justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{faq.question}</h4>
                    <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Category: {findCategoryName(faq.categoryId)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/faqs/edit/${faq._id}`)}
                        title="Edit"
                      >
                        <AiTwotoneEdit className="text-xl text-slate-700" />
                      </button>
                       <button
                        onClick={() => openDeleteModal(faq._id)}
                        title="Delete"
                      >
                        <RiDeleteBin5Line className="text-xl text-red-600" />
                      </button>
                    </div>
                    <small className="text-xs text-gray-400">
                      Updated: {new Date(faq.updatedAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
       <ConfirmModal
        isOpen={isModalOpen}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Faqs;
