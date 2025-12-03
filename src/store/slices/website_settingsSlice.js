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
    const response = await api.put(
      `/website_settings/upload-logo?id=${id}`,
      files, // <-- send FormData directly
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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
