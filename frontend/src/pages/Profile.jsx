import React, { useEffect, useState } from 'react';
import { getToken } from '../services/localStorage';
import { useProfileQuery, useUserProfileQuery } from '../services/userAuthApi';
import { useDispatch } from 'react-redux';
import { setUserInfo, unSetUserInfo } from '../features/userSlice';
import { setAccessToken, unSetAccessToken } from '../features/authSlice';
import { removeToken } from '../services/localStorage';
import { useNavigate } from 'react-router-dom';
import { setUserProfileInfo, unSetUserProfileInfo } from '../features/userProfile';


const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
    });

    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        bio: '',
        image: '',
    });

    const { access_token } = getToken();
    const { data: profileData, isSuccess: profileIsSuccess, isLoading: profileLoading } = useUserProfileQuery(access_token);
    const { data, isSuccess, isLoading } = useProfileQuery(access_token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        dispatch(unSetUserInfo());
        dispatch(unSetAccessToken());
        navigate('/login');
    };

    useEffect(() => {
        if (isSuccess && data) {
            setUser({
                name: data.name,
                email: data.email,
            });
            console.log(data);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUserInfo({
                name: data.name,
                email: data.email,
            }));
            console.log(data);
            const { access_token } = getToken();
            dispatch(setAccessToken({ access_token: access_token }));
        }
    }, [isSuccess, data, dispatch]);

    useEffect(() => {
        if (profileIsSuccess && profileData) {
            setUserProfile({
                name: profileData[0].name,
                email: profileData[0].user,
                bio: profileData[0].bio,
                image: profileData[0].profile_photo,
            });
            console.log(profileData);
        }
    }, [profileIsSuccess, profileData]);

    useEffect(() => {
        if (profileIsSuccess && profileData) {
            dispatch(setUserProfileInfo({
                name: profileData.name,
                email: profileData.user,
                bio: profileData.bio,
                image: profileData.profile_photo,
            }));
            console.log(profileData);
            const { access_token } = getToken();
            dispatch(setAccessToken({ access_token: access_token }));
        }
    }, [profileIsSuccess, profileData, dispatch]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
                {isLoading && <p className="text-center text-gray-400">Loading...</p>}
                <div className="mb-4">
                    <p className="text-lg">
                        <span className="font-semibold">Name:</span> {user.name}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                </div>

                <br />
                <h2 className="text-xl font-bold mb-4 text-center">Profile Details</h2>
                {profileLoading && <p className="text-center text-gray-400">Loading...</p>}
                <div className="mb-4">
                    <p className="text-lg">
                        <span className="font-semibold">name:</span> {userProfile.name}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Bio:</span> {userProfile.bio}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                    Logout
                </button>
            </div>  
        </div>
    );
};

export default Profile;