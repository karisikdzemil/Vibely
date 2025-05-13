import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
      setPosts: (state, action) => action.payload,
      addPost: (state, action) => {
        state.unshift(action.payload);
      }
    }
  });
  
  export const { setPosts, addPost } = postsSlice.actions;
  export default postsSlice.reducer;
  