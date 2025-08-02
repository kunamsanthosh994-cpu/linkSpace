import React, { useState } from 'react';
import apiRequest from '../services/api';

const AddFriendModal = ({ isOpen, onClose, onConversationJoined }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [joinType, setJoinType] = useState('friend');

    if (!isOpen) return null;

    const handleClose = () => {
        setInviteCode('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const endpoint = joinType === 'friend' ? '/friends/add' : '/groups/join';
        try {
            const response = await apiRequest(endpoint, 'POST', { inviteCode });
            onConversationJoined(response.conversation);
            handleClose();
        } catch (err) {
            setError(err.message || `Failed to ${joinType === 'friend' ? 'add friend' : 'join group'}.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#292a2f] p-8 rounded-xl shadow-lg w-full max-w-md text-white">
                <div className="flex border-b border-gray-700 mb-4">
                    <button onClick={() => setJoinType('friend')} className={`py-2 px-4 text-sm font-medium ${joinType === 'friend' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Add Friend</button>
                    <button onClick={() => setJoinType('group')} className={`py-2 px-4 text-sm font-medium ${joinType === 'group' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400'}`}>Join Group</button>
                </div>
                <h2 className="text-2xl font-bold mb-2">{joinType === 'friend' ? 'Add a Friend' : 'Join a Group'}</h2>
                <p className="text-sm text-gray-400 mb-6">Enter a unique invite code to start a conversation.</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="XXXX-XXXX" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="w-full px-4 py-2 bg-[#1e1f24] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" required />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors disabled:bg-gray-500">{isLoading ? 'Joining...' : 'Join'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFriendModal;
