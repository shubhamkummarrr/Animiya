import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    access_token: null,
    refresh_token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action) {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token; // Ensure payload structure matches
        },
        unSetAccessToken(state) {
            state.access_token = null;
            state.refresh_token = null;
        },
    },
});

export const { setAccessToken, unSetAccessToken } = authSlice.actions;
export default authSlice.reducer;
