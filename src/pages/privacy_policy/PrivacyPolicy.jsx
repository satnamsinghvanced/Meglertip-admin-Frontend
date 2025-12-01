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

export const PrivacyPolicyPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.privacyPolicy);

  const [isEditing, setIsEditing] = useState(false);

  // CONTENT FIELDS
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // SEO FIELDS
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

  const [policyId, setPolicyId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // FETCH POLICY
  useEffect(() => {
    dispatch(getAllPrivacyPolicies());
  }, [dispatch]);

  // SET FORM DATA ONCE FETCHED
  useEffect(() => {
    if (items && items.length > 0) {
      const policy = items[0];

      setPolicyId(policy._id);
      setTitle(policy.title || "");
      setContent(policy.description || "");
      setLastUpdated(policy.updatedAt || "");

      // Load SEO
      setSeo({
        metaTitle: policy.metaTitle || "",
        metaDescription: policy.metaDescription || "",
        metaKeywords: policy.metaKeywords || "",
        canonicalUrl: policy.canonicalUrl || "",
        ogTitle: policy.ogTitle || "",
        ogDescription: policy.ogDescription || "",
        ogImage: policy.ogImage || "",
        robots: policy.robots || seo.robots,
        jsonLd: policy.jsonLd || "",
        customHead: policy.customHead || "",
        includeInSitemap: policy.includeInSitemap ?? true,
        priority: policy.priority ?? 0.7,
        changefreq: policy.changefreq || "monthly",
      });
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
          data: {
            title,
            description: content,
            ...seo, // include SEO fields
          },
        })
      ).unwrap();

      toast.success(res?.message || "Privacy Policy updated successfully!");
      setIsEditing(false);
      dispatch(getAllPrivacyPolicies());
    } catch (err) {
      console.error("Error updating Privacy Policy:", err);
      toast.error("Failed to update Privacy Policy.");
    }
  }, [dispatch, policyId, title, content, seo]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-full">
      {/* HEADER */}
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
          <button onClick={() => setIsEditing(true)}>
            <AiTwotoneEdit size={22} />
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
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: addCustomStyling(content) }}
            />

            {/* SEO PREVIEW */}
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

              {/* <p className="mt-3"><strong>JSON-LD:</strong></p> */}
              {/* <pre className="bg-gray-100 p-2 rounded text-xs">
                {seo.jsonLd}
              </pre>

              <p className="mt-3"><strong>Custom Head:</strong></p>
              <pre className="bg-gray-100 p-2 rounded text-xs">
                {seo.customHead}
              </pre>

              <p><strong>Include in Sitemap:</strong> {seo.includeInSitemap ? "Yes" : "No"}</p>
              <p><strong>Priority:</strong> {seo.priority}</p>
              <p><strong>Changefreq:</strong> {seo.changefreq}</p> */}
            </div>
          </>
        ) : (
          <>
            {/* TITLE INPUT */}
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

            {/* SEO FORM */}
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
                placeholder="Meta Keywords (comma separated)"
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

              {/* <textarea
                placeholder="JSON-LD"
                value={seo.jsonLd}
                onChange={(e) => setSeo({ ...seo, jsonLd: e.target.value })}
                className="w-full border p-2 rounded"
              /> */}

              {/* <textarea
                placeholder="Custom Head Tags"
                value={seo.customHead}
                onChange={(e) => setSeo({ ...seo, customHead: e.target.value })}
                className="w-full border p-2 rounded"
              /> */}

              {/* <label className="flex items-center gap-2 mt-2">
                <input

                  type="checkbox"
                  checked={seo.includeInSitemap}
                  onChange={(e) =>
                    setSeo({ ...seo, includeInSitemap: e.target.checked })
                  }
                />
                Include In Sitemap
              </label>

              <input
                type="number"
                value={seo.priority}
                onChange={(e) =>
                  setSeo({ ...seo, priority: Number(e.target.value) })
                }
                className="w-full border p-2 rounded"
                step="0.1"
                min="0"
                max="1"
              />

              <input
                placeholder="changefreq"
                value={seo.changefreq}
                onChange={(e) =>
                  setSeo({ ...seo, changefreq: e.target.value })
                }
                className="w-full border p-2 rounded"
              /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
