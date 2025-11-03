import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../services/axios";

const initialState = {
  is_loading: false,
  errors: null,
  sections: {
    hero: null,
    "how-it-works": null,
    "articles-heading": null,
    "why-choose": null,
    city: null,
    pros: null,
  },
};

export const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.is_loading = action.payload;
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    clearMessages(state) {
      state.errors = null;
    },
    setSectionData(state, action) {
      const { sectionName, data } = action.payload;
      state.sections[sectionName] = data;
    },
  },
});

export const { setLoading, setErrors, clearMessages, setSectionData } =
  homepageSlice.actions;

// -----------------------------------------------------------------------------
// Fetch single homepage section
// -----------------------------------------------------------------------------
export const fetchHomepageSection = (sectionName) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/homepage/${sectionName}`
    );

    dispatch(
      setSectionData({ sectionName, data: res?.data?.data || res?.data })
    );
  } catch (error) {
    console.error("Fetch section error:", error);
    dispatch(setErrors(error));
    toast.error(error?.response?.data?.message || "Failed to fetch section");
  } finally {
    dispatch(setLoading(false));
  }
};

// -----------------------------------------------------------------------------
// Update single homepage section
// -----------------------------------------------------------------------------
export const updateHomepageSection = (sectionName, body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/homepage/${sectionName}`,
      body
    );

    toast.success(
      res?.data?.message || `${sectionName} updated successfully`
    );

    // Refresh the section data after update
    await dispatch(fetchHomepageSection(sectionName));
  } catch (error) {
    console.error("Update section error:", error);
    dispatch(setErrors(error));
    toast.error(
      error?.response?.data?.message || `Failed to update ${sectionName}`
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// -----------------------------------------------------------------------------
// Fetch all homepage sections (for admin dashboard load)
// -----------------------------------------------------------------------------
export const fetchAllHomepageSections = () => async (dispatch) => {
  const sections = [
    "hero",
    "how-it-works",
    "articles-heading",
    "why-choose",
    "city",
    "pros",
  ];

  for (const section of sections) {
    await dispatch(fetchHomepageSection(section));
  }
};

export default homepageSlice.reducer;
