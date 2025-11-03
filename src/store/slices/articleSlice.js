import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_API_URL_IMAGE;

const fixImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
};

// --------------------
// Async Thunks
// --------------------

export const getArticles = createAsyncThunk(
  "articles/getArticles",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/article?page=${page}&limit=${limit}`);
      return {
        data: res.data.data.map((item) => ({
          ...item,
          image: fixImageUrl(item.image),
        })),
        pagination: res.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getArticleById = createAsyncThunk(
  "articles/getArticleById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/article/${id}`);
      return { ...res.data.data, image: fixImageUrl(res.data.data.image) };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/article/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { ...res.data.data, image: fixImageUrl(res.data.data.image) };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/article/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { ...res.data.data, image: fixImageUrl(res.data.data.image) };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/article/delete/${id}`);
      return { id, message: res?.data?.message || "Article deleted successfully" };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --------------------
// Slice
// --------------------

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    articles: { data: [], pagination: {} },
    selectedArticle: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Optional helper reducer for local state update
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(getArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getArticleById.fulfilled, (state, action) => {
        state.selectedArticle = action.payload;
      })

      // Create
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.data.push(action.payload);
      })

      // Update
      .addCase(updateArticle.fulfilled, (state, action) => {
        const i = state.articles.data.findIndex((a) => a._id === action.payload._id);
        if (i !== -1) state.articles.data[i] = action.payload;
      })

      // ✅ Delete (Fixed)
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles.data = state.articles.data.filter(
          (a) => a._id !== action.payload.id
        );
      });
  },
});

export const { clearSelectedArticle, clearError, setArticles } =
  articleSlice.actions;
export default articleSlice.reducer;
