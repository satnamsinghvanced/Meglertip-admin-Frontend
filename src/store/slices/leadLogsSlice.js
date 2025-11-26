import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getAllLeads = createAsyncThunk(
  "lead/getAllLeads",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("lead-logs/all");
      return res.data.leads;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching leads");
    }
  }
);

// =============================
// SLICE
// =============================
const leadSlice = createSlice({
  name: "lead",
  initialState: {
    leads: [],
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
        state.leads = action.payload;
      })
      .addCase(getAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load leads";
      });
  },
});

export default leadSlice.reducer;
