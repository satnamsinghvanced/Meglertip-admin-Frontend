import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getAboutPage, updateAboutPage } from "../../store/slices/aboutPageSlice";
import { toast } from "react-toastify";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.about || {});

  const [form, setForm] = useState({
    heading: "",
    subHeading: "",
    image: "",
    heading1: "",
    subHeading1: "",

    // ⭐ SEO Fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaImage: "",
  });

  useEffect(() => {
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (about) setForm(about);
  }, [about]);

  const handleSave = async () => {
    const res = await dispatch(updateAboutPage(form));

    // if (res?.payload?.success) {
    //   toast.success("About Page Updated Successfully!");
    // } else {
    //   toast.error("Failed to update About Page");
    // }
  };

  return (
    <Section title="About Page" onSave={handleSave} loading={loading}>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* -------------------- MAIN CONTENT -------------------- */}
          <Input
            label="Heading"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
          <Input
            label="Sub Heading"
            value={form.subHeading}
            onChange={(e) => setForm({ ...form, subHeading: e.target.value })}
          />
          <ImageUploader
            label="Image"
            value={form.image}
            onChange={(imageUrl) => setForm({ ...form, image: imageUrl })}
          />

          <Input
            label="Heading 1"
            value={form.heading1}
            onChange={(e) => setForm({ ...form, heading1: e.target.value })}
          />
          <Input
            label="Sub Heading 1"
            value={form.subHeading1}
            onChange={(e) => setForm({ ...form, subHeading1: e.target.value })}
          />

          {/* -------------------- SEO SECTION -------------------- */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

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
              label="Meta Image (OG Image)"
              value={form.metaImage}
              onChange={(imageUrl) =>
                setForm({ ...form, metaImage: imageUrl })
              }
            />
          </div>
        </div>
      )}
    </Section>
  );
};

export default AboutPage;
