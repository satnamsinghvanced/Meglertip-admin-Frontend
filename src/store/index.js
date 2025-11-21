import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import homePageReducer from "./slices/homepageSlice";
import articleReducer from "./slices/articleSlice";
import categoriesSlice from "./slices/articleCategoriesSlice";
import aboutReducer from "./slices/aboutPageSlice";
import faqReducer from "./slices/faq";
import categoryReducer from "./slices/category";
import partnerReducer from "./slices/partnerSlice";
import formReducer from "./slices/formSlice";
import privacyPolicyReducer from "./slices/privacyPolicySlice";
import termOfServiceReducer from "./slices/termOfService";
import countySlice from "./slices/countySlice"
import companySlice from "./slices/companySlice"
import themeReducer from "./slices/themeSlice";
import placeSlice from "./slices/placeSlice"
import QuoteReducer from "./slices/quoteSlice"
import realEstateAgentSlice from "./slices/realEstateAgents";
export default configureStore({
  reducer: {
    user,
    homepage: homePageReducer,
    articles: articleReducer,
    categories: categoriesSlice,
    about: aboutReducer,
    faq: faqReducer,
    category: categoryReducer,
    partner: partnerReducer,
    form: formReducer,
    privacyPolicy: privacyPolicyReducer,
    termOfService: termOfServiceReducer,
    counties: countySlice,
    companies:companySlice,
    places: placeSlice,
    theme: themeReducer,
    quote:QuoteReducer,
    agents:realEstateAgentSlice,
  },
});
