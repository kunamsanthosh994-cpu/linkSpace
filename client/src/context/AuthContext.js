import React, { createContext, useState, useEffect, useContext } from 'react';
import apiRequest from '../services/api';
import { socket } from '../services/socket';

const AuthContext = createContext(null);

// **FIX**: Create a Broadcast Channel to sync logout across tabs
const authChannel = new BroadcastChannel('auth_channel');

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // **FIX**: Listen for messages from other tabs
        const handleAuthMessage = (event) => {
            if (event.data === 'logout') {
                setUser(null);
            }
        };
        authChannel.addEventListener('message', handleAuthMessage);

        const token = localStorage.getItem('chat_token');
        if (token) {
            const fetchUser = async () => {
                try {
                    const userData = await apiRequest('/auth/me');
                    setUser(userData);
                    localStorage.setItem('chat_user', JSON.stringify(userData));
                    socket.emit('storeUserId', userData.id);
                } catch (e) {
                    // This will also handle cases where the token is invalid
                    logout(true); // Pass true to prevent broadcasting
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            setLoading(false);
        }

        // Cleanup the listener
        return () => {
            authChannel.removeEventListener('message', handleAuthMessage);
        };
    }, []);

    const login = async (email, password) => {
        const { token, user: userData } = await apiRequest('/auth/login', 'POST', { email, password });
        localStorage.setItem('chat_token', token);
        localStorage.setItem('chat_user', JSON.stringify(userData));
        setUser(userData);
        socket.emit('storeUserId', userData.id);
    };

    const register = async (username, email, password) => {
        const { token, user: userData } = await apiRequest('/auth/register', 'POST', { username, email, password });
        localStorage.setItem('chat_token', token);
        localStorage.setItem('chat_user', JSON.stringify(userData));
        setUser(userData);
        socket.emit('storeUserId', userData.id);
    };

    const logout = (isBroadcasted = false) => {
        localStorage.removeItem('chat_token');
        localStorage.removeItem('chat_user');
        setUser(null);
        // **FIX**: If this logout was initiated by the user (not by a broadcast),
        // send a message to all other tabs to log them out too.
        if (!isBroadcasted) {
            authChannel.postMessage('logout');
        }
    };

    const value = { user, login, register, logout, isAuthenticated: !!user, isLoading: loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);