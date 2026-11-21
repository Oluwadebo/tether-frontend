'use client';
import { io, Socket } from 'socket.io-client';
import { API_URL, token } from './api';

let socket: Socket | null = null;

/** One shared live connection. The login token is sent on every (re)connect. */
export function getSocket(): Socket {
  if (!socket) socket = io(API_URL, { autoConnect: false, auth: (cb) => cb({ token: token.get() }) });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
