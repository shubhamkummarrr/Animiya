import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:'',
    name:'',
    bio:'',
    image:'',
};

const userProfile = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        setUserProfileInfo(state, action) {
            state.user = action.payload.user;
            state.name = action.payload.name;
            state.bio = action.payload.bio;
            state.image = action.payload.image;
        },
        unSetUserProfileInfo(state) {
            state.user = '';
            state.name = '';
            state.bio = '';
            state.image = '';
        },
    },
});

export const { setUserProfileInfo, unSetUserProfileInfo } = userProfile.actions;
export default userProfile.reducer;