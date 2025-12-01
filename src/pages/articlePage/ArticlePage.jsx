import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  getArticlePage,
  updateArticlePage,
} from "../../store/slices/articlePageSlice";
import { toast } from "react-toastify";
import { Description } from "@headlessui/react";

const ArticleUIPage = () => {
  const dispatch = useDispatch();
  const { articlePage, loading } = useSelector(
    (state) => state.articlePage || {}
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoriesHeading: "",

    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaImage: "",

    canonicalUrl: "",
    jsonLd: "",

    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",

    publishedDate: "",
    lastUpdatedDate: "",
    showPublishedDate: false,
    showLastUpdatedDate: false,

    robots: {
      noindex: false,
      nofollow: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      notranslate: false,
    },

    customHead: "",
    slug: "",

    redirect: {
      enabled: false,
      from: "",
      to: "",
      type: 301,
    },

    breadcrumbs: [],

    includeInSitemap: true,
    priority: 0.7,
    changefreq: "weekly",

    isScheduled: false,
    scheduledPublishDate: "",

    isDeleted: false,
    isHidden: false,
  });

  useEffect(() => {
    dispatch(getArticlePage());
  }, [dispatch]);

  useEffect(() => {
    if (articlePage) {
      setForm({
        ...form,
        ...articlePage,
        metaKeywords: articlePage.metaKeywords || "",
        robots: articlePage.robots || form.robots,
        redirect: articlePage.redirect || form.redirect,
        breadcrumbs: articlePage.breadcrumbs || [],
      });
    }
  }, [articlePage]);

  const handleBreadcrumbChange = (index, field, value) => {
    const updated = [...form.breadcrumbs];
    updated[index][field] = value;
    setForm({ ...form, breadcrumbs: updated });
  };

  const addBreadcrumb = () => {
    setForm({
      ...form,
      breadcrumbs: [...form.breadcrumbs, { label: "", url: "" }],
    });
  };

  const removeBreadcrumb = (index) => {
    const updated = [...form.breadcrumbs];
    updated.splice(index, 1);
    setForm({ ...form, breadcrumbs: updated });
  };

  const handleSave = async () => {
    const res = await dispatch(updateArticlePage(form));

    res?.payload
      ? toast.success("Article Page Updated Successfully!")
      : toast.error("Failed to update Article Page");
  };

  return (
    <Section title="Article Page" onSave={handleSave} loading={loading}>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Categories Heading"
            value={form.categoriesHeading}
            onChange={(e) =>
              setForm({ ...form, categoriesHeading: e.target.value })
            }
          />

          {/* SEO SECTION */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

            <Input
              label="Meta Title"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />

            <Input
              label="Meta Description"
              textarea
              value={form.metaDescription}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
            />

            <Input
              label="Meta Keywords (comma separated)"
              value={form.metaKeywords}
              onChange={(e) =>
                setForm({ ...form, metaKeywords: e.target.value })
              }
            />

            <ImageUploader
              label="Meta Image"
              value={form.metaImage}
              onChange={(img) => setForm({ ...form, metaImage: img })}
            />
          </div>

          {/* OG TAGS */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Open Graph (OG) Tags</h2>

            <Input
              label="OG Title"
              value={form.ogTitle}
              onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
            />
            <Input
              label="OG Description"
              textarea
              value={form.ogDescription}
              onChange={(e) =>
                setForm({ ...form, ogDescription: e.target.value })
              }
            />

            <ImageUploader
              label="OG Image"
              value={form.ogImage}
              onChange={(img) => setForm({ ...form, ogImage: img })}
            />

            <Input
              label="OG Type"
              value={form.ogType}
              onChange={(e) => setForm({ ...form, ogType: e.target.value })}
            />
          </div>

          {/* ADVANCED SEO */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Advanced SEO</h2>

            <Input
              label="Canonical URL"
              value={form.canonicalUrl}
              onChange={(e) =>
                setForm({ ...form, canonicalUrl: e.target.value })
              }
            />

            <Input
              label="JSON-LD Schema"
              textarea
              value={form.jsonLd}
              onChange={(e) => setForm({ ...form, jsonLd: e.target.value })}
            />

            <Input
              label="Custom Head Tags"
              textarea
              value={form.customHead}
              onChange={(e) => setForm({ ...form, customHead: e.target.value })}
            />
          </div>

          {/* ROBOTS */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Robots Settings</h2>

            {Object.keys(form.robots).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  className="!relative"
                  type="checkbox"
                  checked={form.robots[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      robots: { ...form.robots, [key]: e.target.checked },
                    })
                  }
                />
                {key}
              </label>
            ))}
          </div>

          {/* REDIRECT */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Redirect</h2>

            <label className="flex items-center gap-2">
              <input
               className="!relative"
                type="checkbox"
                checked={form.redirect.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    redirect: { ...form.redirect, enabled: e.target.checked },
                  })
                }
              />
              Enable Redirect
            </label>

            {form.redirect.enabled && (
              <>
                <Input label="Redirect From" value={form.redirect.from}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      redirect: { ...form.redirect, from: e.target.value },
                    })
                  }
                />
                <Input label="Redirect To" value={form.redirect.to}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      redirect: { ...form.redirect, to: e.target.value },
                    })
                  }
                />
                <Input label="Redirect Type (301/302)" value={form.redirect.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      redirect: { ...form.redirect, type: Number(e.target.value) },
                    })
                  }
                />
              </>
            )}
          </div> */}

          {/* BREADCRUMBS */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Breadcrumbs</h2>

            {form.breadcrumbs.map((b, i) => (
              <div key={i} className="p-3 border rounded mb-3">
                <Input label="Label" value={b.label}
                  onChange={(e) => handleBreadcrumbChange(i, "label", e.target.value)}
                />
                <Input label="URL" value={b.url}
                  onChange={(e) => handleBreadcrumbChange(i, "url", e.target.value)}
                />
                <button
                  className="mt-2 text-red-600"
                  onClick={() => removeBreadcrumb(i)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button className="text-blue-600" onClick={addBreadcrumb}>
              + Add Breadcrumb
            </button>
          </div> */}

          {/* SITEMAP SETTINGS */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Sitemap Settings</h2>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.includeInSitemap}
               className="!relative"
                onChange={(e) =>
                  setForm({ ...form, includeInSitemap: e.target.checked })
                }
              />
              Include in Sitemap
            </label>

            <Input
              label="Priority (0.1 - 1.0)"
              type="number"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
            />

            <Input
              label="Change Frequency"
              value={form.changefreq}
              onChange={(e) => setForm({ ...form, changefreq: e.target.value })}
            />
          </div> */}

          {/* PUBLISHING SETTINGS */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Publishing Settings</h2>

            <Input
              type="date"
              label="Published Date"
              value={form.publishedDate?.substring(0, 10)}
              onChange={(e) =>
                setForm({ ...form, publishedDate: e.target.value })
              }
            />

            <Input
              type="date"
              label="Last Updated Date"
              value={form.lastUpdatedDate?.substring(0, 10)}
              onChange={(e) =>
                setForm({ ...form, lastUpdatedDate: e.target.value })
              }
            />

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.showPublishedDate}
               className="!relative"
                onChange={(e) =>
                  setForm({ ...form, showPublishedDate: e.target.checked })
                }
              />
              Show Published Date
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.showLastUpdatedDate}
               className="!relative"
                onChange={(e) =>
                  setForm({ ...form, showLastUpdatedDate: e.target.checked })
                }
              />
              Show Last Updated Date
            </label>
          </div> */}

          {/* SCHEDULED PUBLISHING */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Schedule Publishing</h2>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                 className="!relative"
                checked={form.isScheduled}
                onChange={(e) =>
                  setForm({ ...form, isScheduled: e.target.checked })
                }
              />
              Enable Scheduling
            </label>

            {form.isScheduled && (
              <Input
                type="datetime-local"
                label="Scheduled Publish Date"
                value={form.scheduledPublishDate}
                onChange={(e) =>
                  setForm({ ...form, scheduledPublishDate: e.target.value })
                }
              />
            )}
          </div> */}

          {/* VISIBILITY */}
          {/* <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Page Visibility</h2>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isHidden}
               className="!relative"
                onChange={(e) =>
                  setForm({ ...form, isHidden: e.target.checked })
                }
              />
              Hide Page
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDeleted}
               className="!relative"
                onChange={(e) =>
                  setForm({ ...form, isDeleted: e.target.checked })
                }
              />
              Mark as Deleted
            </label>
          </div> */}
        </div>
      )}
    </Section>
  );
};

export default ArticleUIPage;
