import React, { useEffect, useState } from 'react';
import { setAccessToken } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/localStorage';
import { Link, useNavigate } from 'react-router-dom';



const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState({});
    const [Login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Login(formData);
            if (res.error) {
                setError(res.error.data.errors || {});
            } else {
                storeToken(res.data.token);
                let { access_token, refresh_token } = getToken();
                dispatch(setAccessToken({ access_token, refresh_token }));
                setError({});
                navigate('/profile');

            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    let { access_token, refresh_token } = getToken();
    useEffect(() => {
        dispatch(setAccessToken({ access_token, refresh_token }));
    }, [access_token, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white px-4 pt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
            >
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-300">Login to your account</p>
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

                {error.non_fields_error && (
                    <p className="text-red-500 text-center mb-3">{error.non_fields_error}</p>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95"
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>
                <p className="text-center text-gray-300 mt-4">
                    Don't have an account?{' '}
                    <Link to="/registration" className="text-purple-200 hover:text-purple-400 font-semibold">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
