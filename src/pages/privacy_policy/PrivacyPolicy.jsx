import { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AiTwotoneEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllPrivacyPolicies,
  updatePrivacyPolicy,
} from "../../store/slices/privacyPolicySlice";
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
export const PrivacyPolicyPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state?.privacyPolicy);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [policyId, setPolicyId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(getAllPrivacyPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (items && items.length > 0) {
      const policy = items[0];
      setTitle(policy.title);
      setContent(policy.description);
      setPolicyId(policy._id);
      setLastUpdated(policy.updatedAt);
    }
  }, [items]);

  const handleSave = useCallback(async () => {
    if (!policyId) {
      toast.error("No Privacy Policy found to update.");
      return;
    }

    try {
      const res = await dispatch(
        updatePrivacyPolicy({
          id: policyId,
          data: { title, description: content },
        })
      ).unwrap();

      toast.success(res?.message || "Privacy Policy updated successfully!");
      setIsEditing(false);
      dispatch(getAllPrivacyPolicies());
    } catch (err) {
      console.error("Error updating Privacy Policy:", err);
      toast.error(
        err?.message || "Failed to update Privacy Policy. Please try again."
      );
    }
  }, [dispatch, policyId, title, content]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-2">
            <AiTwotoneEdit size={20} className="text-[#161925]" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
            >
              Save
            </button>
          </div>
        )}
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
