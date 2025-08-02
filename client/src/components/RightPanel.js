import React from 'react';
import { Copy } from './Icons';

const RightPanel = ({ conversation, onlineUsers }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };
    if (!conversation) {
        return (
            <div className="w-80 bg-[#292a2f] text-gray-300 flex-col p-6 border-l border-gray-700 hidden lg:flex">
                <h3 className="font-bold text-white mb-4">Conversation Info</h3>
                <p className="text-sm text-gray-400">Select a conversation to see its details.</p>
            </div>
        );
    }
    const isOnline = conversation.type === 'private' && onlineUsers.includes(conversation.otherParticipantId);
    return (
        <div className="w-80 bg-[#292a2f] text-gray-300 flex-col p-6 border-l border-gray-700 hidden lg:flex">
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <img src={conversation.avatar} alt={conversation.name} className="h-24 w-24 rounded-full mx-auto mb-4" />
                    {isOnline && <div className="absolute bottom-4 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-[#292a2f]"></div>}
                </div>
                <h3 className="font-bold text-lg text-white">{conversation.name}</h3>
                {conversation.type === 'group' 
                    ? <p className="text-sm text-gray-400">{conversation.participants.length} members</p>
                    : <p className={`text-sm ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>{isOnline ? 'Online' : 'Offline'}</p>
                }
            </div>
            {conversation.type === 'group' && (
                <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Group Invite Code</p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-md text-indigo-300">{conversation.inviteCode}</span>
                        <button onClick={() => copyToClipboard(conversation.inviteCode)} className="p-1 hover:bg-gray-600 rounded"><Copy className="h-5 w-5" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default RightPanel;
