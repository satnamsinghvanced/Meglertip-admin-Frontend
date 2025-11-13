import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";

// ✅ Fetch all forms
export const fetchForms = createAsyncThunk(
  "form/fetchForms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/forms/details");
      console.log(data)
      return data.data || data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch forms"
      );
    }
  }
);

// ✅ Fetch form by ID
export const fetchFormById = createAsyncThunk(
  "form/fetchFormById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/forms?id=${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch form"
      );
    }
  }
);

// ✅ Create new form
export const createForm = createAsyncThunk(
  "form/createForm",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/forms", formData);
      return data.form;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to create form"
      );
    }
  }
);

// ✅ Update existing form
export const updateForm = createAsyncThunk(
  "form/updateForm",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/forms/update?id=${id}`, formData);
 toast.success("Form updated successfully!");
      return data.form;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to update form"
      );
    }
  }
);

// ✅ Delete form
export const deleteForm = createAsyncThunk(
  "form/deleteForm",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/forms?id=${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to delete form"
      );
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState: {
    forms: [],
    currentForm: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearFormError: (state) => {
      state.error = null;
    },
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all forms
      .addCase(fetchForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch form by ID
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create form
      .addCase(createForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update form
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forms.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) state.forms[index] = action.payload;
        if (state.currentForm?._id === action.payload._id)
          state.currentForm = action.payload;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete form
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((f) => f._id !== action.payload);
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFormError, clearCurrentForm } = formSlice.actions;
export default formSlice.reducer;
