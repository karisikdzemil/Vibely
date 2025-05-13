import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user-slice";
import postsSlice from "./posts-slice";

export const store = configureStore({
  reducer: { user: userSlice.reducer, posts: postsSlice },
});

export default store;
