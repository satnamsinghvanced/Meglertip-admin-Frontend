import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL_IMAGE;

const HOMEPAGE_ID = "69020242fdba2d751a7830d2";

export const getHomepageSection = createAsyncThunk(
  "homepage/getHomepageSection",
  async (sectionName, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/homepage/${HOMEPAGE_ID}/${sectionName}`
      );

      if (!data.success)
        throw new Error(data.message || "Failed to fetch section");

      return { sectionName, sectionData: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateHomepageSection = createAsyncThunk(
  "homepage/updateHomepageSection",
  async ({ sectionName, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/homepage/${HOMEPAGE_ID}/${sectionName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!data.success)
        throw new Error(data.message || "Failed to update section");

      return { sectionName, sectionData: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const homepageSlice = createSlice({
  name: "homepage",
  initialState: {
    sections: {},
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomepageSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomepageSection.fulfilled, (state, action) => {
        state.loading = false;
        const { sectionName, sectionData } = action.payload;
        state.sections[sectionName] = sectionData;
      })
      .addCase(getHomepageSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHomepageSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomepageSection.fulfilled, (state, action) => {
        state.loading = false;
        const { sectionName, sectionData } = action.payload;
        state.sections[sectionName] = sectionData;
        state.successMessage = `${sectionName} updated successfully!`;
      })
      .addCase(updateHomepageSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = homepageSlice.actions;
export default homepageSlice.reducer;
