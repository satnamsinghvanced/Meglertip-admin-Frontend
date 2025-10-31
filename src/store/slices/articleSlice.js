import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_API_URL;

const fixImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
};

export const getArticles = createAsyncThunk(
  "articles/getArticles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/article/`);
      return res.data.data.map((item) => ({
        ...item,
        image: fixImageUrl(item.image),
      }));
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
      const res = await axios.put(
        `${BASE_URL}/article/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
      await axios.delete(`${BASE_URL}/article/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(getArticleById.fulfilled, (state, action) => {
        state.selectedArticle = action.payload;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const i = state.articles.findIndex((a) => a._id === action.payload._id);
        if (i !== -1) state.articles[i] = action.payload;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter((a) => a._id !== action.payload);
      });
  },
});

export const { clearSelectedArticle, clearError } = articleSlice.actions;
export default articleSlice.reducer;
