import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRegistrationMutation, useUserProfilePostMutation } from '../services/userAuthApi';
import { Link, useNavigate } from 'react-router-dom';
import { setAccessToken } from '../features/authSlice';
import { getToken, storeToken } from '../services/localStorage';


const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        tc: false,
    });

    const [userProfilePost] = useUserProfilePostMutation();
    const [error, setError] = useState({});
    const [registration, { isLoading }] = useRegistrationMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registration(formData);
            if (res.error) {
                setError(res.error.data.errors || {});
                console.error(res.error);
            } else {
                storeToken(res.data.token);
                let { access_token } = getToken();
                dispatch(setAccessToken({ access_token: access_token }));
                setError({});
                navigate('/profile');
                const userProfile = {
                    name: formData.name,
                };
                const userProfileRes = await userProfilePost(userProfile);
                if (userProfileRes.error) {
                    console.error(userProfileRes.error);
                } else {
                    console.log("User profile updated successfully:", userProfileRes.data);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white px-4 pt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
            >
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-300">Sign up to get started</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-gray-300">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                    />
                    {error.name && <p className="text-red-500 mt-1">{error.name}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-gray-300">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                    />
                    {error.email && <p className="text-red-500 mt-1">{error.email}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                    />
                    {error.password && <p className="text-red-500 mt-1">{error.password}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password2" className="block mb-2 text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                    />
                    {error.password2 && <p className="text-red-500 mt-1">{error.password2}</p>}
                </div>

                <div className="mb-4 flex items-center">
                    <label className="flex items-center text-gray-300">
                        <input
                            type="checkbox"
                            name="tc"
                            checked={formData.tc}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        I accept the terms and conditions
                    </label>
                </div>


                {error.non_field_errors && (
                    <p className="text-red-500 text-center mb-3">{error.non_field_errors[0]}</p>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95"
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>

                <div className="text-center mt-4">
                    <p className="text-gray-300">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-200 hover:text-purple-400 font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Registration;
