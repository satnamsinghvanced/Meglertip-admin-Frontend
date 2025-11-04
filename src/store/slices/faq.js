import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const getFAQs = createAsyncThunk("faq/getFAQs", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/faq`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch FAQs");
  }
});

export const createFAQ = createAsyncThunk("faq/createFAQ", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/faq/create`, formData);
    toast.success(res.data.message || "FAQ created successfully!");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create FAQ");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateFAQ = createAsyncThunk("faq/updateFAQ", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/faq/update?id=${id}`, formData);
    toast.success(res.data.message || "FAQ updated successfully!");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update FAQ");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteFAQ = createAsyncThunk("faq/deleteFAQ", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/faq/delete?id=${id}`);
    toast.success(res.data.message || "FAQ deleted successfully!");
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete FAQ");
    return rejectWithValue(err.response?.data?.message);
  }
});


const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFAQs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFAQs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(getFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter((cat) => !cat.faqs.some((f) => f._id === action.payload));
      });
  },
});

export default faqSlice.reducer;
