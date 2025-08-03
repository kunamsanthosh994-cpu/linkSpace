// client/src/services/socket.js
import { io } from 'socket.io-client';
// Connect to the server that is hosting the website
export const socket = io(window.location.origin);
