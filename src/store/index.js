import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import employee from "./slices/employee";
import homePageReducer from "./slices/homepageSlice";
import articleReducer from "./slices/articleSlice";
import categoriesSlice from "./slices/articleCategoriesSlice";
import aboutReducer from "./slices/aboutPageSlice"

export default configureStore({
  reducer: {
    user,
    employee,
    homepage: homePageReducer,
    articles: articleReducer,
    categories: categoriesSlice,
      about: aboutReducer,
  },
});
