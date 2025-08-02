import React, { useState } from 'react';
import apiRequest from '../services/api';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setName('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await apiRequest('/groups/create', 'POST', { name });
            onGroupCreated(response.conversation);
            handleClose();
        } catch (err) {
            setError(err.message || 'Failed to create group.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#292a2f] p-8 rounded-xl shadow-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1e1f24] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors disabled:bg-gray-500">{isLoading ? 'Creating...' : 'Create Group'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;