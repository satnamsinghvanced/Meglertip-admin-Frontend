import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createPrivacyPolicy = createAsyncThunk(
  "privacyPolicy/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/privacy-policy/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllPrivacyPolicies = createAsyncThunk(
  "privacyPolicy/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/privacy-policy/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/privacy-policy/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/privacy-policy/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const privacyPolicySlice = createSlice({
  name: "privacyPolicy",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPrivacyPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(createPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllPrivacyPolicies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPrivacyPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(getAllPrivacyPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(deletePrivacyPolicy.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.meta.arg);
      });
  },
});

export default privacyPolicySlice.reducer;
