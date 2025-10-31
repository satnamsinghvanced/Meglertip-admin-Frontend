/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik, FormikProvider, Field } from "formik";
import * as Yup from "yup";
import {
  getHomepageSection,
  updateHomepageSection,
  clearMessages,
} from "../../store/slices/homepageSlice";
import { AiTwotoneEdit } from "react-icons/ai";

const InputField = ({ label, name, type = "text", disabled, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      id={name}
      disabled={disabled}
      className={`p-4 w-full border border-gray-300 rounded-md mt-1 flex items-center justify-between gap-5 ${
        disabled ? "bg-gray-100" : "bg-white"
      } border-gray-300`}
      {...props}
    />
    <div className="text-red-500 text-sm mt-1">
      <ErrorMessage name={name} />
    </div>
  </div>
);
const ErrorMessage = ({ name }) => (
  <Field name={name}>
    {({ form }) => {
      const error = form.errors[name];
      const touched = form.touched[name];
      return touched && error ? <div>{error}</div> : null;
    }}
  </Field>
);

const validationSchema = Yup.object().shape({
  heroSection: Yup.object().shape({
    title: Yup.string().required("Hero Title is required"),
  }),
});

const EditHomePage = () => {
  const dispatch = useDispatch();
  const { sections, loading, successMessage, error } = useSelector(
    (state) => state.homepage
  );
  const [isHeroEditing, setIsHeroEditing] = useState(false);
  const [isBannerEditing, setIsBannerEditing] = useState(false);
  const [isCardsEditing, setIsCardsEditing] = useState(false);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");

  useEffect(() => {
    dispatch(getHomepageSection("heroSection"));
    dispatch(getHomepageSection("bannerSection1"));
    dispatch(getHomepageSection("bannerSection2"));
    dispatch(getHomepageSection("bannerSectionCards1"));
    dispatch(getHomepageSection("bannerSectionCards2"));
  }, [dispatch]);

  const heroSection = sections?.heroSection || {};
  const bannerSection1 = sections?.bannerSection1 || {};
  const bannerSection2 = sections?.bannerSection2 || {};
  const bannerSectionCards1 = sections?.bannerSectionCards1 || {};
  const bannerSectionCards2 = sections?.bannerSectionCards2 || {};

  const formik = useFormik({
    initialValues: {
      heroSection,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("title", values.heroSection.title);
        formData.append("subtitle", values.heroSection.subtitle);
        formData.append("buttonText", values.heroSection.buttonText);
        formData.append("ctaLink", values.heroSection.ctaLink);
        if (heroFile) formData.append("backgroundImage", heroFile);

        await dispatch(
          updateHomepageSection({
            sectionName: "heroSection",
            formData,
          })
        ).unwrap();

        setIsHeroEditing(false);
        setHeroFile(null);
        setHeroPreview("");
        dispatch(getHomepageSection("heroSection"));
        alert("Hero section updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Error updating hero section");
      }
    },
  });

  useEffect(() => {
    return () => dispatch(clearMessages());
  }, [dispatch]);

  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen space-y-10">
        <h1 className="text-2xl font-bold">Edit Homepage Content</h1>
        {loading && (
          <div className="text-blue-500 font-medium mb-4">Loading...</div>
        )}
        {successMessage && (
          <div className="text-green-600 font-medium mb-4">
            {successMessage}
          </div>
        )}
        {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Hero Section
              </h2>

              {!isHeroEditing ? (
                <button type="button" onClick={() => setIsHeroEditing(true)}>
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setIsHeroEditing(false);
                      setHeroPreview("");
                    }}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            <InputField
              label="Title"
              name="heroSection.title"
              disabled={!isHeroEditing}
            />
            <InputField
              label="Subtitle"
              name="heroSection.subtitle"
              as="textarea"
              disabled={!isHeroEditing}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image
              </label>
              {heroPreview || heroSection.backgroundImage ? (
                <img
                  src={heroPreview || heroSection.backgroundImage}
                  alt="Preview"
                  className="mt-2 mb-3 w-full max-h-64 object-cover rounded-md"
                />
              ) : (
                <div className="text-gray-400 text-sm mb-3 italic">
                  No image selected
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={!isHeroEditing}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setHeroFile(file);
                    const url = URL.createObjectURL(file);
                    setHeroPreview(url);
                  }
                }}
              />
            </div>
            <InputField
              label="Button Text"
              name="heroSection.buttonText"
              disabled={!isHeroEditing}
            />
          </div>
          <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Banner Section 1
              </h2>
              {!isBannerEditing ? (
                <button type="button" onClick={() => setIsBannerEditing(true)}>
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBannerEditing(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                    disabled={loading}
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append("title", bannerSection1.title || "");

                      await dispatch(
                        updateHomepageSection({
                          sectionName: "bannerSection1",
                          formData,
                        })
                      );
                      setIsBannerEditing(false);
                      dispatch(getHomepageSection("bannerSection1"));
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            <InputField
              label="Heading"
              name="bannerSection1.heading"
              disabled={!isBannerEditing}
              value={bannerSection1.heading || ""}
              onChange={(e) => (bannerSection1.heading = e.target.value)}
            />
          </div>
          <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Banner Section Cards 1
              </h2>
              {!isCardsEditing ? (
                <button type="button" onClick={() => setIsCardsEditing(true)}>
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCardsEditing(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                    disabled={loading}
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append(
                        "cards",
                        JSON.stringify(bannerSectionCards1 || [])
                      );

                      await dispatch(
                        updateHomepageSection({
                          sectionName: "bannerSectionCards1",
                          formData,
                        })
                      );
                      setIsCardsEditing(false);
                      dispatch(getHomepageSection("bannerSectionCards1"));
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            {Array.isArray(bannerSectionCards1) &&
            bannerSectionCards1.length > 0 ? (
              bannerSectionCards1.map((card, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2 text-lg">
                    Card {index + 1}
                  </h3>

                  <InputField
                    label="Title"
                    name={`bannerSectionCards1.${index}.title`}
                    disabled={!isCardsEditing}
                    value={card.title || ""}
                    onChange={(e) =>
                      (bannerSectionCards1[index].title = e.target.value)
                    }
                  />

                  <InputField
                    label="Icon"
                    name={`bannerSectionCards1.${index}.icon`}
                    disabled={!isCardsEditing}
                    value={card.icon || ""}
                    onChange={(e) =>
                      (bannerSectionCards1[index].icon = e.target.value)
                    }
                  />

                  <InputField
                    label="Description"
                    name={`bannerSectionCards1.${index}.description`}
                    disabled={!isCardsEditing}
                    value={card.description || ""}
                    onChange={(e) =>
                      (bannerSectionCards1[index].description = e.target.value)
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No cards available.</p>
            )}
          </div>
          <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Banner Section 2
              </h2>
              {!isBannerEditing ? (
                <button type="button" onClick={() => setIsBannerEditing(true)}>
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBannerEditing(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                    disabled={loading}
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append("title", bannerSection1.title || "");

                      await dispatch(
                        updateHomepageSection({
                          sectionName: "bannerSection2",
                          formData,
                        })
                      );
                      setIsBannerEditing(false);
                      dispatch(getHomepageSection("bannerSection2"));
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            <InputField
              label="Heading"
              name="bannerSection2.heading"
              disabled={!isBannerEditing}
              value={bannerSection2.heading || ""}
              onChange={(e) => (bannerSection2.heading = e.target.value)}
            />
          </div>
          <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Banner Section Cards 2
              </h2>
              {!isCardsEditing ? (
                <button type="button" onClick={() => setIsCardsEditing(true)}>
                  <AiTwotoneEdit className="text-[#161925] text-xl" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCardsEditing(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161925] hover:bg-[#161925]/85 text-white rounded-md"
                    disabled={loading}
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append(
                        "cards",
                        JSON.stringify(bannerSectionCards2 || [])
                      );

                      await dispatch(
                        updateHomepageSection({
                          sectionName: "bannerSectionCards2",
                          formData,
                        })
                      );
                      setIsCardsEditing(false);
                      dispatch(getHomepageSection("bannerSectionCards2"));
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {Array.isArray(bannerSectionCards2) &&
            bannerSectionCards2.length > 0 ? (
              bannerSectionCards2.map((card, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2 text-lg">
                    Card {index + 1}
                  </h3>

                  <InputField
                    label="Title"
                    name={`bannerSectionCards2.${index}.title`}
                    disabled={!isCardsEditing}
                    value={card.title || ""}
                    onChange={(e) =>
                      (bannerSectionCards2[index].title = e.target.value)
                    }
                  />

                  <InputField
                    label="Icon"
                    name={`bannerSectionCards2.${index}.icon`}
                    disabled={!isCardsEditing}
                    value={card.icon || ""}
                    onChange={(e) =>
                      (bannerSectionCards2[index].icon = e.target.value)
                    }
                  />
                  <InputField
                    label="Description"
                    name={`bannerSectionCards2.${index}.description`}
                    disabled={!isCardsEditing}
                    value={card.description || ""}
                    onChange={(e) =>
                      (bannerSectionCards1[index].description = e.target.value)
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No cards available.</p>
            )}
          </div>
        </form>
      </div>
    </FormikProvider>
  );
};

export default EditHomePage;
