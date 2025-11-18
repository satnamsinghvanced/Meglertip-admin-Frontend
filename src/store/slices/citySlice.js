import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ---------------------------------------------------------------------
// 1️⃣ Get Cities (with pagination)
// ---------------------------------------------------------------------
export const getCities = createAsyncThunk(
  "city/getCities",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/cities?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 2️⃣ Create (Add Manual) City
// ---------------------------------------------------------------------
export const createCity = createAsyncThunk(
  "city/createCity",
  async (cityData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/cities", cityData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 3️⃣ Delete City
// ---------------------------------------------------------------------
export const deleteCity = createAsyncThunk(
  "city/deleteCity",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cities/${id}`);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 4️⃣ Import Cities (Excel / CSV Upload)
// ---------------------------------------------------------------------
export const importCities = createAsyncThunk(
  "city/importCities",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/cities/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------

const citySlice = createSlice({
  name: "cities",
  initialState: {
    cities: { data: [] },
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ---------------- Fetch Cities ----------------
      .addCase(getCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cities";
      })

      // ---------------- Create City ----------------
      .addCase(createCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add city";
      })

      // ---------------- Delete City ----------------
      .addCase(deleteCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.data = state.cities.data.filter(
          (city) => city._id !== action.payload.id
        );
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete city";
      })

      // ---------------- Import Cities ----------------
      .addCase(importCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(importCities.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to import cities";
      });
  },
});

export default citySlice.reducer;
