import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
// GET SMTP CONFIG
export const getSmtpConfig = createAsyncThunk(
  "smtp/getSmtpConfig",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/smtp");
        // console.log(res.data.data," from slice")
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// SAVE SMTP CONFIG
export const saveSmtpConfig = createAsyncThunk(
  "smtp/saveSmtpConfig",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/smtp/save-smtp", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// UPDATE SMTP CONFIG
export const updateSmtpConfig = createAsyncThunk(
  "smtp/updateSmtpConfig",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put("/smtp/update-smtp", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const smtpSlice = createSlice({
  name: "smtp",
  initialState: {
    config: null,
    loading: false,
    error: null,
  },
   reducers: {
    clearSmtpState: (state) => {
      state.config = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getSmtpConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSmtpConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(getSmtpConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SAVE
      .addCase(saveSmtpConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveSmtpConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(saveSmtpConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSmtpConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSmtpConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(updateSmtpConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearSmtpState } = smtpSlice.actions;

export default smtpSlice.reducer;
