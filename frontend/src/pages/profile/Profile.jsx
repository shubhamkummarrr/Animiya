import React, { useState, useEffect } from 'react';
import { getToken, removeToken } from '../../services/localStorage';
import { useUserProfileOthersQuery, useGETHomeOpinionsQuery, useProfileQuery, useUserProfilePatchMutation, useRefreshMutation, useUserProfileQuery } from '../../services/userAuthApi';
import { useDispatch } from 'react-redux';
import { setUserInfo, unSetUserInfo } from '../../features/userSlice';
import { setAccessToken, unSetAccessToken } from '../../features/authSlice';
import { setUserProfileInfo, unSetUserProfileInfo } from '../../features/userProfile';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { access_token, refresh_token } = getToken();

    // State for editable fields
    const [editableFields, setEditableFields] = useState({
        name: '',
        bio: '',
        profile_photo: null
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    // RTK Query hooks
    const [userProfilePatch] = useUserProfilePatchMutation();
    const { data: userData, isSuccess: userSuccess } = useProfileQuery(access_token);
    const { data: profileData, isSuccess: profileSuccess } = useUserProfileQuery(access_token);
    const { data: GETprofileData, isSuccess: GETprofileSuccess } = useGETHomeOpinionsQuery();
    const { data: userProfileOthersData, isSuccess: userProfileOthersSuccess } = useUserProfileOthersQuery(access_token);
    console.log("userProfileOthersData", userProfileOthersData);
    const [refresh] = useRefreshMutation();

    // Initialize editable fields when profile data loads
    useEffect(() => {
        if (profileSuccess && profileData?.[0]) {
            setEditableFields({
                name: profileData[0].name || '',
                bio: profileData[0].bio || '',
                profile_photo: profileData[0].profile_photo || null
            });
        }
    }, [profileSuccess, profileData]);

    // Update profile field
    const handlePatch = async (field, value) => {
        try {
            const formData = new FormData();
            formData.append(field, value);

            const profileId = profileData?.[0]?.id;
            if (!profileId) {
                console.error("No profile ID found");
                return;
            }

            const response = await userProfilePatch({
                id: profileId,
                data: formData,
                access_token
            }).unwrap();

            if (response) {
                setEditableFields(prev => ({
                    ...prev,
                    [field]: field === 'profile_photo' ? URL.createObjectURL(value) : value
                }));
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    // Handlers for different field types
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            handlePatch('profile_photo', file);
        }
    };

    const handleNameChange = (e) => {
        setEditableFields(prev => ({ ...prev, name: e.target.value }));
    };

    const handleBioChange = (e) => {
        setEditableFields(prev => ({ ...prev, bio: e.target.value }));
    };

    const saveName = () => {
        handlePatch('name', editableFields.name);
        setIsEditingName(false);
    };

    const saveBio = () => {
        handlePatch('bio', editableFields.bio);
        setIsEditingBio(false);
    };

    // Logout Function
    const handleLogout = () => {
        removeToken();
        dispatch(unSetUserInfo());
        dispatch(unSetUserProfileInfo());
        dispatch(unSetAccessToken());
        navigate('/login');
    };

    const handleRefresh = async () => {
        if (refresh_token) {
            try {
                const res = await refresh(refresh_token).unwrap();
                localStorage.setItem('access_token', res.access);
                localStorage.setItem('refresh_token', refresh_token);
                dispatch(setAccessToken({ access_token: res.access, refresh_token }));
            } catch (err) {
                console.error("Token Refresh Error:", err);
            }
        }
    };

    // Update Redux store with user info
    useEffect(() => {
        if (userSuccess && userData) {
            dispatch(setUserInfo({ name: userData.name, email: userData.email }));
        }
    }, [userSuccess, userData, dispatch]);

    // Update Redux store with profile info
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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="pt-16">
                {/* Profile Header */}
                <div className="max-w-7xl mx-auto px-4 py-40">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-900 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-6">
                            {/* Profile Image with Upload */}
                            <div className="relative group">
                                <img
                                    src={editableFields.profile_photo || profileData?.[0]?.profile_photo || "https://i.ibb.co/6RJ5hq3/anime-avatar.png"}
                                    alt="Profile"
                                    className="w-45 h-50 border-1 border-white rounded-t-2xl object-cover"
                                />
                                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-t-2xl">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                    <span className="text-white">Change Photo</span>
                                </label>
                            </div>

                            {/* Editable Name */}
                            <div className="space-y-2">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editableFields.name}
                                            onChange={handleNameChange}
                                            className="text-3xl font-bold bg-gray-800 text-white p-1 rounded"
                                        />
                                        <button
                                            onClick={saveName}
                                            className="bg-blue-500 px-2 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingName(false)}
                                            className="bg-gray-500 px-2 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-3xl font-bold">
                                            {editableFields.name || userData?.name || "Anime Fan"}
                                        </h1>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                className='h-[3vh] rounded bg-white p-1 mb-2'
                                                src="pencil.png"
                                                alt="Edit"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        {/* Left Section */}
                        <div className="md:col-span-2 space-y-8">
                            {/* About Section */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                                {isEditingBio ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editableFields.bio}
                                            onChange={handleBioChange}
                                            className="w-full bg-gray-800 text-white p-2 rounded h-32"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveBio}
                                                className="bg-blue-500 px-3 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditingBio(false)}
                                                className="bg-gray-500 px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <p className="text-gray-300 flex-1">
                                            {editableFields.bio || "Hardcore anime fan with a passion for various genres. Love discovering hidden gems!"}
                                        </p>
                                        <button
                                            onClick={() => setIsEditingBio(true)}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                className='h-[3vh] rounded bg-white p-1'
                                                src="pencil.png"
                                                alt="Edit"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Rest of your existing content... */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Community Profiles</h2>
                                {userProfileOthersData ? (
                                    userProfileOthersData.length > 0 ? (
                                        <div className="overflow-y-auto max-h-[550px]"> {/* Vertical scroll with fixed height */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"> {/* Responsive columns */}
                                                {userProfileOthersData.map((profile) => (
                                                    <div
                                                        key={profile.id}
                                                        className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center p-4"
                                                    >
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
                                                            onClick={() => {
                                                                localStorage.removeItem('user_profile_id');
                                                                localStorage.setItem('user_profile_id', profile.id);
                                                                navigate('/OtherProfiles');
                                                            }}
                                                            className="mt-3 px-3 py-1 bg-purple-600/80 hover:bg-purple-600 rounded-full text-xs font-medium transition duration-200"
                                                        >
                                                            View Profile
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400">No community profiles found</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"> {/* Same responsive grid for loading state */}
                                        {[...Array(8)].map((_, index) => ( // 8 items for 2 rows (4x2)
                                            <div key={index} className="bg-gray-900 rounded-xl p-4 flex flex-col items-center">
                                                <div className="w-24 h-24 rounded-full bg-gray-700 animate-pulse mb-3"></div>
                                                <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                                                <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Favorite Characters Section */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Favorite Characters</h2>
                                {GETprofileSuccess && GETprofileData ? (
                                    GETprofileData.length > 0 ? (
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
                                    )
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400">Loading recommendations...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="space-y-8">
                            {/* Account Info */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Email</h3>
                                        <p className="text-gray-300">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Member Since</h3>
                                        <p className="text-gray-300">2023 (example)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                                <button
                                    onClick={handleRefresh}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                                >
                                    Refresh Token
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;