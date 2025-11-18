import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchTheme = createAsyncThunk("theme/fetchTheme", async () => {
  const response = await api.get(`/theme/`);
  return response.data.data[0];
});

export const updateTheme = createAsyncThunk(
  "theme/updateTheme",
  async ({ id, data }) => {
    const response = await api.put(`/theme/update/${id}`, data);
    return response.data.data;
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: null,
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
        state.theme = action.payload;
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
        state.theme = action.payload;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  },
});

export default themeSlice.reducer;
