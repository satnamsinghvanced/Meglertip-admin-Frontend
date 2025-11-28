import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getAllLeads = createAsyncThunk(
  "lead/getAllLeads",
  async ({ page = 1, limit = 10, search = "", status = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await api.get(`lead-logs/all?${params.toString()}`);

      return res.data; // return entire response
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching leads");
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    leads: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1,
    },
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load leads";
      });
  },
});

export default leadSlice.reducer;
