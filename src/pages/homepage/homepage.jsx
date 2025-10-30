import React, { useEffect, useState } from "react";
import { useFormik, FormikProvider, Field, FieldArray } from "formik";
import * as Yup from "yup";

// Assume these are your reusable UI components
// You'll need Textarea, NumberInput, and FileUpload components
const InputField = ({ label, name, type = "text", ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <Field name={name} type={type} id={name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" {...props} />
    <div className="text-red-500 text-sm mt-1">
      <ErrorMessage name={name} />
    </div>
  </div>
);

// Formik's internal component for displaying errors
const ErrorMessage = ({ name }) => (
  <Field name={name}>
    {({ form }) => {
      const error = form.errors[name];
      const touched = form.touched[name];
      return touched && error ? <div>{error}</div> : null;
    }}
  </Field>
);

// ----------------------------------------------------------------------------------
// MOCK DATA and SCHEMAS for the Admin Panel
// ----------------------------------------------------------------------------------

// 1. Initial Empty Values (for a new homepage configuration)
const INITIAL_VALUES = {
  heroSection: { title: "", subtitle: "", backgroundImage: "", buttonText: "", ctaLink: "" },
  howItWorks: [], // Start with an empty array
  agentsSection: { title: "", agents: [] }, // Nested array
  testimonials: [], // Start with an empty array
  blogSection: { title: "", blogs: [] }, // Nested array
  aboutSection: { heading: "", description: "", image: "" },
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

// 2. YUP Validation Schemas
const validationSchema = Yup.object().shape({
  heroSection: Yup.object().shape({
    title: Yup.string().required("Hero Title is required"),
    backgroundImage: Yup.string().url("Must be a valid URL").required("Background Image is required"),
  }),
  // Validation for nested arrays can be complex; this provides basic structure
  howItWorks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      price: Yup.number().required("Price is required").min(0, "Price must be positive"),
    })
  ),
  agentsSection: Yup.object().shape({
    title: Yup.string().required("Agents Section Title is required"),
    agents: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Agent name is required"),
            designation: Yup.string().required("Designation is required"),
        })
    )
  }),
  seo: Yup.object().shape({
    metaTitle: Yup.string().max(60, "Max 60 characters").required("Meta Title is required"),
  }),
});


// ----------------------------------------------------------------------------------
// ADMIN PANEL COMPONENT
// ----------------------------------------------------------------------------------

const EditHomePage = () => {
  const [initialData, setInitialData] = useState(INITIAL_VALUES);
  const [loading, setLoading] = useState(true);

  // 💡 SIMULATE FETCHING EXISTING HOMEPAGE DATA
  useEffect(() => {
    // In a real application, you'd fetch the existing homepage configuration here
    // const res = await fetch('/api/admin/homepage');
    // setInitialData(await res.json());

    // Using a mock to demonstrate functionality:
    const MOCK_EXISTING_DATA = { 
        ...INITIAL_VALUES, 
        heroSection: { title: "Current Hero Title", subtitle: "Current Subtitle", backgroundImage: "https://via.placeholder.com/1500x500", buttonText: "Click Me", ctaLink: "/link" },
        howItWorks: [{ _id: "p1", title: "Existing Property", image: "https://via.placeholder.com/300", price: 100000, location: "Test Loc" }]
    };
    
    setTimeout(() => {
      setInitialData(MOCK_EXISTING_DATA);
      setLoading(false);
    }, 500);
  }, []);

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    enableReinitialize: true, // Crucial to load fetched data into the form
    onSubmit: (values) => {
      console.log("Submitting Homepage Data:", values);
      // 💡 Replace with your API call to update the homepage data:
      // dispatch(updateHomePage(values)); 
      alert("Homepage data submitted! Check console for values.");
    },
  });

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading Homepage Configuration...</div>;
  }

  return (
    <FormikProvider value={formik}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Edit Homepage Content</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-8">

          {/* ---------------------------------------------------- */}
          {/* 1. HERO SECTION */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Hero Section</h2>
            <InputField label="Title" name="heroSection.title" />
            <InputField label="Subtitle" name="heroSection.subtitle" as="textarea" />
            <InputField label="Background Image URL" name="heroSection.backgroundImage" />
            <InputField label="Button Text" name="heroSection.buttonText" />
            <InputField label="CTA Link" name="heroSection.ctaLink" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* 2. HOW IT WORKS / FEATURED PROPERTIES (Dynamic Array) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Featured Properties (How It Works)</h2>
            <FieldArray name="howItWorks">
              {({ push, remove }) => (
                <div>
                  {formik.values.howItWorks.map((item, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 relative">
                      <h3 className="font-medium mb-3">Property #{index + 1}</h3>
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <InputField label="Title" name={`howItWorks.${index}.title`} />
                      <InputField label="Image URL" name={`howItWorks.${index}.image`} />
                      <InputField label="Price" name={`howItWorks.${index}.price`} type="number" />
                      <InputField label="Location" name={`howItWorks.${index}.location`} />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => push({ title: "", image: "", price: 0, location: "" })}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    + Add New Property
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* ---------------------------------------------------- */}
          {/* 3. AGENTS SECTION (Dynamic Nested Array) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Agents Section</h2>
            <InputField label="Section Title" name="agentsSection.title" />

            <FieldArray name="agentsSection.agents">
              {({ push, remove }) => (
                <div className="mt-4">
                  {formik.values.agentsSection.agents.map((agent, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 relative">
                      <h3 className="font-medium mb-3">Agent #{index + 1}</h3>
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <InputField label="Name" name={`agentsSection.agents.${index}.name`} />
                      <InputField label="Image URL" name={`agentsSection.agents.${index}.image`} />
                      <InputField label="Designation" name={`agentsSection.agents.${index}.designation`} />
                      <InputField label="Contact Link" name={`agentsSection.agents.${index}.contactLink`} />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => push({ name: "", image: "", designation: "", contactLink: "" })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + Add New Agent
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* ---------------------------------------------------- */}
          {/* 4. TESTIMONIALS (Dynamic Array) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Testimonials</h2>
            <FieldArray name="testimonials">
              {({ push, remove }) => (
                <div>
                  {formik.values.testimonials.map((test, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 relative">
                      <h3 className="font-medium mb-3">Testimonial #{index + 1}</h3>
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <InputField label="Name" name={`testimonials.${index}.name`} />
                      <InputField label="Review Text" name={`testimonials.${index}.review`} as="textarea" />
                      <InputField label="Rating (1-5)" name={`testimonials.${index}.rating`} type="number" min="1" max="5" />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => push({ name: "", image: "", review: "", rating: 5 })}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    + Add New Testimonial
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* ---------------------------------------------------- */}
          {/* 5. BLOG SECTION (Dynamic Nested Array) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Blog Section</h2>
            <InputField label="Section Title" name="blogSection.title" />

            <FieldArray name="blogSection.blogs">
              {({ push, remove }) => (
                <div className="mt-4">
                  {formik.values.blogSection.blogs.map((blog, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 relative">
                      <h3 className="font-medium mb-3">Blog Post #{index + 1}</h3>
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <InputField label="Title" name={`blogSection.blogs.${index}.title`} />
                      <InputField label="Image URL" name={`blogSection.blogs.${index}.image`} />
                      <InputField label="Short Description" name={`blogSection.blogs.${index}.shortDescription`} as="textarea" />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => push({ title: "", image: "", shortDescription: "" })}
                    className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    + Add New Blog Feature
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* ---------------------------------------------------- */}
          {/* 6. ABOUT SECTION */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">About Section</h2>
            <InputField label="Heading" name="aboutSection.heading" />
            <InputField label="Description" name="aboutSection.description" as="textarea" rows="4" />
            <InputField label="Image URL" name="aboutSection.image" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* 7. SEO SECTION */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">SEO Settings</h2>
            <InputField label="Meta Title" name="seo.metaTitle" maxLength="60" />
            <InputField label="Meta Description" name="seo.metaDescription" as="textarea" rows="3" maxLength="160" />
            {/* Note: Keywords requires a custom "Tags Input" component for a good UX */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Keywords (Enter as comma-separated)</label>
              <Field 
                name="seo.keywords" 
                placeholder="tag1, tag2, tag3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                // This converts a string input into the array expected by the schema
                onChange={(e) => {
                    const value = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    formik.setFieldValue("seo.keywords", value);
                }}
                value={formik.values.seo.keywords.join(', ')}
              />
            </div>
          </div>
          
          {/* ---------------------------------------------------- */}
          {/* SUBMIT BUTTON */}
          {/* ---------------------------------------------------- */}
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save Homepage Configuration"}
          </button>
        </form>
      </div>
    </FormikProvider>
  );
};

export default EditHomePage;