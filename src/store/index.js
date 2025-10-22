import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import employee from "./slices/employee";

export default configureStore({
  reducer: {
    user,
    employee
  },
});
