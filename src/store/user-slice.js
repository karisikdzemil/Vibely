import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loadingAuth: true,
  },
  reducers: {
    setUser(state, action) {
      const user = action.payload;

      if (!user) {
        state.user = null;
        state.loadingAuth = false;
        return;
      }

      state.user = {
        uid: user.uid,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
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
