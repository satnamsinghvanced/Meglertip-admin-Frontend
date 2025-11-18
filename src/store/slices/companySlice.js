import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Assuming your API response for a list of companies is structured like:
// { data: [...companies], currentPage: 1, totalPages: 5, totalCompanies: 50 }

// ---------------------------------------------------------------------
// 1️⃣ Get All Companies
// ---------------------------------------------------------------------
export const getCompanies = createAsyncThunk(
  "companies/getCompanies",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      // Note: The /companies endpoint should return pagination data
      const { data } = await api.get(`/companies?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 2️⃣ Get Company By ID (New Thunk)
// ---------------------------------------------------------------------
export const getCompanyById = createAsyncThunk(
  "companies/getCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/companies/detail/${id}`);
      return data; // Assumes API returns { data: companyObject }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 3️⃣ Create Company
// ---------------------------------------------------------------------
export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/companies", companyData);
      return data; // Assumes API returns the new company object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 4️⃣ Update Company (New Thunk)
// ---------------------------------------------------------------------
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, companyData }, { rejectWithValue }) => {
    try {

      const { data } = await api.put(`/companies/update/${id}`, companyData);
      return data; // Assumes API returns the updated company object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 5️⃣ Delete Company
// ---------------------------------------------------------------------
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/companies/${id}`);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// 6️⃣ Import Companies
// ---------------------------------------------------------------------
export const importCompanies = createAsyncThunk(
  "companies/importCompanies",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/upload/csv-companies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------------------------------------------------------------
// Company Slice
// ---------------------------------------------------------------------

const companySlice = createSlice({
  name: "companies",
  initialState: {
    // Renamed 'cities' to 'companies' for consistency
    companies: { data: [], pagination: {} },
    selectedCompany: null, // For storing the result of getCompanyById
    loading: false,
    error: null,
  },

  reducers: {
    // Added utility reducers for better state management
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Used for potential manual state updates
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============ Fetch All Companies (getCompanies) ============
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload; // Assuming payload is { data: [], pagination: {} }
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch companies";
      })

      // ============ Get Company By ID (getCompanyById) ============
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.selectedCompany = action.payload.data || action.payload;
      })

      // ============ Create Company (createCompany) ============
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Prepending or appending the new company to the list
        state.companies.data.push(action.payload.data || action.payload); 
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create company";
      })

      // ============ Update Company (updateCompany) ============
      .addCase(updateCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload.data || action.payload;
        // Find the index of the company to update
        const index = state.companies.data.findIndex((c) => c._id === updatedCompany._id); 
        if (index !== -1) {
          state.companies.data[index] = updatedCompany;
        }
        // Also update selectedCompany if the one being viewed was updated
        if (state.selectedCompany && state.selectedCompany._id === updatedCompany._id) {
          state.selectedCompany = updatedCompany;
        }
      })

      // ============ Delete Company (deleteCompany) ============
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted company by its ID
        state.companies.data = state.companies.data.filter(
          (c) => c._id !== action.payload.id
        );
        // Clear selected company if it was the one deleted
        if (state.selectedCompany && state.selectedCompany._id === action.payload.id) {
            state.selectedCompany = null;
        }
      })

      // ============ Import Companies (importCompanies) ============
      .addCase(importCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(importCompanies.fulfilled, (state) => {
        state.loading = false;
        // NOTE: After import, you typically want to re-fetch the list
      })
      .addCase(importCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to import companies";
      })
      
      // ============ Handle Pending/Rejected for CRUD ============
      .addMatcher(
        (action) =>
          [createCompany.pending, updateCompany.pending, deleteCompany.pending].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [createCompany.rejected, updateCompany.rejected, deleteCompany.rejected].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "An action failed";
        }
      );
  },
});

export const { clearSelectedCompany, clearError, setCompanies } =
  companySlice.actions;

export default companySlice.reducer;