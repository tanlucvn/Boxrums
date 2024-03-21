import { io } from 'socket.io-client';
import { BACKEND } from './Constants';

const Socket = io(BACKEND)

export const joinToRoom = (room, payload) => {
    Socket.emit('join', { room, payload })
}

export const leaveFromRoom = (room) => {
    Socket.emit('leave', { room })
}

export default Socket;
