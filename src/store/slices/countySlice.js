import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getCounties = createAsyncThunk(
  "county/getCounties",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/counties?page=${page}&limit=${limit}`);
      return data;

    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCounties = createAsyncThunk(
  "county/createCounties",
  async (cityData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/counties", cityData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const deleteCounties = createAsyncThunk(
  "county/deleteCounties",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/counties/${id}`);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const importCounties = createAsyncThunk(
  "county/importCounties",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/counties/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const countySlice = createSlice({
  name: "counties",
  initialState: {
    counties: [], 
    pagination: { currentPage: 1, totalPages: 1, totalCounties: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCounties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCounties.fulfilled, (state, action) => {
        state.loading = false;
        state.counties = action.payload.data || [];
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalCounties: action.payload.totalCounties || 0,
        };
      })
      .addCase(getCounties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch counties";
        state.counties = [];
      });
  },
});

export default countySlice.reducer;



