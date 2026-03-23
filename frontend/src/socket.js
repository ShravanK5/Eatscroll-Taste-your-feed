import { io } from 'socket.io-client';
import { API_BASE_URL } from './config';
// Connect exactly to the port your backend is running on!

const socket = io(API_BASE_URL);

export default socket;