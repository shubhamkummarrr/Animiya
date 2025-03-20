// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuth = createApi({
    reducerPath: 'userAuth',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
    endpoints: (builder) => ({
        registration: builder.mutation({
            query: (user) => ({
                url: 'api/registration/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }),
        login: builder.mutation({
            query: (user) => ({
                url: 'api/login/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }),
        profile: builder.query({
            query: (access_token) => ({
                url: 'api/profile/',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            })
        }),
        userProfile: builder.query({
            query: (access_token) => ({
                url: 'api/user-profile/',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            })
        })
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegistrationMutation, useLoginMutation, useProfileQuery, useUserProfileQuery } = userAuth

