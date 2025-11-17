import { useState, useEffect, useCallback, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AiTwotoneEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllTermOfService,
  updateTermOfService,
} from "../../store/slices/termOfService";
import { addCustomStyling } from "../../utils/addCustomStyling";
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],  // Block headers
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],   // Block options
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
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
export const TermOfServicePage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.termOfService);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [term, setTerm] = useState(null);

  useEffect(() => {
    dispatch(getAllTermOfService());
  }, [dispatch]);

  useEffect(() => {
    if (items?.length > 0) {
      setTerm(items[0]);
      setContent(items[0].description || "");
    }
  }, [items]);
  const handleSave = useCallback(async () => {
    if (!term?._id) {
      toast.error("No Terms of Service found to update.");
      return;
    }

    try {
      const res = await dispatch(
        updateTermOfService({
          id: term._id,
          data: { title: term.title, description: content },
        })
      ).unwrap();

      toast.success(res?.message || "Terms of Service updated successfully!");
      setIsEditing(false);
      dispatch(getAllTermOfService());
    } catch (err) {
      console.error("Error updating Terms of Service:", err);
      toast.error(
        err?.message || "Failed to update Terms of Service. Please try again."
      );
    }
  }, [dispatch, term, content]);

  const formattedDate = useMemo(() => {
    if (!term?.updatedAt) return null;
    return new Date(term.updatedAt).toLocaleDateString();
  }, [term]);

  if (loading) return <p>Loading...</p>;
  if (!term) return <p>No Terms of Service found.</p>;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{term.title}</h1>
          {formattedDate && (
            <p className="text-sm text-gray-500">
              Last updated: {formattedDate}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
              >
                Save
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-2">
              <AiTwotoneEdit size={20} className="text-[#161925]" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {!isEditing ? (
          <div
            className="prose prose-gray max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: addCustomStyling(content) }}
          />
        ) : (
          <ReactQuill theme="snow" value={content} onChange={setContent}  modules={modules}
                   formats={formats} />
        )}
      </div>
    </div>
  );
};
