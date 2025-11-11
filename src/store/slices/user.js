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
      `${import.meta.env.VITE_API_URL}/admin/login`,
      body
    );

    dispatch(setAuthUser(data.admin));
    dispatch(setToken(data.token));
    toast.success(data.message);
       navigate("/", { replace: true });
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

export const updateUserInfo = (id, body) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const token = getState()?.auth?.token;

    const data = await axios.put(
      `${import.meta.env.VITE_API_URL}/admin/update-profile?id=${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setAuthUser(data?.admin));
    toast.success(data?.message);
  } catch (error) {
    console.log(error?.response?.data);
    toast.error(error?.response?.data?.message || "Unauthorized");
  }

  dispatch(setLoading(false));
};

export const changePassword = (id, body) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const token = getState()?.auth?.token;

    const data = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/change-password?id=${id}`,
      body,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    // dispatch(setAuthUser(data?.admin));
    toast.success(data?.message);
  } catch (error) {
    console.log(error?.response?.data);
    toast.error(error?.response?.data?.message || "Unauthorized");
  }

  dispatch(setLoading(false));
};
export default userSlice.reducer;
