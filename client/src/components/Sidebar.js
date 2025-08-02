import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Copy, LogOut, Users } from './Icons';

const Sidebar = ({ onAddFriendClick, onCreateGroupClick }) => {
    const { logout, user } = useAuth();

    const copyToClipboard = () => {
        if (user?.inviteCode) {
            navigator.clipboard.writeText(user.inviteCode);
        }
    };

    if (!user) {
        return <div className="w-64 bg-[#1e1f24]"></div>;
    }

    return (
        <div className="w-64 bg-[#1e1f24] text-gray-300 flex-col p-4 hidden md:flex">
            <div className="text-2xl font-bold mb-6 text-white">LinkSpace</div>
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <img src={`https://placehold.co/100x100/6366f1/ffffff?text=${user.username.charAt(0).toUpperCase()}`} alt="User Avatar" className="h-12 w-12 rounded-full mr-3" />
                    <div>
                        <h4 className="font-semibold text-white">{user.username}</h4>
                        <p className="text-xs text-gray-400">Welcome back!</p>
                    </div>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">My Invite Code</p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-indigo-300">{user.inviteCode || '...'}</span>
                        <button onClick={copyToClipboard} className="p-1 hover:bg-gray-600 rounded">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
                <button onClick={onAddFriendClick} className="flex items-center justify-center w-full p-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Join/Add
                </button>
                <button onClick={onCreateGroupClick} className="flex items-center justify-center w-full p-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    <Users className="h-5 w-5 mr-2" />
                    Create Group
                </button>
            </div>
            <div className="mt-auto">
                <button onClick={logout} className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
