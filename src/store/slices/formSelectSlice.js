import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Fetch all
export const getForms = createAsyncThunk(
  "formSelect/getForms",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/form-select");
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Create
export const createForm = createAsyncThunk(
  "formSelect/createForm",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/form-select", payload);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Update
export const updateForm = createAsyncThunk(
  "formSelect/updateForm",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/form-select/${id}`, payload);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Delete
export const deleteForm = createAsyncThunk(
  "formSelect/deleteForm",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/form-select/${id}`);
      return { id };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const formSelectSlice = createSlice({
  name: "formSelect",
  initialState: {
    forms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getForms.fulfilled, (state, action) => {
        state.forms = action.payload;
        state.loading = false;
      })
      .addCase(getForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createForm.fulfilled, (state, action) => {
        state.forms.push(action.payload);
        state.loading = false;
      })

      // Update
      .addCase(updateForm.fulfilled, (state, action) => {
        state.forms = state.forms.map((f) =>
          f._id === action.payload._id ? action.payload : f
        );
        state.loading = false;
      })

      // Delete
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.forms = state.forms.filter((f) => f._id !== action.payload.id);
      });
  },
});

export default formSelectSlice.reducer;
