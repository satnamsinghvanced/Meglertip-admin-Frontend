import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchPartners = createAsyncThunk(
  "partner/fetchPartners",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/partner/");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch partners"
      );
    }
  }
);

export const createPartner = createAsyncThunk(
  "partner/createPartner",
  async (partnerData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/partner/create", partnerData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create partner"
      );
    }
  }
);

export const updatePartner = createAsyncThunk(
  "partner/updatePartner",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/partner/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update partner"
      );
    }
  }
);

export const deletePartner = createAsyncThunk(
  "partner/deletePartner",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/partner/update/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete partner"
      );
    }
  }
);

const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    partners: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPartnerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPartner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partners.push(action.payload);
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePartner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.partners.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.partners[index] = action.payload;
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = state.partners.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPartnerError } = partnerSlice.actions;
export default partnerSlice.reducer;
