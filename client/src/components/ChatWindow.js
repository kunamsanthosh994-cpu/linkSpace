import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../services/api';
import { socket } from '../services/socket';
import { Paperclip, Send } from './Icons';
import { formatMessageTimestamp, formatDateSeparator } from '../utils/formatTimestamp';

const DateSeparator = ({ date }) => (
    <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-xs text-gray-400 font-semibold">{date}</span>
        <div className="flex-grow border-t border-gray-600"></div>
    </div>
);

const ChatWindow = ({ conversation }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!conversation) {
            setMessages([]);
            return;
        }
        socket.emit('joinConversation', conversation.id);
        const fetchMessages = async () => {
            try {
                const data = await apiRequest(`/conversations/${conversation.id}/messages`);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
                setMessages([]);
            }
        };
        fetchMessages();
        const handleNewMessage = (newMessage) => {
            if (newMessage.conversationId === conversation.id) {
                setMessages(prev => [...prev, newMessage]);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [conversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim() && conversation) {
            const messagePayload = { conversationId: conversation.id, senderId: user.id, text: inputValue };
            const optimisticMessage = { ...messagePayload, id: Date.now(), timestamp: { _seconds: Date.now() / 1000 }, senderUsername: user.username };
            setMessages(prev => [...prev, optimisticMessage]);
            socket.emit('sendMessage', messagePayload);
            setInputValue('');
        }
    };

    if (!conversation) {
        return <div className="flex-1 bg-[#313338] items-center justify-center text-gray-400 hidden md:flex">Select a conversation to start chatting</div>;
    }

    return (
        <div className="flex-1 bg-[#313338] flex flex-col">
            <header className="flex items-center p-4 border-b border-gray-700">
                <img src={conversation.avatar} alt={conversation.name} className="h-10 w-10 rounded-full mr-4" />
                <div>
                    <h3 className="font-bold text-white">{conversation.name}</h3>
                    {conversation.type === 'group' && <p className="text-xs text-gray-400">{conversation.participants.length} members</p>}
                </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
                {messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const showDateSeparator = !prevMsg || formatDateSeparator(msg.timestamp) !== formatDateSeparator(prevMsg.timestamp);
                    const isSystemMessage = msg.senderId === 'system';
                    const isGroupMessage = conversation.type === 'group' && msg.senderId !== user.id && !isSystemMessage;

                    if (isSystemMessage) {
                        return <div key={msg.id} className="text-center text-xs text-gray-400 italic my-2">{msg.text}</div>;
                    }

                    return (
                        <React.Fragment key={msg.id}>
                            {showDateSeparator && <DateSeparator date={formatDateSeparator(msg.timestamp)} />}
                            <div className={`flex items-end gap-3 my-1 ${msg.senderId === user.id ? 'flex-row-reverse' : ''}`}>
                                <div className={`px-3 py-2 rounded-2xl max-w-md ${msg.senderId === user.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[#3f4147] text-gray-300 rounded-bl-none'}`}>
                                    {isGroupMessage && <p className="text-xs font-bold text-indigo-300 mb-1">{msg.senderUsername}</p>}
                                    <p className="text-sm break-words">{msg.text}</p>
                                    <p className="text-xs text-gray-200/70 text-right mt-1">{formatMessageTimestamp(msg.timestamp)}</p>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4">
                <form onSubmit={handleSend} className="flex items-center bg-[#3f4147] rounded-lg p-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-white"><Paperclip /></button>
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Write a message..." className="flex-1 bg-transparent text-gray-300 px-2 focus:outline-none" />
                    <button type="submit" className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500" disabled={!inputValue.trim()}><Send /></button>
                </form>
            </footer>
        </div>
    );
};

export default ChatWindow;
