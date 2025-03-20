import React, { useEffect, useState } from 'react';
import { setAccessToken } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/localStorage';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState({});
    const [Login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Login(formData);
            if (res.error) {
                setError(res.error.data.errors || {});
                console.error(res.error);
            } else {
                console.log(res.data.token);
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

    let { access_token } = getToken()
    useEffect(() => {
        dispatch(setAccessToken({ access_token: access_token }))
    }, [access_token, dispatch])


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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
                {error.non_fields_error && <p className="text-red-500">{error.non_fields_error}</p>}
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

export default Login;
