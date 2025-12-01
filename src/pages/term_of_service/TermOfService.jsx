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

// QUILL CONFIG
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
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

  // CONTENT
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // SEO FIELDS (Grouped like Privacy Policy)
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    robots: {
      noindex: false,
      nofollow: false,
      noarchive: false,
      nosnippet: false,
      notranslate: false,
    },
    jsonLd: "",
    customHead: "",
    includeInSitemap: true,
    priority: 0.7,
    changefreq: "monthly",
  });

  const [tosId, setTosId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // FETCH TOS
  useEffect(() => {
    dispatch(getAllTermOfService());
  }, [dispatch]);

  // SET DATA IN FORM
  useEffect(() => {
    if (items && items.length > 0) {
      const data = items[0];

      setTosId(data._id);
      setTitle(data.title || "");
      setContent(data.description || "");
      setLastUpdated(data.updatedAt || "");

      setSeo({
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: data.metaKeywords || "",
        canonicalUrl: data.canonicalUrl || "",
        ogTitle: data.ogTitle || "",
        ogDescription: data.ogDescription || "",
        ogImage: data.ogImage || "",
        robots: data.robots || seo.robots,
        jsonLd: data.jsonLd || "",
        customHead: data.customHead || "",
        includeInSitemap: data.includeInSitemap ?? true,
        priority: data.priority ?? 0.7,
        changefreq: data.changefreq || "monthly",
      });
    }
  }, [items]);

  // SAVE HANDLER
  const handleSave = useCallback(async () => {
    if (!tosId) {
      toast.error("No Terms of Service found to update.");
      return;
    }

    try {
      const res = await dispatch(
        updateTermOfService({
          id: tosId,
          data: {
            title,
            description: content,
            ...seo,
          },
        })
      ).unwrap();

      toast.success(res?.message || "Terms of Service updated!");
      setIsEditing(false);
      dispatch(getAllTermOfService());
    } catch (err) {
      console.error("Error updating Terms of Service:", err);
      toast.error("Failed to update Terms of Service.");
    }
  }, [dispatch, tosId, title, content, seo]);

  if (loading) return <p>Loading...</p>;
  if (!tosId) return <p>No Terms of Service found.</p>;

  return (
    <div className="h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* EDIT BUTTONS */}
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <AiTwotoneEdit size={22} className="text-[#161925]" />
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
              className="px-4 py-2 bg-[#161925] text-white rounded-md"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* CONTENT + SEO */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-10">
        {/* VIEW MODE */}
        {!isEditing ? (
          <>
            {/* CONTENT */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: addCustomStyling(content) }}
            />

            {/* SEO PREVIEW (same as Privacy Policy) */}
            <div className="mt-10 space-y-2">
              <h2 className="text-lg font-semibold">SEO Details</h2>

              <p><strong>Meta Title:</strong> {seo.metaTitle}</p>
              <p><strong>Meta Description:</strong> {seo.metaDescription}</p>
              <p><strong>Meta Keywords:</strong> {seo.metaKeywords}</p>
              <p><strong>Canonical:</strong> {seo.canonicalUrl}</p>
              <p><strong>OG Title:</strong> {seo.ogTitle}</p>
              <p><strong>OG Description:</strong> {seo.ogDescription}</p>

              {seo.ogImage && (
                <img src={seo.ogImage} className="h-32 mt-2 rounded" alt="" />
              )}

              <p className="mt-3"><strong>Robots:</strong></p>
              {Object.entries(seo.robots).map(([k, v]) => (
                <p key={k}>{k}: {v ? "true" : "false"}</p>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* TITLE */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Page Title"
            />

            {/* QUILL EDITOR */}
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />

            {/* SEO FORM (same layout as Privacy Policy) */}
            <div className="mt-10 space-y-3">
              <h2 className="text-lg font-semibold">SEO Settings</h2>

              <input
                placeholder="Meta Title"
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Meta Description"
                value={seo.metaDescription}
                onChange={(e) =>
                  setSeo({ ...seo, metaDescription: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Meta Keywords"
                value={seo.metaKeywords}
                onChange={(e) =>
                  setSeo({ ...seo, metaKeywords: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Canonical URL"
                value={seo.canonicalUrl}
                onChange={(e) =>
                  setSeo({ ...seo, canonicalUrl: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <h3 className="font-semibold">Open Graph (OG)</h3>

              <input
                placeholder="OG Title"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="OG Description"
                value={seo.ogDescription}
                onChange={(e) =>
                  setSeo({ ...seo, ogDescription: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="OG Image URL"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full border p-2 rounded"
              />

              {/* ROBOTS CHECKBOXES */}
              <h3 className="font-semibold">Robots</h3>

              {Object.keys(seo.robots).map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                  
                    type="checkbox"
                      className="!relative"
                    checked={seo.robots[key]}
                    onChange={(e) =>
                      setSeo({
                        ...seo,
                        robots: { ...seo.robots, [key]: e.target.checked },
                      })
                    }
                  />
                  {key}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
