import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../components/firebase";

// 🔄 Thunk koji dohvaća sve korisnike koje korisnik prati
export const fetchFollowing = createAsyncThunk(
  "followers/fetchFollowing",
  async (userId) => {
    const q = query(
      collection(db, "Followers"),
      where("followerId", "==", userId)
    );
    const snapshot = await getDocs(q);

    // Vraćamo niz objekata sa Firestore document ID i followingId
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      followingId: doc.data().followingId,
    }));
  }
);

const followersSlice = createSlice({
  name: "followers",
  initialState: {
    followingUserIds: [],     // Lista ID-jeva korisnika koje trenutni korisnik prati
    docIdsByUser: {},         // Mapiranje userId => docId (radi lakšeg brisanja)
  },
  reducers: {
    // Dodaje jednog novog praćenog korisnika
    addFollowing(state, action) {
      const { followingId, docId } = action.payload;
      state.followingUserIds.push(followingId);
      state.docIdsByUser[followingId] = docId;
    },
    // Uklanja jednog praćenog korisnika
    removeFollowing(state, action) {
      const followingId = action.payload;
      state.followingUserIds = state.followingUserIds.filter(
        (id) => id !== followingId
      );
      delete state.docIdsByUser[followingId];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFollowing.fulfilled, (state, action) => {
      // Kada se uspešno dohvate podaci iz Firestore
      state.followingUserIds = action.payload.map(
        (item) => item.followingId
      );

      state.docIdsByUser = {};
      for (const item of action.payload) {
        state.docIdsByUser[item.followingId] = item.id;
      }
    });
  },
});

export const { addFollowing, removeFollowing } = followersSlice.actions;
export default followersSlice.reducer;
