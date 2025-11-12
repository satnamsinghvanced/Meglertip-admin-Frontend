import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createTermOfService = createAsyncThunk(
  "termOfService/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/term-of-service/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllTermOfService = createAsyncThunk(
  "termOfService/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/term-of-service/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTermOfService = createAsyncThunk(
  "termOfService/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/term-of-service/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTermOfService = createAsyncThunk(
  "termOfService/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/term-of-service/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const TermOfServiceSlice = createSlice({
  name: "termOfService",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTermOfService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTermOfService.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(createTermOfService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllTermOfService.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTermOfService.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(getAllTermOfService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTermOfService.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(deleteTermOfService.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg
        );
      });
  },
});

export default TermOfServiceSlice.reducer;
