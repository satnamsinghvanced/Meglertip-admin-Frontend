import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // assume axios instance with baseURL


// Fetch sitemap (GET /api/sitemap)
export const fetchSitemap = createAsyncThunk("sitemap/fetch", async (_, { rejectWithValue }) => {
try {
const { data } = await api.get("/sitemap");
return data.data || data;
} catch (err) {
return rejectWithValue(err.response?.data?.message || err.message);
}
});


// Create sitemap (POST /api/sitemap)
export const createSitemap = createAsyncThunk("sitemap/create", async (payload, { rejectWithValue }) => {
try {
const { data } = await api.post("/sitemap", payload);
return data.data || data;
} catch (err) {
return rejectWithValue(err.response?.data?.message || err.message);
}
});


// Update sitemap (PUT /api/sitemap)
export const updateSitemap = createAsyncThunk("sitemap/update", async (payload, { rejectWithValue }) => {
try {
const { data } = await api.put("/sitemap", payload);
return data.data || data;
} catch (err) {
return rejectWithValue(err.response?.data?.message || err.message);
}
});


const sitemapSlice = createSlice({
name: "sitemap",
initialState: { data: null, loading: false, error: null },
reducers: {},
extraReducers: (builder) => {
builder
.addCase(fetchSitemap.pending, (state) => { state.loading = true; state.error = null; })
.addCase(fetchSitemap.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
.addCase(fetchSitemap.rejected, (state, action) => { state.loading = false; state.error = action.payload; })


.addCase(createSitemap.pending, (state) => { state.loading = true; state.error = null; })
.addCase(createSitemap.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
.addCase(createSitemap.rejected, (state, action) => { state.loading = false; state.error = action.payload; })


.addCase(updateSitemap.pending, (state) => { state.loading = true; state.error = null; })
.addCase(updateSitemap.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
.addCase(updateSitemap.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
}
});


export default sitemapSlice.reducer;