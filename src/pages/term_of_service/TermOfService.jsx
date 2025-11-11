import { useState, useEffect, useCallback, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { AiTwotoneEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTermOfService,
  updateTermOfService,
} from "../../store/slices/termOfService";
import { addCustomStyling } from "../../utils/addCustomStyling";

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

  const handleSave = useCallback(() => {
    if (!term?._id) return;
    dispatch(
      updateTermOfService({
        id: term._id,
        data: { title: term.title, description: content },
      })
    );
    setIsEditing(false);
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
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        )}
      </div>
    </div>
  );
};
