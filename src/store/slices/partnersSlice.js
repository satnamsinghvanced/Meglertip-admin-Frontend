import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchPartners = createAsyncThunk(
  "partners/fetchPartners",
  async (filters = {}) => {
    const params = {
      status: filters.status,
      premium: filters.premium,
      city: filters.city,
      postalCode: filters.postalCode,
      name: filters.name,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    const response = await api.get("/partners/", { params });
    return response.data;
  }
);

export const fetchPartnerById = createAsyncThunk(
  "partners/fetchPartnerById",
  async (id) => {
    const response = await api.get("/partners/details", { params: { id } });
    return response.data;
  }
);

export const createPartner = createAsyncThunk(
  "partners/createPartner",
  async (data) => {
    const response = await api.post("/partners/create", data);
    return response.data;
  }
);

export const updatePartner = createAsyncThunk(
  "partners/updatePartner",
  async ({ id, data }) => {
    const response = await api.put("/partners/update", data, { params: { id } });
    return response.data;
  }
);

export const deletePartner = createAsyncThunk(
  "partners/deletePartner",
  async (id) => {
    const response = await api.delete("/partners/delete", { params: { id } });
    return response.data;
  }
);

const partnersSlice = createSlice({
  name: "partners",
  initialState: {
    partners: [],
    partnerDetail: null,
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchPartnerById.pending, (state) => {
        state.loading = true;
        state.partnerDetail = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerDetail = action.payload.data;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.partnerDetail = null;
      })

      .addCase(createPartner.fulfilled, (state, action) => {
        state.partners.unshift(action.payload.data);
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.partners.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.partners[index] = updated;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.partners = state.partners.filter(
          (p) => p._id !== action.payload.data._id
        );
      });
  },
});

export default partnersSlice.reducer;
