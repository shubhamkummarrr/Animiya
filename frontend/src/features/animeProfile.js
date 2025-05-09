import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    anime_id: null,
};

const animeId = createSlice({
    name: "anime_id",
    initialState,
    reducers: {
        setAnimeId(state, action) {
            state.anime_id = action.payload.anime_id;
        },
        unSetAnimeId(state) {
            state.anime_id = null;
        },
    },
});

export const { setAnimeId, unSetAnimeId } = animeId.actions;
export default animeId.reducer;
