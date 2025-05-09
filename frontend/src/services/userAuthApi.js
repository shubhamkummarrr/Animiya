// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAccessToken, unSetAccessToken } from '../features/authSlice';


// Custom baseQuery to handle token refresh
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const refreshResult = await baseQuery(
                    { url: 'api/refresh/', method: 'POST', body: { refresh: refreshToken } },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    localStorage.setItem('access_token', refreshResult.data.access);
                    api.dispatch(setAccessToken({ access_token: refreshResult.data.access, refresh_token: refreshToken }));
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    api.dispatch(unSetAccessToken());
                }
            } catch (error) {
                console.error("Error refreshing token", error);
            }
        }
    }
    return result;
};

export const userAuth = createApi({
    reducerPath: 'userAuth',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        registration: builder.mutation({
            query: (user) => ({
                url: 'api/registration/',
                method: 'POST',
                body: user,
                headers: { 'Content-Type': 'application/json' },
            })
        }),
        login: builder.mutation({
            query: (user) => ({
                url: 'api/login/',
                method: 'POST',
                body: user,
                headers: { 'Content-Type': 'application/json' },
            })
        }),
        profile: builder.query({
            query: () => ({
                url: 'api/profile/',
                method: 'GET',
            })
        }),
        userProfile: builder.query({
            query: () => ({
                url: 'api/user-profile/',
                method: 'GET',
            })
        }),
        userProfilePatch: builder.mutation({
            query: ({ id, data, access_token }) => ({
                url: `/api/user-profile/${id}/`,  // Note the trailing slash and ID in URL
                method: 'PATCH',
                body: data,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }),
        }),
        userProfilePost: builder.mutation({
            query: ({ data, access_token }) => ({
                url: `/api/user-profile/`,  // Note the trailing slash and ID in URL
                method: 'POST',
                body: data,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }),
        }),
        userProfileOthers: builder.query({
            query: () => ({
                url: `/api/userprofiles/others/`,  // Note the trailing slash and ID in URL
                method: 'GET',
            }),
        }),
        refresh: builder.mutation({
            query: (refreshToken) => ({
                url: 'api/refresh/',
                method: 'POST',
                body: { refresh: refreshToken },
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        CSVData: builder.query({
            query: () => ({
                url: 'api/CSVData/',
                method: 'GET',
            })
        }),
        AnimeNews: builder.query({
            query: () => ({
                url: 'api/anime-news/',
                method: 'GET',
            })
        }),
        HomeOpinions: builder.mutation({
            query: (HomeOpinion) => ({
                url: 'api/home-opinions/',
                method: 'POST',
                body: HomeOpinion,
            })
        }),
        GETHomeOpinions: builder.query({
            query: () => ({
                url: 'api/home-opinions/',
                method: 'GET',
            })
        }),
        ImgDataBase: builder.mutation({
            query: (ImgDataBase) => ({
                url: 'api/img-database/',
                method: 'POST',
                body: ImgDataBase,
            })
        }),
        GETImgDataBase: builder.query({
            query: () => ({
                url: 'api/img-database/',
                method: 'GET',
            })
        }),
        AnimeHome: builder.query({
            query: () => ({
                url: 'api/animehome/',
                method: 'GET',
            })
        }),
        patchOpinionVote: builder.mutation({
            query: (payload) => ({
                url: 'api/img-database/',
                method: 'PATCH',
                body: payload,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        Recommendation: builder.query({
            query: (name) => ({
                url: `api/recommendations/${name}/`,
                method: 'GET',
            }),
        }),
        AnimeProfile: builder.query({
            query: (anime_id) => ({
                url: `api/animeprofile/${anime_id}/`,
                method: 'GET',
            }),
        }),

    })
});

export const { useUserProfileOthersQuery ,useUserProfilePostMutation, useUserProfilePatchMutation, useAnimeProfileQuery, useRegistrationMutation, useLoginMutation, useProfileQuery, useUserProfileQuery, useRefreshMutation, useCSVDataQuery, useAnimeNewsQuery, useHomeOpinionsMutation, useImgDataBaseMutation, useGETImgDataBaseQuery, usePatchOpinionVoteMutation, useGETHomeOpinionsQuery, useAnimeHomeQuery, useRecommendationQuery } = userAuth;
