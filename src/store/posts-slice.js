import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const snapshot = await getDocs(collection(db, "PostsMeta"));
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    setPosts: (state, action) => action.payload,
    addPost: (state, action) => {
      state.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
