import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import employee from "./slices/employee";
import homePageReducer from "./slices/homepageSlice";

export default configureStore({
  reducer: {
    user,
    employee,
    homepage: homePageReducer,
  },
});
