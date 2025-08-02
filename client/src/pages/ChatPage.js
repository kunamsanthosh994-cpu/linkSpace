import React, { useState, useEffect } from 'react';
import apiRequest from '../services/api';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import RightPanel from '../components/RightPanel';
import AddFriendModal from '../components/AddFriendModal';
import CreateGroupModal from '../components/CreateGroupModal';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useAuth();
    useEffect(() => {
        if (!user) return;
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const data = await apiRequest('/conversations');
                setConversations(data);
                if (data.length > 0 && !selectedConversation) {
                    setSelectedConversation(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversations();
        const handleNewConversation = (newConversation) => {
            setConversations(prev => [newConversation, ...prev]);
        };
        socket.on('newConversation', handleNewConversation);
        const handleUpdateUnreadCount = ({ conversationId, count }) => {
            setConversations(prevConvos => 
                prevConvos.map(convo => 
                    convo.id === conversationId 
                        ? { ...convo, unreadCounts: { ...convo.unreadCounts, [user.id]: count } }
                        : convo
                )
            );
        };
        socket.on('updateUnreadCount', handleUpdateUnreadCount);
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };
        socket.on('onlineUsers', handleOnlineUsers);
        return () => {
            socket.off('newConversation', handleNewConversation);
            socket.off('updateUnreadCount', handleUpdateUnreadCount);
            socket.off('onlineUsers', handleOnlineUsers);
        };
    }, [user]);
    const handleConversationJoined = (newConversation) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
    };
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        if (user && conversation.unreadCounts && conversation.unreadCounts[user.id] > 0) {
            apiRequest(`/conversations/${conversation.id}/read`, 'POST');
            setConversations(prevConvos => 
                prevConvos.map(convo => 
                    convo.id === conversation.id 
                        ? { ...convo, unreadCounts: { ...convo.unreadCounts, [user.id]: 0 } }
                        : convo
                )
            );
        }
    };
    return (
        <>
            <div className="bg-[#1e1f24] font-sans flex h-screen text-white">
                <Sidebar 
                    onAddFriendClick={() => setIsAddFriendModalOpen(true)} 
                    onCreateGroupClick={() => setIsCreateGroupModalOpen(true)}
                />
                <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                    isLoading={isLoading}
                    onlineUsers={onlineUsers}
                />
                <ChatWindow conversation={selectedConversation} />
                <RightPanel 
                    conversation={selectedConversation} 
                    onlineUsers={onlineUsers}
                />
            </div>
            <AddFriendModal
                isOpen={isAddFriendModalOpen}
                onClose={() => setIsAddFriendModalOpen(false)}
                onConversationJoined={handleConversationJoined}
            />
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onGroupCreated={handleConversationJoined}
            />
        </>
    );
};
export default ChatPage;