import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getAboutPage, updateAboutPage } from "../../store/slices/aboutPageSlice";
import { toast } from "react-toastify";

// Helper for converting Date objects/strings to datetime-local format (YYYY-MM-DDThh:mm)
const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    // Get date part (YYYY-MM-DD)
    const datePart = date.toISOString().substring(0, 10);
    // Get time part (hh:mm)
    const timePart = date.toTimeString().substring(0, 5);
    return `${datePart}T${timePart}`;
};

const AboutPage = () => {
  const dispatch = useDispatch();
  // Ensure default state structure if 'about' or 'state.about' is undefined
  const { about, loading } = useSelector((state) => state.about || {});

  const initialFormState = {
    heading: "",
    subHeading: "",
    image: "",

    heading1: "",
    subHeading1: "",

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
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setForm({
        ...initialFormState, // Start with initial state defaults
        ...about,
        // Explicitly merge nested objects to preserve defaults if missing in DB
        robots: about.robots || initialFormState.robots,
        redirect: about.redirect || initialFormState.redirect,
        breadcrumbs: about.breadcrumbs || initialFormState.breadcrumbs,
        // Handle dates coming from the database (likely ISO strings)
        publishedDate: about.publishedDate || "",
        lastUpdatedDate: about.lastUpdatedDate || "",
        scheduledPublishDate: about.scheduledPublishDate || "",
      });
    }
  }, [about]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox/boolean fields
    if (type === 'checkbox') {
        setForm({ ...form, [name]: checked });
    } 
    // Handle nested fields (like in Robots or Redirect)
    else if (name.includes('.')) {
        const [parent, child] = name.split('.');
        const newValue = type === 'number' ? Number(value) : value;

        setForm(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: newValue
            }
        }));
    }
    // Handle top-level number fields (Priority, Redirect Type)
    else if (type === 'number') {
        setForm({ ...form, [name]: Number(value) });
    }
    // Handle all other fields
    else {
        setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    const res = await dispatch(updateAboutPage(form));

    res?.payload
      ? toast.success("About Page Updated Successfully!")
      : toast.error("Failed to update About Page");
  };

  return (
    <Section title="About Page" onSave={handleSave} loading={loading}>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ------------------------------------------
          // PRIMARY CONTENT
          // ------------------------------------------ */}
          <Input 
            label="Heading" 
            name="heading"
            value={form.heading}
            onChange={handleChange} 
          />
          <Input 
            label="Sub Heading" 
            name="subHeading"
            value={form.subHeading}
            onChange={handleChange} 
          />

          <ImageUploader 
            label="Main Image" 
            value={form.image}
            onChange={(img) => setForm({ ...form, image: img })} 
          />

          <Input 
            label="Heading 1" 
            name="heading1"
            value={form.heading1}
            onChange={handleChange} 
          />
          <Input 
            label="Sub Heading 1" 
            name="subHeading1"
            value={form.subHeading1}
            onChange={handleChange} 
          />
          
          {/* ------------------------------------------
          // SEO SETTINGS
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

            <Input 
                label="Meta Title" 
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange} 
            />

            <Input 
                label="Meta Description" 
                name="metaDescription"
                textarea 
                value={form.metaDescription}
                onChange={handleChange} 
            />

            <Input 
                label="Meta Keywords (comma separated)"
                name="metaKeywords"
                value={form.metaKeywords}
                onChange={handleChange} 
            />

            <ImageUploader 
                label="Meta Image" 
                value={form.metaImage}
                onChange={(img) => setForm({ ...form, metaImage: img })} 
            />
          </div>

          {/* ------------------------------------------
          // OPEN GRAPH (OG) TAGS
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Open Graph (OG) Tags</h2>

            <Input 
                label="OG Title" 
                name="ogTitle"
                value={form.ogTitle}
                onChange={handleChange} 
            />
            <Input 
                label="OG Description" 
                name="ogDescription"
                textarea 
                value={form.ogDescription}
                onChange={handleChange} 
            />

            <ImageUploader 
                label="OG Image" 
                value={form.ogImage}
                onChange={(img) => setForm({ ...form, ogImage: img })} 
            />

            <Input 
                label="OG Type" 
                name="ogType"
                value={form.ogType}
                onChange={handleChange} 
            />
          </div>

          {/* ------------------------------------------
          // ADVANCED SEO
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Advanced SEO</h2>

            <Input 
                label="Canonical URL" 
                name="canonicalUrl"
                value={form.canonicalUrl}
                onChange={handleChange} 
            />

            <Input 
                label="JSON-LD Schema" 
                name="jsonLd"
                textarea 
                value={form.jsonLd}
                onChange={handleChange} 
            />

            <Input 
                label="Custom Head Tags" 
                name="customHead"
                textarea 
                value={form.customHead}
                onChange={handleChange} 
            />
          </div>

          {/* ------------------------------------------
          // ROBOTS SETTINGS
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Robots Settings</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(form.robots).map((key) => (
                <label key={key} className="flex items-center gap-2 capitalize">
                  <input
                    className="!relative"
                    type="checkbox"
                    name={`robots.${key}`}
                    checked={form.robots[key]}
                    onChange={handleChange}
                  />
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          {/* ------------------------------------------
          // REDIRECT (UNCOMMENTED)
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Redirect</h2>

            <label className="flex items-center gap-2">
              <input
               className="!relative"
                type="checkbox"
                name="redirect.enabled"
                checked={form.redirect.enabled}
                onChange={handleChange}
              />
              Enable Redirect
            </label>

            {form.redirect.enabled && (
              <>
                <Input 
                    label="Redirect From (Old Path)" 
                    name="redirect.from"
                    value={form.redirect.from}
                    onChange={handleChange}
                />
                <Input 
                    label="Redirect To (New Path)" 
                    name="redirect.to"
                    value={form.redirect.to}
                    onChange={handleChange}
                />
                <Input 
                    label="Redirect Type (301 or 302)" 
                    name="redirect.type"
                    type="number"
                    value={form.redirect.type}
                    onChange={handleChange}
                />
              </>
            )}
          </div>

          {/* ------------------------------------------
          // BREADCRUMBS (UNCOMMENTED)
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Breadcrumbs</h2>

            {form.breadcrumbs.map((b, i) => (
              <div key={i} className="p-3 border rounded mb-3 bg-gray-50">
                <Input 
                    label="Label" 
                    value={b.label}
                    onChange={(e) => handleBreadcrumbChange(i, "label", e.target.value)}
                />
                <Input 
                    label="URL" 
                    value={b.url}
                    onChange={(e) => handleBreadcrumbChange(i, "url", e.target.value)}
                />
                <button
                  className="mt-2 text-red-600 hover:text-red-800 transition-colors"
                  onClick={() => removeBreadcrumb(i)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button 
                className="text-blue-600 hover:text-blue-800 transition-colors" 
                onClick={addBreadcrumb}
            >
              + Add Breadcrumb
            </button>
          </div>

          {/* ------------------------------------------
          // SITEMAP SETTINGS
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Sitemap Settings</h2>

            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="includeInSitemap"
                checked={form.includeInSitemap}
               className="!relative"
                onChange={handleChange}
              />
              Include in Sitemap
            </label>

            <Input
              label="Priority (0.0 - 1.0)"
              type="number"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            />

            <Input
              label="Change Frequency (e.g., weekly, monthly)"
              name="changefreq"
              value={form.changefreq}
              onChange={handleChange}
            />
          </div>

          {/* ------------------------------------------
          // PUBLISHING DATES
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Publishing Dates</h2>

            <Input
              type="date"
              label="Published Date"
              name="publishedDate"
              // Only take the date part (YYYY-MM-DD)
              value={form.publishedDate?.substring(0, 10)} 
              onChange={handleChange}
            />

            <Input
              type="date"
              label="Last Updated Date"
              name="lastUpdatedDate"
              // Only take the date part (YYYY-MM-DD)
              value={form.lastUpdatedDate?.substring(0, 10)}
              onChange={handleChange}
            />

            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="showPublishedDate"
                checked={form.showPublishedDate}
               className="!relative"
                onChange={handleChange}
              />
              Show Published Date
            </label>

            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="showLastUpdatedDate"
                checked={form.showLastUpdatedDate}
               className="!relative"
                onChange={handleChange}
              />
              Show Last Updated Date
            </label>
          </div>

          {/* ------------------------------------------
          // SCHEDULE PUBLISHING
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Schedule Publishing</h2>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isScheduled"
               className="!relative"
                checked={form.isScheduled}
                onChange={handleChange}
              />
              Enable Scheduling
            </label>

            {form.isScheduled && (
              <Input
                type="datetime-local"
                label="Scheduled Publish Date"
                name="scheduledPublishDate"
                value={formatDateTimeLocal(form.scheduledPublishDate)}
                onChange={handleChange}
              />
            )}
          </div>

          {/* ------------------------------------------
          // PAGE VISIBILITY (UNCOMMENTED)
          // ------------------------------------------ */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Page Visibility</h2>

            <Input 
                label="Slug (URL Path)" 
                name="slug"
                value={form.slug}
                onChange={handleChange} 
            />

            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="isHidden"
                checked={form.isHidden}
               className="!relative"
                onChange={handleChange}
              />
              Hide Page (Draft/Unpublished)
            </label>

            <label className="flex items-center gap-2 text-red-600">
              <input 
                type="checkbox" 
                name="isDeleted"
                checked={form.isDeleted}
               className="!relative"
                onChange={handleChange}
              />
              Mark as Deleted (Soft Delete)
            </label>
          </div>
        </div>
      )}
    </Section>
  );
};

export default AboutPage;