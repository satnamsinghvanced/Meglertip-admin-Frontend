import axios from "axios";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Adjust this line to match your backend response key
    return data.fileUrl || data.url || data.image || "";
  } catch (error) {
    console.error("Image upload failed:", error);
    return "";
  }
};
