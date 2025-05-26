import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loadingAuth: true,
  },
  reducers: {
    setUser(state, action) {
      state.user = {
        uid: action.payload.uid,
        username: action.payload.username,
        email: action.payload.email,
        profilePicture: action.payload.profilePicture,
      };
      state.loadingAuth = false;
    },
    clearUser(state) {
      state.user = null;
      state.loadingAuth = false;
    },
    finishLoading(state) {
      state.loadingAuth = false;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;