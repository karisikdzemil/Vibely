import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../components/firebase";

export const fetchFollowing = createAsyncThunk(
  "followers/fetchFollowing",
  async (userId) => {
    const q = query(collection(db, "Followers"), where("followerId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      followingId: doc.data().followingId,
    }));
  }
);

const followersSlice = createSlice({
  name: "followers",
  initialState: {
    followingUserIds: [], 
    docIdsByUser: {}, 
  },
  reducers: {
    addFollowing(state, action) {
      const { followingId, docId } = action.payload;
      state.followingUserIds.push(followingId);
      state.docIdsByUser[followingId] = docId;
    },
    removeFollowing(state, action) {
      const followingId = action.payload;
      state.followingUserIds = state.followingUserIds.filter(id => id !== followingId);
      delete state.docIdsByUser[followingId];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFollowing.fulfilled, (state, action) => {
      state.followingUserIds = action.payload.map((item) => item.followingId);
      state.docIdsByUser = {};
      for (const item of action.payload) {
        state.docIdsByUser[item.followingId] = item.id;
      }
    });
  },
});

export const { addFollowing, removeFollowing } = followersSlice.actions;
export default followersSlice.reducer;
