import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchTheme = createAsyncThunk("theme/fetchTheme", async () => {
  const response = await api.get(`/website_settings/`);
  return response.data.data;
});

export const updateTheme = createAsyncThunk(
  "theme/updateTheme",
  async ({ id, data }) => {
    const response = await api.put(`/website_settings/update?id=${id}`, data);
    return response.data.data;
  }
);

export const uploadLogos = createAsyncThunk(
  "theme/uploadLogos",
  async ({ id, files }) => {
    const formData = new FormData();
    if (files.logo) formData.append("logo", files.logo);
    if (files.favicon) formData.append("favicon", files.favicon);
    if (files.logoDark) formData.append("logoDark", files.logoDark);
    if (files.wordmark) formData.append("wordmark", files.wordmark);
    if (files.wordmarkDark) formData.append("wordmarkDark", files.wordmarkDark);
    if (files.lettermark) formData.append("lettermark", files.lettermark);
    if (files.tagline) formData.append("tagline", files.tagline);

    const response = await api.put(
      `/website_settings/upload-logo?id=${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  }
);

const website_settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: null,
    themeId: null,
    logos: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload.theme;
        state.themeId = action.payload._id;
        state.logos = action.payload.logos;
      })
      .addCase(fetchTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTheme.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.saving = false;
        state.theme = action.payload.theme;
        state.themeId = action.payload._id;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })
      .addCase(uploadLogos.pending, (state) => {
        state.saving = true;
      })
      .addCase(uploadLogos.fulfilled, (state, action) => {
        state.saving = false;
        state.theme = action.payload.theme;
        state.themeId = action.payload._id;
        state.logos = action.payload.logos;
      })
      .addCase(uploadLogos.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  },
});

export default website_settingsSlice.reducer;
