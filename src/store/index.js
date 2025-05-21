import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user-slice";
import postsSlice from "./posts-slice";
import followersSlice from "./followers-slice"; 

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    posts: postsSlice,
    followers: followersSlice, 
  },
});

export default store;
