import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../services/axios";

export const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    is_loading: false,
    errors: null,
    employees: [],
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
    setEmployees(state, action) {
      state.employees = action.payload.data;
      state.total_count = action.payload.total_count;
    },
    setDetails(state, action) {
      state.details = action.payload;
    },
  },
});

export const { setLoading, setErrors, setEmployees, setDetails } =
  employeeSlice.actions;

export const fetchEmployees =
  (payload = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const query = new URLSearchParams(payload).toString();
      const data = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee/list?${query}`
      );

      dispatch(setEmployees(data));
    } catch (error) {
      dispatch(setErrors(error));
      dispatch(setEmployees([]));
    }
    dispatch(setLoading(false));
  };

export const fetchDetails = (employeeID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/employee/details?id=${employeeID}`
    );
    dispatch(setDetails(data.employee));
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export const createEmployee = (body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/employee/add-employee`,
      body
    );
    toast.success(data?.message);
    dispatch(fetchEmployees());
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
      `${import.meta.env.VITE_API_URL}/api/employee/update-employee?id=${id}`,
      body
    );
    dispatch(setDetails(data?.user));
    toast.success(data?.message);
    dispatch(fetchEmployees());
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
      `${import.meta.env.VITE_API_URL}/api/employee/employee-status?id=${id}`,
      body
    );
    dispatch(setDetails(data?.user));
    toast.success(data?.message);
    dispatch(fetchEmployees());
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export const deleteEmployee = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/employee/delete?id=${id}`
    );
    dispatch(fetchEmployees());
  } catch (error) {
    dispatch(setErrors(error));
  }
  dispatch(setLoading(false));
};

export default employeeSlice.reducer;
