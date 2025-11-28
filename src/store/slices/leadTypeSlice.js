import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchLeadTypes = createAsyncThunk(
  "leadType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/lead-type");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch lead types");
    }
  }
);

export const createLeadType = createAsyncThunk(
  "leadType/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/lead-type", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create lead type");
    }
  }
);

export const updateLeadType = createAsyncThunk(
  "leadType/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/lead-type/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update lead type");
    }
  }
);

export const deleteLeadType = createAsyncThunk(
  "leadType/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/lead-type/${id}`);
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete lead type");
    }
  }
);

const leadTypeSlice = createSlice({
  name: "leadType",
  initialState: {
    leadTypes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.leadTypes = action.payload;
      })
      .addCase(fetchLeadTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createLeadType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeadType.fulfilled, (state, action) => {
        state.loading = false;
        state.leadTypes.push(action.payload);
      })
      .addCase(createLeadType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateLeadType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeadType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leadTypes.findIndex(
          (lt) => lt._id === action.payload._id
        );
        if (index !== -1) state.leadTypes[index] = action.payload;
      })
      .addCase(updateLeadType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteLeadType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeadType.fulfilled, (state, action) => {
        state.loading = false;
        state.leadTypes = state.leadTypes.filter(
          (lt) => lt._id !== action.payload.id
        );
      })
      .addCase(deleteLeadType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leadTypeSlice.reducer;
