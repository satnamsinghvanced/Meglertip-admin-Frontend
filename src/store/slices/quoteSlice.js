import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchQuotes = createAsyncThunk(
  "quote/fetchQuotes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/quote/");
      return data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch quotes"
      );
    }
  }
);

export const createQuote = createAsyncThunk(
  "quote/createQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/quote/create", quoteData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create quote"
      );
    }
  }
);

export const updateQuote = createAsyncThunk(
  "quote/updateQuote",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/quote/update/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update quote"
      );
    }
  }
);

// Delete a quote
export const deleteQuote = createAsyncThunk(
  "quote/deleteQuote",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quote/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete quote"
      );
    }
  }
);

const quoteSlice = createSlice({
  name: "quotes",
  initialState: {
    quotes: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearQuoteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quotes
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Quote
      .addCase(createQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes.push(action.payload);
      })
      .addCase(createQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Quote
      .addCase(updateQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotes.findIndex(
          (q) => q._id === action.payload._id
        );
        if (index !== -1) state.quotes[index] = action.payload;
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Quote
      .addCase(deleteQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = state.quotes.filter((q) => q._id !== action.payload);
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuoteError } = quoteSlice.actions;

export default quoteSlice.reducer;
