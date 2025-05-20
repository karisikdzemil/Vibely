import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser(state, action) {
            state.user = {
                uid: action.payload.uid,
                username: action.payload.username,
                email: action.payload.email,
                profilePicture:action.payload.profilePicture
            };
        },
        clearUser(state) {
            state.user = null;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice;
