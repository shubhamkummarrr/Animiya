import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRegistrationMutation } from '../services/userAuthApi';
import { useNavigate } from 'react-router-dom';
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
                console.log(res.data);
                storeToken(res.data.token);
                let { access_token } = getToken();
                dispatch(setAccessToken({ access_token: access_token }));
                setError({});
                navigate('/profile');
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Registration</h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {error.name && <p className="text-red-500">{error.name}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {error.email && <p className="text-red-500">{error.email}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {error.password && <p className="text-red-500">{error.password}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password2" className="block mb-2">Confirm Password</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {error.password2 && <p className="text-red-500">{error.password2}</p>}
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        name="tc"
                        checked={formData.tc}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label>I accept the terms and conditions</label>
                </div>
                {error.non_field_errors && <p className="text-red-500">{error.non_field_errors[0]}</p>}
                <br />
                <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Registration;
