import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchFooter = createAsyncThunk(
  "footer/fetchFooter",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/footer");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const updateFooter = createAsyncThunk(
  "footer/updateFooter",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/footer/${id}`, body);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);


const footerSlice = createSlice({
  name: "footer",
  initialState: {
    footer: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFooter.fulfilled, (state, action) => {
        state.loading = false;
        state.footer = action.payload.data; 
      })
      .addCase(fetchFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateFooter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFooter.fulfilled, (state, action) => {
        state.loading = false;
        state.footer = action.payload.data; 
      })
      .addCase(updateFooter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default footerSlice.reducer;
