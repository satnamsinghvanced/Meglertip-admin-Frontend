import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

import { fetchQuotes, updateQuote, deleteQuote,createQuote } from "../../store/slices/quoteSlice";

export const Quote = () => {
  const dispatch = useDispatch();
  const { quotes, loading } = useSelector((state) => state.quote);

  const [editingId, setEditingId] = useState(null); // Which quote is being edited
  const [formData, setFormData] = useState({}); // Store formData per quote _id
  const [showDelete, setShowDelete] = useState(null); // Track quote _id for delete
  const[addingField,setAddingField]=useState(false);
  const [newCategory, setNewCategory] = useState({
      heading: "",
      description: "",
      points: "",
      buttonText: "",
      ctaLink:""
    });

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const initialData = {};
      quotes.forEach((q) => {
        initialData[q._id] = {
          heading: q.heading || "",
          description: q.description || "",
          points: q.points || "",
          buttonText: q.buttonText || "",
          ctaLink: q.ctaLink || "",
        };
      });
      setFormData(initialData);
    }
  }, [quotes]);

  const handleChange = (e, id, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    try {
      const response = await dispatch(updateQuote({ id, formData: formData[id] })).unwrap();
      toast.success(response?.message || "Quote updated successfully!");
      setEditingId(null);
      dispatch(fetchQuotes());
    } catch (err) {
      toast.error(err?.message || "Failed to update quote.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteQuote(id)).unwrap();
      toast.success(response?.message || "Quote deleted successfully!");
      setShowDelete(null);
      dispatch(fetchQuotes());
    } catch (err) {
      toast.error(err?.message || "Failed to delete quote.");
    }
  };
const handleAddQuote = async () => {
    if (
      !newCategory.heading ||
      !newCategory.description||
      !newCategory.points ||
      !newCategory.buttonText ||
      !newCategory.ctaLink
      
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await dispatch(createQuote(newCategory));
      setAddingField(false);
        dispatch(fetchQuotes());
      setNewCategory({ heading: quotes.heading, description: quotes.description, points:quotes.points, buttonText: quotes.buttonText, ctaLink:quotes.ctaLink });

    } catch (err) {
      console.error("Error adding quote:", err);
      toast.error(err?.message || "Failed to add category");
      setNewCategory({ heading: "", description: "", points: "", buttonText: "" ,ctaLink :""});
    }
  };
  if (loading || !quotes || quotes.length === 0) {
    return <div className="space-y-6 p-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="flex gap-3">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>

            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>

            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>

            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>

            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Quote Section</h1>
            {/* <button className="flex items-center gap-1 text-sm bg-[#161925] text-white px-2 py-1 rounded hover:bg-[#161925]/85 transition">
                        <AiOutlinePlus size={14}type="button" onClick={()=>setAddingField(true)}/> 
                    </button> */}
      {quotes.map((quote) => {
        const isEditing = editingId === quote._id;
        return (
          <div key={quote._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{quote.heading}</h2>
              <div className="flex gap-3">
                {!isEditing ? (
                  <>
                  {/* <button className="flex items-center gap-1 text-sm bg-[#161925] text-white px-2 py-1 rounded hover:bg-[#161925]/85 transition">
                       <AiOutlinePlus size={14}type="button" onClick={()=>setAddingField(true)}/> Add Quote
                  </button> */}
                    <button onClick={() => setEditingId(quote._id)} className="px-2">
                      <AiTwotoneEdit size={20} className="text-[#161925]" />
                    </button>
                     {/* <button className="flex items-center gap-1 text-sm bg-[#161925] text-white px-2 py-1 rounded hover:bg-[#161925]/85 transition">
                        <AiOutlinePlus size={14} /> Add Quote
                    </button> */}
                    {/* <button
                      onClick={() => setShowDelete(quote._id)}
                      className="text-red-600 px-2"
                    >
                      <RiDeleteBin5Line className="text-xl" />
                    </button> */}
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(quote._id)}
                      className="px-4 py-2 bg-[#161925] text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Heading</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData[quote._id]?.heading || ""}
                onChange={(e) => handleChange(e, quote._id, "heading")}
                className="p-2 border border-slate-300 rounded-lg w-full"
              />

              <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
              <textarea
                disabled={!isEditing}
                value={formData[quote._id]?.description || ""}
                onChange={(e) => handleChange(e, quote._id, "description")}
                className="p-2 border border-slate-300 rounded-lg w-full"
              />

              <label className="block text-sm font-medium mb-1 text-gray-600">Points</label>
              <textarea
                disabled={!isEditing}
                value={formData[quote._id]?.points || ""}
                onChange={(e) => handleChange(e, quote._id, "points")}
                className="p-2 border border-slate-300 rounded-lg w-full"
              />

              <label className="block text-sm font-medium mb-1 text-gray-600">Button Text</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData[quote._id]?.buttonText || ""}
                onChange={(e) => handleChange(e, quote._id, "buttonText")}
                className="w-full border border-slate-300 rounded-lg p-2 "
              />

              <label className="block text-sm font-medium mb-1 mt-2 text-gray-600">CTA Link</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData[quote._id]?.ctaLink || ""}
                onChange={(e) => handleChange(e, quote._id, "ctaLink")}
                className="w-full border border-slate-300 rounded-lg p-2 "
              />
            </div>
      {/* Adding new Quote */}
{/* {addingField && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg w-[350px]">
      <h3 className="text-lg font-semibold mb-4 text-center dark:text-white">
        Add New Quote
      </h3>
    <label className="text-sm text-gray-600 dark:text-gray-300">Heading</label>
      <input
        type="text"
        placeholder="Enter heading"
        value={newCategory.heading}
        onChange={(e) => setNewCategory({ ...newCategory, heading: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
      <textarea
        type="text"
        placeholder="Enter description"
        value={newCategory.description}
        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Points</label>
      <textarea
        placeholder="Enter points"
        value={newCategory.points}
        onChange={(e) => setNewCategory({ ...newCategory, points: e.target.value })}
        className="w-full border p-2 rounded-lg mb-3"
      />

      <label className="text-sm text-gray-600 dark:text-gray-300">Button</label>
      <input
        type="text"
        placeholder="Enter Button text"
        value={newCategory.button}
        onChange={(e) => setNewCategory({ ...newCategory, button: e.target.value })}
        className="w-full border p-2 rounded-lg mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          className="border px-4 py-2 rounded-md"
          onClick={() => setAddingField(false)}
        >
          Cancel
        </button>
        <button
          className="bg-[#161925] hover:bg-[#161925]/85 text-white px-4 py-2 rounded-md"
          onClick={handleAddQuote}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)} */}

            {/* Delete*/}
            {showDelete === quote._id && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg">
                  <p className="mb-6 font-bold text-center">
                    Are you sure you want to delete this quote?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="border px-4 py-2 rounded-md"
                      onClick={() => setShowDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDelete(quote._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
