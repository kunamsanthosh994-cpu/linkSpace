import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout'; // Import the new layout

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join your Team"
            subtitle="Create an account to start collaborating with your colleagues."
        >
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 text-left mb-6">Create your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-600">FULL NAME</label>
                        <input 
                            type="text" 
                            placeholder="Your full name" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">COMPANY EMAIL</label>
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
                        {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account? <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">Sign In</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;

