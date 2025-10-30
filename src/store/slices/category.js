import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../services/axios";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    is_loading: false,
    errors: null,
    category: [],
    details: null,
    total_count: 0,
  },
  reducers: {
    setLoading(state, action) {
      state.is_loading = action.payload;
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload.data;
      state.total_count = action.payload.total_count;
    },
    setDetails(state, action) {
      state.details = action.payload;
    },
  },
});

export const { setLoading, setErrors, setCategory, setDetails } =
  categorySlice.actions;

export const fetchCategory =
  (payload = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    try {
    //   const query = new URLSearchParams(payload).toString();
      const data = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/category`
      );

      dispatch(setCategory(data));
    } catch (error) {
      dispatch(setErrors(error));
      dispatch(setCategory([]));
    }
    dispatch(setLoading(false));
  };

export const fetchDetails = (categoryID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/category/details?id=${categoryID}`
    );
    dispatch(setDetails(data.category));
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export const createEmployee = (body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/category/add-category`,
      body
    );
    toast.success(data?.message);
    dispatch(fetchCategory());
  } catch (error) {
    dispatch(setErrors(error));
    toast.error(data?.message);
  }
  dispatch(setLoading(false));
};

export const updateEmployee = (id, body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/category/update-category?id=${id}`,
      body
    );
    dispatch(setDetails(data?.user));
    toast.success(data?.message);
    dispatch(fetchCategory());
  } catch (error) {
    dispatch(setErrors(error));
    toast.error(data?.message);
  }
  dispatch(setLoading(false));
};

export const updateEmployeeStatus = (id, body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/category/category-status?id=${id}`,
      body
    );
    dispatch(setDetails(data?.user));
    toast.success(data?.message);
    dispatch(fetchCategory());
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export const deleteEmployee = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/category/delete?id=${id}`
    );
    dispatch(fetchCategory());
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export default categorySlice.reducer;
