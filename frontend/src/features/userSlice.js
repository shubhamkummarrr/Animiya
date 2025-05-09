import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        unSetUserInfo(state, action) {
            state.name = '';
            state.email = '';
        },
    },
})

export const { setUserInfo, unSetUserInfo } = userSlice.actions
export default userSlice.reducer