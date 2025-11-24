import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ===================== GET ALL CONTACTS =====================
export const fetchContacts = createAsyncThunk(
  "contact/fetch",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/contact?page=${page}&limit=${limit}`);
      return res.data; // Must contain items + totalContacts
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===================== GET ONE CONTACT BY ID =====================
export const fetchContactById = createAsyncThunk(
  "contact/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/contact/${id}`);
      return res.data; // Must contain { success, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===================== DELETE CONTACT =====================
export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/delete/${id}`);
      return id; // return ID to remove from table
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===================== SLICE =====================
const contactSlice = createSlice({
  name: "contact",

  initialState: {
    data: {
      items: [],
      total: 0,
    },
    selected: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedContact: (state) => {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---------------- FETCH ALL ----------------
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.data.items = action.payload.items || [];
        state.data.total = action.payload.totalContacts || 0;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- FETCH ONE ----------------
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.selected = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        // Important: most APIs return { success, data }
        state.selected = action.payload.data || null;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.selected = null;
        state.error = action.payload;
      })

      // ---------------- DELETE ----------------
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.data.items = state.data.items.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export const { clearSelectedContact } = contactSlice.actions;
export default contactSlice.reducer;
