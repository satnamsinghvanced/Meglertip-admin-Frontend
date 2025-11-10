/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  fetchPartners,
  updatePartner,
  deletePartner,
} from "../../store/slices/partnerSlice";

const DynamicField = ({
  field,
  onChange,
  disabled,
  isEditing,
  onRequiredToggle,
  onLabelChange,
  onPlaceholderChange,
}) => {
  const { label, placeholder, name, type, required } = field;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelChange(e, name)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              disabled={disabled}
            />
            <input
              type="text"
              value={placeholder}
              onChange={(e) => onPlaceholderChange(e, name)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 "
              disabled={disabled}
            />
          </div>
        ) : (
          <label className="text-sm font-medium text-gray-600 mb-1 flex gap-2">
            {label}
            {required && (
              <span className="text-red-600 text-[18px] leading-none">*</span>
            )}
          </label>
        )}
      </div>

      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={field.value || ""}
          onChange={(e) => onChange(e, name)}
          disabled={disabled}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:ring-blue-400"
          }`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={field.value || ""}
          onChange={(e) => onChange(e, name)}
          disabled={disabled}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:ring-blue-400 pointer-events-none"
          }`}
        />
      )}

      {isEditing && (
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={required}
            onChange={() => onRequiredToggle(name)}
            className="mr-2 text-blue-600 relative"
          />
          <label className="text-sm text-gray-600">Required</label>
        </div>
      )}
    </div>
  );
};

const IMAGE_URL =
  import.meta.env.VITE_API_URL_IMAGE ?? import.meta.env.VITE_LOCAL_URL_IMAGE;

const PartnerPage = () => {
  const dispatch = useDispatch();
  const { partners, loading } = useSelector((state) => state.partner);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  useEffect(() => {
    if (partners.length > 0) {
      setFormData({
        ...partners[0],
        contactFormTitle: partners[0].contactFormTitle || "",
        buttonText: partners[0].buttonText || "",
        formText: partners[0].formText || "",
      });
    }
  }, [partners]);

  const handleChange = (e, name) => {
    const { value } = e.target;
    const nameParts = name.split(".");
    if (nameParts.length === 2) {
      const [parentField, field] = nameParts;
      setFormData((prev) => ({
        ...prev,
        [parentField]: { ...prev[parentField], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleRequiredToggle = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      contactFields: prev.contactFields.map((field) =>
        field.name === fieldName
          ? { ...field, required: !field.required }
          : field
      ),
    }));
  };

  const handleLabelChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactFields: prev.contactFields.map((field) =>
        field.name === fieldName ? { ...field, label: value } : field
      ),
    }));
  };

  const handlePlaceholderChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactFields: prev.contactFields.map((field) =>
        field.name === fieldName ? { ...field, placeholder: value } : field
      ),
    }));
  };

  const handleSave = async () => {
    if (!formData?._id) return;
    try {
      const response = await dispatch(
        updatePartner({ id: formData._id, formData })
      ).unwrap();
      const successMessage =
        response?.message || "Partner updated successfully!";
      toast.success(successMessage);
      setIsEditing(false);
      dispatch(fetchPartners());
    } catch (err) {
      const errorMessage = err?.message || "Failed to update partner.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!formData?._id) return;
    try {
      const response = await dispatch(deletePartner(formData._id)).unwrap();
      const successMessage =
        response?.message || "Partner deleted successfully!";
      toast.success(successMessage);
      setFormData(null);
      setShowDeleteModal(false); // Close modal after delete
      dispatch(fetchPartners());
    } catch (err) {
      const errorMessage = err?.message || "Failed to delete partner.";
      toast.error(errorMessage);
    }
  };

  if (loading || !formData)
    return <p className="p-6 text-gray-600">Loading partner data...</p>;

  return (
    <div className="min-h-screen space-y-10 p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Partner Page</h1>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="px-2">
                <AiTwotoneEdit size={20} className="text-[#161925] text-xl" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)} // Show delete modal
                className="text-red-600 px-2"
              >
                <RiDeleteBin5Line className="text-xl" />
              </button>
            </>
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
      </div>

      {/* Section for Partner Info, Fields, etc. */}
      <Section title="Partner Information">
        <Input
          label="Heading"
          value={formData.heading}
          onChange={(e) => handleChange(e, "heading")}
          name="heading"
          disabled={!isEditing}
        />
        <Input
          label="Sub Heading"
          value={formData.subHeading}
          onChange={(e) => handleChange(e, "subHeading")}
          name="subHeading"
          disabled={!isEditing}
        />
      </Section>
      <Section title="Contact Form Fields">
        <Input
          label="Contact Form Title"
          value={formData.contactFormTitle}
          onChange={(e) => handleChange(e, "contactFormTitle")}
          name="contactFormTitle"
          disabled={!isEditing}
        />
        <Input
          label="Form Text"
          value={formData.formText}
          onChange={(e) => handleChange(e, "formText")}
          name="formText"
          disabled={!isEditing}
        />
        <Input
          label="Button Text"
          value={formData.buttonText}
          onChange={(e) => handleChange(e, "buttonText")}
          name="buttonText"
          disabled={!isEditing}
        />
        {formData.contactFields.map((field, index) => (
          <DynamicField
            key={index}
            field={field}
            onChange={handleChange}
            disabled={!isEditing}
            isEditing={isEditing}
            onRequiredToggle={handleRequiredToggle}
            onLabelChange={handleLabelChange}
            onPlaceholderChange={handlePlaceholderChange}
          />
        ))}
      </Section>
      <Section title="Details Section">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange(e, "title")}
          name="title"
          disabled={!isEditing}
        />
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-700"
            />
          </div>
        )}
        {(preview || formData.image) && (
          <img
            src={preview ? preview : `${IMAGE_URL}${formData.image}`}
            alt="Preview"
            className="mt-3 rounded-lg border h-40 w-auto object-cover"
          />
        )}
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange(e, "description")}
          name="description"
          disabled={!isEditing}
        />
      </Section>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 dark:bg-blue-950 rounded-lg w-[350px] shadow-lg">
            <p className="mb-6 font-bold text-center dark:text-white">
              Are you sure you want to delete this page?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="grid gap-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange, name, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white ${
        disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </div>
);

const Textarea = ({ label, value, onChange, name, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      rows={4}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white ${
        disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </div>
);

export default PartnerPage;
