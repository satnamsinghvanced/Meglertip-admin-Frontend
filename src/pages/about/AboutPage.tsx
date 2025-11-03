import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getAboutPage, updateAboutPage } from "../../store/slices/aboutPageSlice";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.about || {});

  const [form, setForm] = useState({
    heading: "",
    subHeading: "",
    image: "",
    heading1: "",
    subHeading1: "",
  });

  useEffect(() => {
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (about) setForm(about);
  }, [about]);

  const handleSave = () => {
    dispatch(updateAboutPage(form));
  };

  return (
    <Section title="About Page" onSave={handleSave} loading={loading}>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>

          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>

          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>

          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>

          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
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
        </div>
      )}
    </Section>
  );
};

export default AboutPage;
