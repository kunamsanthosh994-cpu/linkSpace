import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout'; // Import the new layout

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Connect with your colleagues" 
            subtitle="The internal communication tool for seamless teamwork."
        >
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 text-left mb-6">Login to your Corporate Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-600">EMAIL</label>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">PASSWORD</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-[#008080] text-white hover:bg-teal-700 rounded-md font-semibold transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account? <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">Sign Up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
