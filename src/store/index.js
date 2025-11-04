import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";

import homePageReducer from "./slices/homepageSlice";
import articleReducer from "./slices/articleSlice";
import categoriesSlice from "./slices/articleCategoriesSlice";
import aboutReducer from "./slices/aboutPageSlice"
import faqReducer from "./slices/faq"
import categoryReducer from "./slices/category"

export default configureStore({
  reducer: {
    user,
    homepage: homePageReducer,
    articles: articleReducer,
    categories: categoriesSlice,
      about: aboutReducer,
        faq: faqReducer,
    category: categoryReducer,
  },
});
