import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slice/themeSlice.js";

const store = configureStore({
    reducer: {
        theme: themeSlice,
    },
});


export default store;