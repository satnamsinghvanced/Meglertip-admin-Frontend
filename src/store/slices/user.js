import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../services/axios";
import { redirect } from "react-router";

const userSlice = createSlice({
  name: "user",
  initialState: {
    is_loading: false,
    auth_user: JSON.parse(localStorage.getItem("auth_user")),
    token: localStorage.getItem("token"),
  },
  reducers: {
    setLoading(state, action) {
      state.is_loading = action.payload;
    },
    setAuthUser(state, action) {
      state.auth_user = action.payload;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
});

export const { setLoading, setAuthUser, setToken } = userSlice.actions;

export const signIn = (body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/login`,
      body
    );

    console.log("auth_user", data.admin);

    dispatch(setAuthUser(data.admin));
    dispatch(setToken(data.token));
    toast.success(data.message);
    redirect("/");
  } catch (error) {
    console.log("error", error);
  }
  dispatch(setLoading(false));
};

export const logOut = () => async (dispatch) => {
  dispatch(setAuthUser(null));
  dispatch(setToken(null));
  localStorage.removeItem("token");
  localStorage.removeItem("auth_user");
  redirect("/login");
};

export const updateUserInfo = (id, body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/employee/update-employee?id=${id}`,
      body
    );
    dispatch(setAuthUser(data?.user));
    toast.success(data?.message);
  } catch (error) {}
  dispatch(setLoading(false));
};

export default userSlice.reducer;
