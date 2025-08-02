import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search } from './Icons';
import { formatMessageTimestamp } from '../utils/formatTimestamp';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, isLoading, onlineUsers }) => {
    const { user } = useAuth();
    if (isLoading) return <div className="w-full md:w-80 bg-[#292a2f] p-4 text-gray-400">Loading conversations...</div>;
    return (
        <div className="w-full md:w-80 bg-[#292a2f] text-gray-300 flex flex-col p-4 border-r border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full bg-[#1e1f24] border border-gray-600 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                {conversations.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">No conversations yet. Add a friend or join a group!</div>
                ) : (
                    conversations.map(convo => {
                        const unreadCount = (convo.unreadCounts && user) ? convo.unreadCounts[user.id] : 0;
                        const isOnline = convo.type === 'private' && onlineUsers.includes(convo.otherParticipantId);
                        return (
                            <div key={convo.id} onClick={() => onSelectConversation(convo)} className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 mb-2 ${selectedConversation?.id === convo.id ? 'bg-indigo-500/20' : ''}`}>
                                <div className="relative">
                                    <img src={convo.avatar} alt={convo.name} className="h-12 w-12 rounded-full mr-4" />
                                    {isOnline && <div className="absolute bottom-0 right-4 h-3 w-3 bg-green-500 rounded-full border-2 border-[#292a2f]"></div>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-white text-sm truncate">{convo.name}</h4>
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatMessageTimestamp(convo.lastMessageTimestamp)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-400 truncate">{convo.lastMessage || 'No messages yet'}</p>
                                        {unreadCount > 0 && (<span className="bg-indigo-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">{unreadCount}</span>)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
export default ConversationList;
