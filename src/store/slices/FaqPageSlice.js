import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const getFaqPage = createAsyncThunk("faq/get", async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/faq-page`);
  return res.data.data;

});

export const updateFaqPage = createAsyncThunk("faq/update", async (body) => {
  const res = await axios.put(`${import.meta.env.VITE_API_URL}/faq-page/update`, body);
  //  toast.success(res.data?.message || "About page updated successfully");
  return res.data.data;
   

});

const faqSlice = createSlice({
  name: "faq",
  initialState: { faq: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getFaqPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFaqPage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.faq = payload;
      })
      .addCase(updateFaqPage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.faq = payload;
      })
      .addCase(updateFaqPage.pending, (state) => {
        state.loading = true;
      });
  },
});

export default faqSlice.reducer;
