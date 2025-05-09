import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/localStorage';
import {
    useUserProfileOthersQuery,
    useGETHomeOpinionsQuery,
    useProfileQuery,
    useUserProfileQuery
} from '../../services/userAuthApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserProfileInfo } from '../../features/userProfile';
import { setUserInfo } from '../../features/userSlice';

const OtherProfiles = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { access_token } = getToken();

    const [currentProfile, setCurrentProfile] = useState({
        name: '',
        bio: '',
        profile_photo: '',
    });

    // RTK Query hooks
    const { data: userData, isSuccess: userSuccess } = useProfileQuery(access_token);
    const { data: profileData, isSuccess: profileSuccess } = useUserProfileQuery(access_token);
    const { data: GETprofileData, isSuccess: GETprofileSuccess } = useGETHomeOpinionsQuery();
    const { data: userProfileOthersData, isSuccess: userProfileOthersSuccess } = useUserProfileOthersQuery(access_token);

    // Load profile data
    useEffect(() => {
        if (userProfileOthersSuccess && userProfileOthersData) {
            const user_profile_id = localStorage.getItem('user_profile_id');
            const profile = userProfileOthersData.find(p => p.id == user_profile_id);

            if (profile) {
                setCurrentProfile({
                    name: profile.name,
                    bio: profile.bio,
                    profile_photo: profile.profile_photo
                });
            }
        }
    }, [userProfileOthersSuccess, userProfileOthersData]);

    // Update user info in Redux
    useEffect(() => {
        if (userSuccess && userData) {
            dispatch(setUserInfo({
                name: userData.name,
                email: userData.email
            }));
        }
    }, [userSuccess, userData, dispatch]);

    // Update profile info in Redux
    useEffect(() => {
        if (profileSuccess && profileData?.length > 0) {
            const profile = profileData[0];
            dispatch(setUserProfileInfo({
                name: profile.name,
                email: profile.user,
                bio: profile.bio,
                image: profile.profile_photo,
            }));
        }
    }, [profileSuccess, profileData, dispatch]);

    const handleProfileClick = (profileId) => {
        localStorage.setItem('user_profile_id', profileId);
        navigate('/OtherProfiles');
        window.location.reload(); // Force refresh to load new profile
    };

    console.log(GETprofileData)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 py-40">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-400 to-blue-900 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <img
                                    src={currentProfile.profile_photo || "https://i.ibb.co/6RJ5hq3/anime-avatar.png"}
                                    alt="Profile"
                                    className="w-45 h-50 border-1 border-white rounded-t-2xl object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://i.ibb.co/6RJ5hq3/anime-avatar.png";
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">
                                    {currentProfile.name || "Anime Fan"}
                                </h1>
                                <p className="text-gray-300">
                                    {currentProfile.bio || "Hardcore anime fan with a passion for various genres"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* Community Profiles */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Community Profiles</h2>
                                {userProfileOthersData ? (
                                    userProfileOthersData.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {userProfileOthersData.map((profile) => (
                                                <div key={profile.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center p-4">
                                                    <div className="relative mb-3">
                                                        <img
                                                            src={profile.profile_photo || "https://i.ibb.co/6RJ5hq3/anime-avatar.png"}
                                                            alt="Profile"
                                                            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://i.ibb.co/6RJ5hq3/anime-avatar.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-center text-white">
                                                        {profile.name || "Anonymous User"}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 text-center line-clamp-2 mt-1">
                                                        {profile.bio || "No bio yet"}
                                                    </p>
                                                    <button
                                                        onClick={() => handleProfileClick(profile.id)}
                                                        className="mt-3 px-3 py-1 bg-purple-600/80 hover:bg-purple-600 rounded-full text-xs font-medium transition duration-200"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400">No community profiles found</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[...Array(4)].map((_, index) => (
                                            <div key={index} className="bg-gray-900 rounded-xl p-4 flex flex-col items-center">
                                                <div className="w-24 h-24 rounded-full bg-gray-700 animate-pulse mb-3"></div>
                                                <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                                                <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Favorite Characters */}
                            {GETprofileSuccess && (
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold mb-4">Favorite Characters</h2>
                                    {GETprofileData?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-auto">
                                            {GETprofileData.map((anime, index) => (
                                                <div key={index} className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                                                    <img
                                                        src={anime.char_img_url || anime.img_url}
                                                        alt={anime.char_name || anime.name}
                                                        className="w-full h-64 object-cover"
                                                    />
                                                    <div className="p-4">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            {anime.char_name || anime.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mb-2">
                                                            {anime.anime_name || anime.English_name}
                                                        </p>
                                                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                                                            - {anime.opinion}
                                                        </p>
                                                        <p className="text-sm text-gray-300">
                                                            {anime.agree} Agree | {anime.disagree} Disagree
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400">No favorite characters found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Account Info */}
                        <div className="space-y-8">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Email</h3>
                                        <p className="text-gray-300">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Member Since</h3>
                                        <p className="text-gray-300">
                                            {new Date(userData?.date_joined).getFullYear() || "2023"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherProfiles;